# Miro Decision Canvas App

A Miro app built with the [Miro Web SDK](https://developers.miro.com/docs/web-sdk-overview), TypeScript, and Vite. It adds a toolbar icon to any board that — when clicked — opens a panel and lets you stamp a structured **Decision Canvas** template directly onto your board.

## What is a Decision Canvas?

A Decision Canvas is a visual framework for making and documenting decisions. It is divided into six sections:

| Section | Purpose |
|---|---|
| 🎯 Problem Statement | Describe the decision that needs to be made |
| 💡 Options | List all alternatives being considered |
| ⚖️ Pros & Cons | Capture advantages and disadvantages for each option |
| ✅ Decision | Record the chosen option |
| 📝 Rationale | Explain the reasoning behind the choice |
| 🚀 Next Steps | Define concrete follow-up actions |

## Repository structure

```
.
├── index.html                  # App panel entry point (UI rendered inside Miro)
├── public/
│   └── icon.svg                # Toolbar icon displayed in the Miro sidebar
├── src/
│   ├── app.ts                  # SDK init – registers the toolbar icon
│   ├── main.ts                 # Panel UI logic (form handling, status messages)
│   ├── types.ts                # TypeScript interfaces shared across the app
│   ├── template/
│   │   └── decisionCanvas.ts   # Builds the Decision Canvas on the board
│   └── utils/
│       └── board.ts            # Thin wrappers around the Miro board API
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Prerequisites

- **Node.js ≥ 18** and **npm ≥ 9**
- A [Miro developer account](https://miro.com/app/dashboard/)
- A Miro app registered at <https://miro.com/app/settings/user-profile/apps>

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env and fill in your Miro app credentials
```

### 3. Start the development server

```bash
npm run dev
# Server starts on http://localhost:3000
```

### 4. Register the app in the Miro Developer Portal

1. Go to your app settings at <https://miro.com/app/settings/user-profile/apps>
2. Set the **App URL** to `http://localhost:3000/`
3. Under **Permissions**, enable `boards:read` and `boards:write`
4. Open a board, click **+** → **Apps** → find your app and install it

> **Note:** Miro requires HTTPS for production. For local development, `http://localhost` is allowed.

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot-module replacement |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

## How it works

```
Miro toolbar icon click
        │
        ▼
  src/app.ts  ──── registers icon:click handler
        │           opens panel (index.html)
        ▼
  index.html  ──── renders the panel UI
        │           loads src/main.ts
        ▼
  src/main.ts ──── reads form values (title, colour scheme)
        │           calls createDecisionCanvas()
        ▼
  src/template/decisionCanvas.ts
        │           builds frame + sections + sticky notes
        │           using helpers from src/utils/board.ts
        ▼
  Miro board  ──── canvas appears, viewport zooms to it
```

## Colour schemes

Four built-in colour schemes are available:

| Scheme | Header colour |
|---|---|
| Blue (default) | `#4262ff` |
| Green | `#1a9c45` |
| Purple | `#7c3aed` |
| Orange | `#e07b00` |

## Deploying to production

1. Run `npm run build` – output goes to `dist/`
2. Deploy the `dist/` folder to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.)
3. Update the **App URL** in the Miro Developer Portal to your production URL
4. Ensure the host serves files over **HTTPS**

## License

GPL-3.0 – see [LICENSE](LICENSE) for details.
