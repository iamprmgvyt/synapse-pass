// client.js
// This script initializes the Discord Bot Client to maintain the WebSocket connection
// and registers Slash Commands globally. It runs alongside the Next.js server.

const { Client, GatewayIntentBits, ActivityType, REST, Routes } = require('discord.js');
const express = require('express'); 

// Load environment variables
require('dotenv').config({ path: './.env.local' }); 

const CLIENT_ID = process.env.CLIENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// --- COMMAND DEFINITIONS ---
const commands = [
    {
        name: 'setup-auth',
        description: 'Sets up the Synapse Pass Auth Gate for this server.',
        // Restriction: Administrator (Permission 8) or the custom Admin Role can use this.
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
                required: true, // <-- Đã thay đổi thành BẮT BUỘC (true)
                choices: [
                    { name: 'Public', value: 'public' },
                    { name: 'Private (Ephemeral)', value: 'private' }
                ]
            }
        ],
    },
    {
        name: 'setadminrole',
        description: 'Designates a specific role that can manage the Auth Gate.',
        // Restriction: ONLY Administrator (Permission 8) can set the management role initially.
        default_member_permissions: "8", 
        options: [
            {
                name: 'role',
                description: 'The role to grant management permissions to.',
                type: 8, // ROLE type
                required: true,
            },
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
        
        console.log(`✅ [Deploy] Successfully reloaded ${commands.length} application (/) commands, including /help and /setadminrole.`);
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
