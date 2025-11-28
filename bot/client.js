// client.js
// This script initializes the Discord Bot Client to maintain the WebSocket connection
// and registers Slash Commands globally. It runs alongside the Next.js server.

const { Client, GatewayIntentBits, ActivityType, REST, Routes, InteractionResponseType } = require('discord.js');
const express = require('express'); 

// Tải mô-đun xử lý tương tác
const { handleInteraction } = require('./interactionCreate'); 

// Load environment variables from the standard .env file
require('dotenv').config({ path: './.env' }); 

const CLIENT_ID = process.env.CLIENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// --- COMMAND DEFINITIONS ---
const commands = [
    {
        name: 'setup-auth',
        description: 'Sets up the Synapse Pass Auth Gate for this server.',
        // Restriction: ONLY Administrator (Permission 8) can use this command.
        default_member_permissions: "8", 
        options: [
            {
                name: 'role',
                description: 'The role users will receive upon successful verification.',
                type: 8, // ROLE type
                required: true,
            },
            {
                name: 'visibility',
                description: 'Should the setup message be visible to everyone (Public) or only you (Private)?',
                type: 3, // STRING type
                required: true,
                choices: [
                    { name: 'Public', value: 'public' },
                    { name: 'Private (Ephemeral)', value: 'private' }
                ]
            }
        ],
    },
    {
        name: 'help',
        description: 'Displays the list of available commands and usage instructions.',
        // Public command: no restriction
        default_member_permissions: null, 
    },
];
// --------------------------

// Initialize REST client version 10
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

/**
 * Deploys Slash Commands to the Discord API.
 */
async function deployCommands() {
    if (!CLIENT_ID) {
        console.error('❌ [Error] CLIENT_ID is missing. Cannot deploy commands.');
        return;
    }
    
    try {
        console.log('🔄 [Deploy] Started refreshing application (/) commands...');
        
        // This 'put' replaces ALL existing application commands with the new list.
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        
        console.log(`✅ [Deploy] Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
        console.error('❌ [Deploy] Error while deploying commands:', error);
    }
}

// Create the Client instance with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers 
    ]
});

// Event: Client Ready
client.on('ready', async () => {
    console.log(`🚀 [Ready] Logged in as: ${client.user.tag}`);
    console.log(`📊 [Stats] Serving ${client.guilds.cache.size} servers.`);

    // Set Bot Presence
    client.user.setActivity('Secure Gateways', { type: ActivityType.Watching });
    client.user.setStatus('online');
    
    // Execute command deployment
    await deployCommands(); 
});

// ----------------------------------------------------------------------
// 📩 INTERACTION HANDLER (Using external handler) 📩
// ----------------------------------------------------------------------

// Gắn hàm xử lý tương tác đã được tách ra từ ./interactionCreate.js
client.on('interactionCreate', handleInteraction);

// Event: Error Handling
client.on('error', (error) => {
    console.error('❌ [Client Error] An error occurred:', error);
});

// Login Process
if (!BOT_TOKEN || !CLIENT_ID) {
    console.error("❌ [Fatal] Missing BOT_TOKEN or CLIENT_ID in environment variables.");
    process.exit(1);
} else {
    console.log('🔑 [Login] Attempting to log in...');
    client.login(BOT_TOKEN)
        .catch(error => {
            console.error('❌ [Login] Failed to connect to Discord:', error);
        });
}

// ----------------------------------------------------------------------
// 💓 HEARTBEAT LOGIC VÀ MÔ PHỎNG TẢI (ĐÃ TĂNG KHOẢNG THỜI GIAN LÊN 2 GIÂY) 💓
// ----------------------------------------------------------------------

/**
 * Executes a blocking busy loop to simulate CPU load for a very short duration (~5ms).
 * This minimal spike prevents the container from sleeping due to inactivity.
 * (5ms busy time / 2000ms interval = 0.25% CPU load - Tăng độ ổn định)
 */
function simulateLoad() {
    // Busy time: 5ms
    const startTime = process.hrtime.bigint();
    const durationMs = 5; 

    // Calculation loop to occupy the Node.js thread
    let sum = 0;
    while (true) {
        sum += Math.sqrt(Math.random() * 1000000); 

        // Check elapsed time
        const elapsedTimeMs = Number(process.hrtime.bigint() - startTime) / 1000000;
        if (elapsedTimeMs >= durationMs) {
            break;
        }
    }
    // Simple check to prevent dead code elimination by compiler
    if (sum === -1) console.log(sum); 
}


// Gửi heartbeat và mô phỏng tải MỌI 2 GIÂY (2000ms).
const HEARTBEAT_INTERVAL = 2000; // Tăng từ 500ms lên 2000ms để ổn định hơn
setInterval(() => {
    // 1. Execute CPU load simulation (~1% spike)
    simulateLoad(); 

    // 2. Logging Heartbeat and Bot Status
    const isReady = client.isReady();
    const emojiStatus = isReady ? '🟢' : '🔴';
    let detailedStatus = 'Initializing...'; 

    if (isReady && client.user) {
        const statusText = client.user.presence?.status || 'Online'; 
        const activity = client.user.presence?.activities?.[0];

        detailedStatus = `${statusText.toUpperCase()}`;
        if (activity) {
            const typeString = ActivityType[activity.type];
            detailedStatus += ` | ${typeString.charAt(0).toUpperCase() + typeString.slice(1)} ${activity.name}`;
        }
    }

    // Log heartbeat và simulated load info
    console.log(`[Heartbeat] ${emojiStatus} Bot Status: ${detailedStatus}. Uptime: ${Math.floor(process.uptime())}s. Simulated Load (Every ${HEARTBEAT_INTERVAL}ms).`);
}, HEARTBEAT_INTERVAL); // Đặt thành 2000ms (2 giây)

// ----------------------------------------------------------------------
// ⚡ UPTIME MONITORING / HEALTH CHECK (Express Server) ⚡
// ----------------------------------------------------------------------

const app = express();
const port = process.env.PORT || 3000; 

app.get('/', (req, res) => {
    const status = client.isReady() ? 'Online' : 'Initializing/Offline';
    const uptime = Math.floor(process.uptime());
    
    res.status(200).json({
        service: 'Synapse Pass Bot Client',
        status: status,
        uptime_seconds: uptime,
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`🌐 [Health] Health Check server is running on port ${port}`);
});
