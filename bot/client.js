// bot/client.js
// This script combines the Discord Client (WebSocket) and a minimal Express server (HTTP)
// for persistence, command registration, and health monitoring.

const { Client, GatewayIntentBits, ActivityType, REST, Routes } = require('discord.js');
const express = require('express'); 

// Load environment variables from the root .env.local file
require('dotenv').config({ path: '../.env.local' }); 

const CLIENT_ID = process.env.CLIENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// --- COMMAND DEFINITION ---
const commands = [
    {
        name: 'setup-auth',
        description: 'Sets up the Synapse Pass Auth Gate for this server.',
        options: [
            {
                name: 'role',
                description: 'The role that users will receive after successful verification.',
                type: 8, // Role type
                required: true,
            },
        ],
    },
];
// --------------------------

// Initialize the REST client for command deployment
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function deployCommands() {
    if (!CLIENT_ID) {
        console.error('Error: CLIENT_ID is required for command deployment.');
        return;
    }
    
    try {
        console.log('--- Starting command registration on Discord API ---');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('✅ Successfully registered application (/) commands.');
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
}


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', async () => {
    console.log(`✅ Synapse Pass Client is logged in as: ${client.user.tag}`);

    // Set presence and activity
    client.user.setActivity('Secure Verification Gateway', { type: ActivityType.Playing });
    client.user.setStatus('online');
    
    // Deploy commands on startup
    await deployCommands(); 
});


if (!BOT_TOKEN || !CLIENT_ID) {
    console.error("Fatal Error: Missing BOT_TOKEN or CLIENT_ID. Client cannot log in.");
} else {
    client.login(BOT_TOKEN)
        .catch(error => {
            console.error("Error connecting to Discord:", error);
        });
}


// ----------------------------------------------------------------------
// ⚡ UPTIME MONITORING / HEALTH CHECK (Express Server) ⚡
// ----------------------------------------------------------------------

const app = express();
// The hosting service (Render) provides the port via process.env.PORT
const port = process.env.PORT || 3000; 

// Endpoint Health Check
app.get('/', (req, res) => {
    const status = client.isReady() ? 'online' : 'initializing';
    // Return status 200 OK for uptime monitoring services (like Better Stack)
    res.status(200).send(`Synapse Pass Client Status: ${status}`);
});

app.listen(port, () => {
    console.log(`🌐 Health Check server listening on port ${port}`);
});
