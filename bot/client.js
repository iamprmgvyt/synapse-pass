// client.js
// Script này chạy Discord Bot Client để giữ bot online và đăng ký lệnh.
// This script runs the Discord Bot Client to keep the bot online and register commands.

const { Client, GatewayIntentBits, ActivityType, REST, Routes } = require('discord.js');
const express = require('express'); 

// Tải biến môi trường từ file .env.local
// Load environment variables from the local file
require('dotenv').config({ path: './.env.local' }); 

const CLIENT_ID = process.env.CLIENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// --- ĐỊNH NGHĨA LỆNH (COMMAND DEFINITIONS) ---
const commands = [
    {
        name: 'setup-auth',
        description: 'Sets up the Synapse Pass Auth Gate for this server. (Thiết lập cổng xác minh)',
        // QUAN TRỌNG: Chỉ cho phép Quản trị viên (Permission 8) sử dụng lệnh này
        // IMPORTANT: Only allow Administrator (Permission 8) to use this command
        default_member_permissions: "8",
        options: [
            {
                name: 'role',
                description: 'The role to assign after verification. (Vai trò sẽ cấp sau khi xác minh)',
                type: 8, // Type 8 is ROLE option
                required: true,
            },
        ],
    },
    {
        name: 'setadminrole',
        description: 'Designates a role that can use the /setup-auth command. (Chỉ định role quản lý)',
        default_member_permissions: "8", // Admin only
        options: [
            {
                name: 'role',
                description: 'The role to grant permission to. (Vai trò được cấp quyền)',
                type: 8, // Role type
                required: true,
            },
        ],
    },
    {
        name: 'help',
        description: 'Displays information and commands for Synapse Pass Bot. (Hiển thị trợ giúp)',
    },
];
// --------------------------

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function deployCommands() {
    if (!CLIENT_ID) {
        console.error('❌ Error: CLIENT_ID is required for command deployment.');
        return;
    }
    try {
        console.log('🔄 Starting command registration on Discord API...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('✅ Successfully registered application (/) commands.');
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // Cần thiết để kiểm tra role/member
    ]
});

client.on('ready', async () => {
    console.log(`🚀 Synapse Pass Client logged in as: ${client.user.tag}`);
    
    // Thiết lập trạng thái hoạt động
    // Set bot presence
    client.user.setActivity('Secure Verification Gateway', { type: ActivityType.Playing });
    client.user.setStatus('online');
    
    // Tự động đăng ký lệnh khi khởi động
    // Auto-deploy commands on startup
    await deployCommands(); 
});


if (!BOT_TOKEN || !CLIENT_ID) {
    console.error("❌ Fatal Error: Missing BOT_TOKEN or CLIENT_ID. Client cannot log in.");
} else {
    client.login(BOT_TOKEN)
        .catch(error => {
            console.error("❌ Error connecting to Discord (Check BOT_TOKEN):", error);
        });
}

// ----------------------------------------------------------------------
// ⚡ HEALTH CHECK SERVER (Express) ⚡
// ----------------------------------------------------------------------

const app = express();
const port = process.env.PORT || 3000; 

app.get('/', (req, res) => {
    const status = client.isReady() ? 'online' : 'initializing';
    res.status(200).send(`🤖 Synapse Pass Client Status: ${status}`);
});

app.listen(port, () => {
    console.log(`🌐 Health Check server listening on port ${port}`);
});
