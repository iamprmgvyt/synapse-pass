🔑 Synapse Pass: Secure OAuth2 Verification Gate for Discord

Synapse Pass is a secure, scalable OAuth2 authentication gateway for Discord servers, built on a Serverless Next.js architecture and MongoDB.

⚖️ License

This project is licensed under the MIT License. See the LICENSE.md file for full details.

✨ Key Features

🛡️ Secure OAuth2 Verification: Utilizes the standard Discord OAuth2 authorization flow to verify user identity securely without passwords.

🔗 Slash Command Setup: Easily configure verification roles using the /setup-auth command (Restricted to Administrators).

💾 Member Backup/Restore: Commands for /backup-members and /restore-members to securely manage verified member IDs.

🌐 Serverless Deployment: Optimized for Vercel (Next.js API Routes) and MongoDB Atlas for high scalability and minimal maintenance.

🤖 Optional Bot Client: Includes a lightweight bot client (bot/client.js) to maintain online presence on Render or other WebSocket-compatible hosting services.

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

git clone [https://github.com/iamprmgvyt/synapse-pass-bot.git](https://github.com/iamprmgvyt/synapse-pass-bot.git)
cd synapse-pass-bot
npm install


Configure Environment:
Create a .env.local file in the root directory and ensure it contains all necessary keys, including MONGODB_URI and the full OAuth2 callback URL as REDIRECT_URI.

Core Operational Commands:

Command

Description

Purpose

npm run dev

Starts the local Next.js server (http://localhost:3000)

Local Development

npm run deploy:commands

Registers Slash Commands (/setup-auth) with Discord API.

MUST run after modifying commands

npm run start:client

Starts the Discord Bot Client (bot/client.js)

Maintain Bot Connection (WebSocket)

⚠️ Bot Invitation & Required Permissions (Scope bot)

Để bot có thể thực hiện việc gán vai trò (/setup-auth) và phục hồi thành viên (/restore-members), bot cần phải được mời vào máy chủ với các quyền sau:

Scopes Bắt buộc: bot và applications.commands.

Permissions Bắt buộc: Manage Roles (Quản lý Vai trò), Administrator (Quản trị viên) HOẶC ít nhất là quyền để bot có thể gán vai trò mục tiêu.

Đường dẫn mời Bot Mẫu:

Bạn phải thay thế YOUR_CLIENT_ID bằng CLIENT_ID của bot bạn.

[https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot+applications.commands&permissions=268435456](https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot+applications.commands&permissions=268435456)


(Quyền 268435456 tương đương với Administrator - quyền cao nhất, hoặc bạn có thể chọn quyền thấp hơn như Manage Roles nếu bạn muốn hạn chế quyền của bot.)

⚙️ Architecture & Logic Flow

The project is architected into two primary components: the Serverless API (Next.js) and the Bot Client (Discord.js).

1. 🌐 OAuth2 Flow and Serverless API (Next.js)

File Endpoint

Type

Function

Required Keys

pages/api/interactions.js

POST

Handles Slash Commands (/setup-auth, /backup-members, /restore-members). Verifies security signatures and saves GuildID & RoleID configuration to MongoDB.

PUBLIC_KEY

pages/api/auth/login.js

GET

Initiates OAuth2 Flow. Redirects users to Discord authorization page. Embeds guild_id into the state parameter for context preservation.

CLIENT_ID, REDIRECT_URI

pages/api/auth/callback.js

GET

Core Authentication Logic. Exchanges authorization code for UserID. Retrieves configured RoleID from MongoDB using state (GuildID). Calls Discord API to assign the role to the user (using BOT_TOKEN).

BOT_TOKEN, CLIENT_SECRET

pages/success.js / pages/error.js

GET

Landing pages to display successful verification or error messages to the user.

-

2. 🤖 Bot Client (bot/client.js)

The bot/client.js script is responsible for maintaining the Bot's WebSocket connection to Discord (keeping it "Online"), setting its status presence, and automatically deploying commands upon startup.

Note: The /setup-auth command is explicitly restricted to users with Administrator permissions within this file using default_member_permissions: "8".

🤝 Contact & Support

If you have any questions, encounter issues, or require assistance, please DM prmgvyt
