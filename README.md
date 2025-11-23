<<<<<<< HEAD
# 🔑 Synapse Pass: Secure OAuth2 Verification Bot

This repository hosts the **Synapse Pass** project, a multi-guild OAuth2 authentication gateway built using Next.js (Serverless API) and MongoDB Atlas.

---

## 🛠️ Developer Setup & Architecture

### Stack

* **Framework:** Next.js (API Routes)
* **Database:** MongoDB Atlas (via Mongoose)
* **Hosting:** Vercel (Serverless)
* **Core Logic:** Discord HTTP Interactions & OAuth2 Flow

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas Connection String
* Discord Application Keys (`CLIENT_ID`, `BOT_TOKEN`, `PUBLIC_KEY`)

### Quick Local Start

1.  **Clone the Repository & Install:**
    ```bash
    git clone [https://github.com/iamprmgvyt/synapse-pass-bot.git](https://github.com/iamprmgvyt/synapse-pass-bot.git)
    cd synapse-pass-bot
    npm install
    ```

2.  **Configure Environment:**
    Ensure your `.env.local` file contains all necessary keys (`CLIENT_ID`, `BOT_TOKEN`, `MONGODB_URI`, `REDIRECT_URI`).

3.  **Run Commands:**

    | Command | Description | Purpose |
    | :--- | :--- | :--- |
    | `npm run dev` | Starts the local Next.js server (http://localhost:3000) | Local Development |
    | `npm run deploy:commands` | **Registers the `/setup-auth` command** with the Discord API. | Must run once after key changes |

---

## ⚙️ Key Endpoints & Logic Flow

| Endpoint File | Type | Function | Required Keys |
| :--- | :--- | :--- | :--- |
| `/api/interactions.js` | `POST` | Handles Discord **Slash Command** (`/setup-auth`). Verifies signature, saves `GuildID` & `RoleID` to MongoDB. | `PUBLIC_KEY` |
| `/api/auth/login.js` | `GET` | Initiates the OAuth2 redirect. Embeds the `guild_id` into the **`state`** parameter. | `CLIENT_ID`, `REDIRECT_URI` |
| `/api/auth/callback.js` | `GET` | **Core Logic.** Exchanges the `code` for `UserID`. Finds `RoleID` using the `state` (`GuildID`) from MongoDB. Calls Discord API to assign the role. | `BOT_TOKEN`, `CLIENT_SECRET` |

### Vercel Deployment Checklist

1.  Add **all** sensitive keys (especially `MONGODB_URI` and `BOT_TOKEN`) to Vercel Environment Variables.
2.  Ensure Discord **Interactions Endpoint URL** points to: `https://[VERCEL_URL]/api/interactions`
3.  Ensure Discord **Redirect URI** points to: `https://[VERCEL_URL]/api/auth/callback`
=======
# Synapse Pass - Discord Ticket Bot

Synapse Pass is a full-featured Discord ticket bot built with Node.js and Discord.js v14.

## Features

- **Dual Command System:** Supports both prefix (`!`) and slash (`/`) commands.
- **Modular Command Structure:** Commands are organized into `free`, `premium`, and `admin` categories.
- **Premium System:** Manage premium users with special commands and perks.
- **Advanced Ticket System:** Highly customizable ticket creation, management, and logging.
- **MongoDB Integration:** All data is stored in a MongoDB database for persistence.
- **Embed Responses:** All bot responses are in a clean, consistent embed format.
- **Button Interactions:** Modern Discord UI with buttons for ticket actions.
- **Transcript Logging:** Automatically saves transcripts of closed tickets.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/synapse-pass.git
    cd synapse-pass
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure your environment:**
    - Rename `.env.example` to `.env`.
    - Fill in the required values: `BOT_TOKEN`, `MONGODB_URI`, `PREFIX`, `OWNER_ID`, and `CLIENT_ID`.
4.  **Deploy slash commands:**
    ```bash
    npm run deploy
    ```
5.  **Start the bot:**
    ```bash
    npm start
    ```

## Commands

A full list of commands can be viewed with the `/help` command. The bot has 19 free commands and 21+ premium commands, plus admin setup commands.

### Admin Setup
- `/setstaffrole <role>`
- `/setcategory <category>`
- `/setlogchannel <channel>`
- `/setwelcome <message>`

### Free Commands
- `/newticket`
- `/closeticket`
- `/help`
- and 16 more...

### Premium Commands
- `/addpremium <user>`
- `/removepremium <user>`
- `/listpremium`
- and 18 more...

## Hosting

This bot is designed to be compatible with hosting services like **Render** and **Pterodactyl**. Ensure your environment variables are set correctly on your hosting platform.
>>>>>>> d7705f512eae99dcf31b28c870815fc7efe23666
