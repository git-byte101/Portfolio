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

## Security Notes

- Never commit `.env.local`.
- If a key has ever been exposed, rotate it before going live.

## License

Personal portfolio project.
