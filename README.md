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