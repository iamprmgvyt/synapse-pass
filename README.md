 # 🔑 Synapse Pass: Secure OAuth2 Verification Gate for Discord

 This project is Synapse Pass, a secure and scalable OAuth2 authentication gateway for Discord servers, built on a Serverless Next.js architecture and MongoDB.

✨ Key Features

🛡️ Secure OAuth2 Verification: Uses the standard Discord OAuth2 authorization flow to verify user identity without requiring passwords.

🔗 Slash Command Setup: Easily configure the verification role using the /setup-auth command (Administrator only).

🌐 Serverless Deployment: Optimized for Vercel (Next.js API Routes) and MongoDB Atlas for high scalability.

🤖 Optional Bot Client: Includes a lightweight bot client (using bot/client.js) for maintaining presence on Render or other WebSocket services.

🚀 Quick Local Start

📋 Prerequisites

Node.js (v18+)

MongoDB Atlas Connection String

Discord Application Keys:

CLIENT_ID

BOT_TOKEN

PUBLIC_KEY

CLIENT_SECRET

🛠️ Setup

Clone Repository & Install:

git clone [https://github.com/iamprmgvyt/synapse-pass.git](https://github.com/iamprmgvyt/synapse-pass.git)

cd synapse-pass-bot
npm install


Configure Environment:
Ensure your .env.local file contains all necessary keys, including MONGODB_URI and the full OAuth2 callback URL, REDIRECT_URI.

Core Operational Commands:

Command

Description

Purpose

npm run dev

Starts the local Next.js server (http://localhost:3000)

Local Development

npm run deploy:commands

Registers the Slash Command (/setup-auth) with the Discord API.

MUST run after command changes

npm run start:client

Starts the Discord Bot Client (bot/client.js)

Maintain Bot Connection (WebSocket)

⚙️ Architecture & Logic Flow

The project is split into two main components: the Serverless API (Next.js) and the Bot Client (Discord.js).

1. 🌐 OAuth2 Flow and Serverless API (Next.js)

File Endpoint

Type

Function

Required Keys

pages/api/interactions.js

POST

Handles the Slash Command (/setup-auth). Verifies the security signature and saves GuildID & RoleID to MongoDB.

PUBLIC_KEY

pages/api/auth/login.js

GET

Initiates the OAuth2 flow. Redirects the user to Discord. Embeds the guild_id into the state parameter.

CLIENT_ID, REDIRECT_URI

pages/api/auth/callback.js

GET

Core Authentication Logic. Exchanges the code for UserID. Uses the state (GuildID) to fetch RoleID from MongoDB. Calls Discord API to assign the role to the user (using BOT_TOKEN).

BOT_TOKEN, CLIENT_SECRET

pages/success.js / pages/error.js

GET

Landing page to show successful or failed verification results.

-

2. 🤖 Bot Client (bot/client.js)

The bot/client.js file is responsible for maintaining the Bot's WebSocket connection to Discord, setting its presence, and automatically deploying commands on startup.

Note: The /setup-auth command is restricted to Administrators in this file using default_member_permissions: "8".

🤝 Contact & Support

If you have any questions or require support, contact prmgvyt 
