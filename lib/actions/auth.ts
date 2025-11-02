"use server";

import { cookies } from "next/headers";

import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET: ", JWT_SECRET);

if (!JWT_SECRET) {
  throw new Error(
    "Please define the JWTSECRET environment variable inside .env.local"
  );
}

export interface SignupResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function signupAction(formData: FormData): Promise<SignupResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return {
        success: false,
        message: "All fields are required",
        error: "missing_fields",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long",
        error: "password_too_short",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
        error: "password_mismatch",
      };
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
        error: "email_exists",
      };
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during signup",
      error: "server_error",
    };
  }
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
        error: "missing_fields",
      };
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
        error: "invalid_credentials",
      };
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
        error: "invalid_credentials",
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during login",
      error: "server_error",
    };
  }
}

// export async function getCurrentUser() {
//   const cookieStore = await cookies();
  
//   const token = cookieStore.get("token")?.value;

//   if (!token) return null;

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };

//     await connectDB();
//     const user = await User.findById(decoded.userId).select("-password");

//     return user ? 
//       { id: user._id.toString(), name: user.name, email: user.email } 
//       : null;
//   } catch {
//     return null;
//   }
// }

export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    await connectDB();
    return await User.findById(decoded.userId).select("-password");
  } catch {
    return null;
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  return { success: true };
}
