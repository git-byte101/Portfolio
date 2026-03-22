# Portfolio App

Production-style personal portfolio built with Next.js App Router, TypeScript, and Notion as a headless CMS.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Notion API

## Features

- Dashboard-style homepage with overview panels
- Projects page powered by Notion with fallback local data
- Contact page with social links and tools marquee
- Resume preview and download
- Theme toggle (oak/slate)

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

3. Fill in your Notion values in `.env.local`.

4. Start development server.

```bash
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Required:

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`

Optional:

- `NOTION_PROFILE_PAGE_ID`
- `NOTION_PROFILE_DATABASE_ID`

The app will try `NOTION_PROFILE_PAGE_ID` first, then `NOTION_PROFILE_DATABASE_ID` for the profile image source.

## Notion Setup

Projects database recommended properties:

- Name (Title)
- Description (Rich text)
- Tech Stack (Multi-select)
- Category (Select)
- Status (Select)
- Slug (Text)
- Repo URL (URL)
- Live URL (URL)
- Version (Text)
- Featured (Checkbox)
- Sort Order (Number)

For profile photo, use a page or database row with a `Files & media` property named `Profile Image`.

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

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
- `NOTION_PROFILE_PAGE_ID` (optional)
- `NOTION_PROFILE_DATABASE_ID` (optional)

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
