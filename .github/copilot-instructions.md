# Osystic AI Copilot Instructions

## Architecture Overview

**Osystic** is a full-stack monorepo combining a **Next.js 16 frontend** (`/app`) with a **Django REST backend** (`/backend`).

### Frontend (Next.js)
- **Pages**: Marketing site + dynamic content (blogs, news, careers, services)
- **Admin Panel**: Protected dashboard at `/admin` (blogs/news CRUD)
- **Auth**: NextAuth.js with database sessions via Prisma + PostgreSQL
- **Database**: Prisma ORM with PostgreSQL (blogs, news, users, accounts, sessions)
- **Storage**: Supabase for media uploads (images/videos)
- **Styling**: Tailwind CSS 4 + custom globals.css

### Backend (Django)
- **Purpose**: Legacy CMS infrastructure; content endpoints available
- **Key Apps**: `accounts` (users/auth), `content` (blogs/news), `authbridge`, `core`
- **API**: REST framework with role-based permissions (ADMIN/EDITOR)
- **Media**: Cloudinary integration; local ImageField fallback
- **Admin UI**: Django Jazzmin theme

### Data Flow
1. **Public Site** → Fetches from Prisma PostgreSQL (blogs, news) or backend API
2. **Admin Panel** → NextAuth session → Server actions (createBlog, createNews) → Prisma + Supabase
3. **Backend API** → Django REST endpoints for historical/legacy content

---

## Critical Workflows

### Development Server
```bash
npm run dev              # Next.js frontend on localhost:3000
cd backend && python manage.py runserver  # Django on localhost:8000
```

### Database Setup
```bash
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Apply pending migrations (requires DATABASE_URL)
npx prisma db seed    # Run seed.mjs (defined in package.json)
```

### Admin Authentication
- **Pages**: `/admin/login` (credentials), `/admin` (dashboard), `/admin/blogs`, `/admin/news`
- **Session Check**: `requireAdmin()` in server actions validates role = "ADMIN"
- **Auth Provider**: NextAuth with Credentials (email/bcrypt)
- **Middleware**: `proxy.ts` protects `/admin/*` and `/api/admin/*`

### Building & Deployment
```bash
npm run build           # Next.js production build
npm run lint           # ESLint checks
```

---

## Key Conventions

### Server Actions (Next.js)
- Located in `/app/admin/{blogs,news}/actions.ts`
- Always use `"use server"` directive
- Call `assertAdmin()` for permission checks
- Validate with Zod schemas before database operations
- Example: `createBlog()` accepts FormData with title, excerpt, content, coverImage, video

### API Authorization Patterns
- **Frontend**: `requireAdmin()` - check session role + redirect
- **Backend**: `@permission_classes([IsEditorOrAdmin])` - Django decorator
- **Role Enum**: `ADMIN`, `EDITOR` (defined in Prisma + Django)

### File Uploads
- **Frontend**: `uploadToSupabaseStorage({ file, kind: "images" | "videos" })`
- **Result**: Returns `{ path, publicUrl }` for storage in database
- **Bucket**: "media" (default); generates UUID paths
- **Backend**: Fallback to Cloudinary or local ImageField

### Slug Generation
- Use `slugify(title, { lower: true, strict: true })` for URLs
- Stored as unique in database (blogs/news)
- Route: `/blogs/[slug]` and `/news/[slug]` for public pages

### TypeScript Paths
- `@/*` resolves to root directory (e.g., `@/lib/auth.ts`)
- No external tsconfig path aliases; keep simple

---

## Important Files to Know

| File | Purpose |
|------|---------|
| [prisma/schema.prisma](../../prisma/schema.prisma) | Database schema (User, Blog, News, Sessions) |
| [lib/auth.ts](../../lib/auth.ts) | NextAuth config with Credentials provider + session callbacks |
| [lib/requireAdmin.ts](../../lib/requireAdmin.ts) | Server-side admin permission check |
| [lib/uploadToSupabase.ts](../../lib/uploadToSupabase.ts) | Media upload utility |
| [app/admin/blogs/actions.ts](../../app/admin/blogs/actions.ts) | Blog CRUD server actions |
| [app/admin/news/actions.ts](../../app/admin/news/actions.ts) | News CRUD server actions |
| [next.config.ts](../../next.config.ts) | React Compiler enabled |
| [backend/content/models.py](../../backend/content/models.py) | Django Blog/News models (legacy) |
| [backend/config/settings.py](../../backend/config/settings.py) | Django settings, env vars, middleware |

---

## Common Patterns

### Adding a New Admin Content Type
1. Add model to [prisma/schema.prisma](../../prisma/schema.prisma)
2. Run `npx prisma migrate dev --name add_new_model`
3. Create `app/admin/{name}/actions.ts` with CRUD server actions
4. Create form page at `app/admin/{name}/page.tsx` and `app/admin/{name}/new/page.tsx`
5. Use `requireAdmin()` at top of page/action
6. Validate with Zod, upload files via `uploadToSupabaseStorage()`

### Querying Data in Pages
- **Server Components**: `import { prisma } from "@/lib/prisma"` → direct queries
- **Client Components**: Fetch from `/api/*` endpoints or use server actions
- **Public Content**: Filter `where: { published: true }` to avoid exposing drafts

### Protected Routes
- Admin pages: Check `session?.user?.role === "ADMIN"` via `requireAdmin()`
- Middleware enforces auth for `/admin/*` paths
- Redirect to `/admin/login` on auth failure

---

## Dependencies & Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind 4, Zod, React Hook Form
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: NextAuth.js 4 + Prisma adapter
- **Storage**: Supabase, bcrypt for passwords
- **Backend**: Django 5.2, DRF, Cloudinary, psycopg
- **Linting**: ESLint 9 (config: `eslint.config.mjs`)

---

## Tips for Productivity

1. **Always check role** before sensitive operations (use `requireAdmin()`)
2. **Zod validation** prevents invalid DB writes; validate FormData early in actions
3. **Supabase paths** use UUID to avoid collisions; check upload success
4. **Revalidate paths** in server actions after mutations (e.g., `revalidatePath("/admin/blogs")`)
5. **Slug uniqueness** is enforced; handle "slug already exists" errors gracefully
6. **Environment vars**: Frontend uses `.env.local`, backend uses `backend/.env`
