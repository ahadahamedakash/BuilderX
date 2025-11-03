## BuilderX

Drag-and-drop template builder with auth, MongoDB persistence, and global theming.

### Setup
1. First clone the repository:
```bash
git clone https://github.com/ahadahamedakash/BuilderX.git
```
2. Install dependencies:
```bash
npm install
```

3. Create `.env` in the project root:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

4. Run in dev:
```bash
npm run dev
```

### Auth
- Email/password signup/login using server actions. A JWT is stored as an httpOnly cookie.

### Templates (MongoDB via Mongoose)
- Create, update, list, get, delete templates in `lib/actions/templates.ts`.
- Selected template id is reflected in the URL as `?template=<id>`.

### Editor
- Left: Component palette (drag onto canvas).
- Center: Canvas (sortable; drag to reorder; responsive).
- Right: Property panel plus Global Colors (always visible).

Global Colors
- Primary, Secondary, Tertiary, Text Primary, Text Secondary live in `useBuilderStore().theme`.
- All components render using these colors (component color pickers removed).

Viewport Preview (Desktop only)
- Buttons in top navbar let you preview Mobile (375px), Tablet (768px), Desktop (100%).
- Hidden on tablet/mobile devices; the canvas remains responsive.

### Common Tasks
- Save/Update: Persist the current canvas to your account.
- Projects dropdown: Load any template; URL updates with its id.
- Delete: Remove the current template from your account.
- New Project: Clears canvas and resets current template.

### Environment Notes
- Ensure `MONGODB_URI` is reachable from your environment.
- Keep `JWT_SECRET` long and secret (e.g., 32+ random bytes).

### Tech Stack
- Next.js (App Router), TypeScript
- Zustand (state)
- dnd-kit (drag and drop)
- Mongoose (MongoDB)
- Tailwind + shadcn/ui (UI)
