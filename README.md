# Portfolio App

Production-style personal portfolio built with Next.js App Router, TypeScript, and Supabase as a dynamic backend.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Supabase (PostgreSQL + REST)

## Features

- Dashboard-style homepage with overview panels
- Projects page powered by Supabase with fallback local data
- Contact page with social links and tools marquee
- Resume preview and download
- Theme toggle (oak/slate)
- Admin CRUD API for profile, projects, experience, social links, tool badges, and resumes

## Routes

- / (overview)
- /projects
- /experience
- /contact
- /resume

## Getting Started

1. Install dependencies.

```bash
npm install
```

2. Create local environment variables.

```bash
cp .env.example .env.local
```

3. Fill in your Supabase values in `.env.local`.

4. Start development server.

```bash
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Supabase may label this as the publishable key)
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_TOKEN`

Legacy compatibility:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is still accepted in this codebase.

## Supabase Setup

1. Create a new Supabase project.
2. Run SQL from `supabase/schema.sql` in the Supabase SQL editor.
3. Copy project URL and keys into `.env.local`.
4. Use `ADMIN_API_TOKEN` in request headers when calling `/api/admin/*` routes.

## Admin API

All write endpoints require either:

- `x-admin-token: <ADMIN_API_TOKEN>`
- or `Authorization: Bearer <ADMIN_API_TOKEN>`

Available resources:

- `GET/POST /api/admin/projects`
- `GET/PATCH/DELETE /api/admin/projects/:id`
- `GET/PUT /api/admin/profile`
- `GET/POST /api/admin/experience`
- `GET/PATCH/DELETE /api/admin/experience/:id`
- `GET/POST /api/admin/social-links`
- `GET/PATCH/DELETE /api/admin/social-links/:id`
- `GET/POST /api/admin/tool-badges`
- `GET/PATCH/DELETE /api/admin/tool-badges/:id`
- `GET/POST /api/admin/resumes`
- `GET/PATCH/DELETE /api/admin/resumes/:id`

## Build And Lint

```bash
npm run lint
npm run build
```

## Deploy

Deploy to Vercel and set the same environment variables in Project Settings.

## CI/CD (No Docker)

This repository uses GitHub Actions and does not require Docker.

- CI workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- CD workflow: [.github/workflows/deploy-vercel.yml](.github/workflows/deploy-vercel.yml)

What runs automatically:

- On every pull request: lint and build
- On pull requests (when Vercel secrets are configured): preview deploy
- On pushes to master or main (when Vercel secrets are configured): production deploy

### Required GitHub repository secrets

Add these in GitHub: Settings -> Secrets and variables -> Actions -> New repository secret.

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Also add your app secrets for runtime usage in Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_TOKEN`

### How to get Vercel values

1. Connect your GitHub repository to a Vercel project.
2. In Vercel account settings, create an access token for `VERCEL_TOKEN`.
3. In Vercel project settings, copy Organization ID and Project ID.
4. Save all three values in your GitHub repository secrets.

## Security Notes

- Never commit `.env.local`.
- If a key has ever been exposed, rotate it before going live.

## License

Personal portfolio project.
