import React from "react";

export interface ComponentDefinition {
  type: string;
  label: string;
  icon: string;
  defaultProps: Record<string, any>;
  render: (props: Record<string, any>) => React.ReactNode;
  editorFields: Array<{
    key: string;
    label: string;
    type: "text" | "number" | "textarea" | "color" | "select" | "array";
    options?: { value: string; label: string }[];
    arrayItemFields?: Array<{ key: string; label: string; type: string }>;
  }>;
}

// Component definitions - easy to extend
export const componentLibrary: ComponentDefinition[] = [
  {
    type: "navbar",
    label: "Navbar",
    icon: "🧭",
    defaultProps: {
      logo: "Logo",
      links: ["Home", "About", "Services", "Contact"],
      sticky: "false",
    },
    render: (props) => (
      <nav
        style={{
          backgroundColor: props.bgColor,
          color: props.textColor,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position:
            props.sticky === "true" || props.sticky === true
              ? "sticky"
              : "relative",
          top: props.sticky === "true" || props.sticky === true ? "0" : "auto",
          zIndex: 1000,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            color: props.logoColor,
          }}
        >
          {props.logo}
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {props.links.map((link: string, index: number) => (
            <a
              key={index}
              href="#"
              style={{
                color: props.textColor,
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </nav>
    ),
    editorFields: [
      { key: "logo", label: "Logo Text", type: "text" },
      {
        key: "sticky",
        label: "Sticky Navbar",
        type: "select",
        options: [
          { value: "false", label: "No" },
          { value: "true", label: "Yes" },
        ],
      },
    ],
  },
  {
    type: "navbar2",
    label: "Navbar (Centered)",
    icon: "🧭",
    defaultProps: {
      logo: "Brand",
      links: ["Features", "Pricing", "Docs", "Contact"],
      sticky: "false",
    },
    render: (props) => (
      <nav
        style={{
          backgroundColor: props.bgColor,
          color: props.textColor,
          padding: "16px 24px",
          position: props.sticky ? "sticky" : "relative",
          top: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              color: props.logoColor,
            }}
          >
            {props.logo}
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {props.links.map((l: string, i: number) => (
              <a
                key={i}
                href="#"
                style={{
                  color: props.textColor,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </nav>
    ),
    editorFields: [
      { key: "logo", label: "Logo Text", type: "text" },
      {
        key: "sticky",
        label: "Sticky Navbar",
        type: "select",
        options: [
          { value: "false", label: "No" },
          { value: "true", label: "Yes" },
        ],
      },
    ],
  },
  {
    type: "hero",
    label: "Hero Section",
    icon: "🎯",
    defaultProps: {
      title: "Welcome to Our Website",
      subtitle: "This is a compelling hero section that captures attention",
      buttonText: "Get Started",
      alignment: "center",
    },
    render: (props) => (
      <section
        style={{
          backgroundColor: props.bgColor,
          color: props.textColor,
          padding: "80px 24px",
          textAlign: props.alignment,
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            {props.title}
          </h1>
          <p style={{ fontSize: "20px", marginBottom: "32px", opacity: 0.8 }}>
            {props.subtitle}
          </p>
          <button
            style={{
              backgroundColor: props.buttonColor,
              color: props.buttonTextColor,
              padding: "12px 32px",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {props.buttonText}
          </button>
        </div>
      </section>
    ),
    editorFields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "buttonText", label: "Button Text", type: "text" },
      {
        key: "alignment",
        label: "Alignment",
        type: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ],
      },
    ],
  },
  {
    type: "banner",
    label: "Banner Section",
    icon: "📢",
    defaultProps: {
      text: "Special Offer: Get 50% off on all products!",
      alignment: "center",
      padding: "20px",
    },
    render: (props) => (
      <section
        style={{
          backgroundColor: props.bgColor,
          color: props.textColor,
          padding: props.padding,
          textAlign: props.alignment,
        }}
      >
        <p style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
          {props.text}
        </p>
      </section>
    ),
    editorFields: [
      { key: "text", label: "Banner Text", type: "text" },
      {
        key: "alignment",
        label: "Alignment",
        type: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ],
      },
      {
        key: "padding",
        label: "Padding",
        type: "select",
        options: [
          { value: "16px", label: "Small" },
          { value: "20px", label: "Medium" },
          { value: "32px", label: "Large" },
        ],
      },
    ],
  },
  {
    type: "bannerImage",
    label: "Banner (Image)",
    icon: "🖼️",
    defaultProps: {
      text: "Big Sale: Up to 70% Off! ",
      imageUrl: "https://via.placeholder.com/1600x400",
      overlay: "rgba(0,0,0,0.4)",
    },
    render: (props) => (
      <section style={{ position: "relative" }}>
        <div
          style={{
            backgroundImage: `url(${props.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "80px 24px",
            position: "relative",
            color: "#fff",
            height: "300px"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: props.overlay,
            }}
          />
          <div
            style={{
              position: "relative",
              textAlign: "center",
              fontWeight: 700,
              fontSize: "24px",
            }}
          >
            {props.text}
          </div>
        </div>
      </section>
    ),
    editorFields: [
      { key: "text", label: "Banner Text", type: "text" },
      { key: "imageUrl", label: "Background Image URL", type: "text" },
    ],
  },
  {
    type: "cards",
    label: "Cards Section",
    icon: "🃏",
    defaultProps: {
      title: "Our Services",
      columns: "2",
      cards: [
        {
          title: "Service 1",
          description: "Description for service 1",
          image: "/service.png",
        },
        {
          title: "Service 2",
          description: "Description for service 2",
          image: "/service.png",
        },
      ],
    },
    render: (props) => (
      <section
        style={{
          padding: "60px 60px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "40px",
              textAlign: "center",
              color: props.titleColor,
            }}
          >
            {props.title}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Number(props.columns) || 3}, 1fr)`,
              gap: "24px",
            }}
          >
            {props.cards.map((card: any, index: number) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    editorFields: [
      { key: "title", label: "Section Title", type: "text" },
      {
        key: "columns",
        label: "Number of Columns",
        type: "select",
        options: [
          { value: "1", label: "1 Column" },
          { value: "2", label: "2 Columns" },
          { value: "3", label: "3 Columns" },
          { value: "4", label: "4 Columns" },
        ],
      },
      {
        key: "cards",
        label: "Cards",
        type: "array",
        arrayItemFields: [
          { key: "title", label: "Card Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "image", label: "Image URL", type: "text" },
        ],
      },
    ],
  },
  {
    type: "testimonials",
    label: "Testimonials",
    icon: "💬",
    defaultProps: {
      title: "What Our Customers Say",
      testimonials: [
        { quote: "Amazing service and quality!", author: "Jane Doe" },
        { quote: "Highly recommend to everyone.", author: "John Smith" },
      ],
    },
    render: (props) => (
      <section style={{ backgroundColor: props.bgColor, padding: "60px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "24px",
              color: props.titleColor,
            }}
          >
            {props.title}
          </h2>
          <div style={{ display: "grid", gap: "20px" }}>
            {props.testimonials.map((t: any, i: number) => (
              <blockquote
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 20,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <p
                  style={{
                    marginBottom: 8,
                    color: "#111",
                    fontStyle: "italic",
                  }}
                >
                  “{t.quote}”
                </p>
                <span style={{ color: "#555", fontSize: 14 }}>
                  — {t.author}
                </span>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    ),
    editorFields: [
      { key: "title", label: "Section Title", type: "text" },
      {
        key: "testimonials",
        label: "Testimonials",
        type: "array",
        arrayItemFields: [
          { key: "quote", label: "Quote", type: "textarea" },
          { key: "author", label: "Author", type: "text" },
        ],
      },
    ],
  },
  {
    type: "footer",
    label: "Footer",
    icon: "📄",
    defaultProps: {
      text: "© 2024 Your Company. All rights reserved.",
      padding: "40px 24px",
    },
    render: (props) => (
      <footer
        style={{
          backgroundColor: props.bgColor,
          color: props.textColor,
          padding: props.padding,
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>{props.text}</p>
      </footer>
    ),
    editorFields: [
      { key: "text", label: "Footer Text", type: "text" },
      {
        key: "padding",
        label: "Padding",
        type: "select",
        options: [
          { value: "24px 24px", label: "Small" },
          { value: "40px 24px", label: "Medium" },
          { value: "60px 24px", label: "Large" },
        ],
      },
    ],
  },
  {
    type: "footer2",
    label: "Footer (Links)",
    icon: "📄",
    defaultProps: {
      text: "© 2024 Your Company",
      links: ["Privacy", "Terms", "Support"],
    },
    render: (props) => (
      <footer
        style={{
          backgroundColor: props.bgColor,
          color: props.textColor,
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <span>{props.text}</span>
          <div style={{ display: "flex", gap: "16px" }}>
            {props.links.map((l: string, i: number) => (
              <a
                key={i}
                href="#"
                style={{ color: props.textColor, textDecoration: "none" }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    ),
    editorFields: [{ key: "text", label: "Footer Text", type: "text" }],
  },
];

export function getComponentDefinition(
  type: string
): ComponentDefinition | undefined {
  return componentLibrary.find((comp) => comp.type === type);
}
