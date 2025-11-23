// deploy-commands.js
// This script registers the Slash Commands with the Discord API. 
// It should be run manually one time.

// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });

const CLIENT_ID = process.env.CLIENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Define the structure of the /setup-auth command
const commands = [
    {
        name: 'setup-auth',
        description: 'Sets up the Synapse Pass Auth Gate for this server.',
        // TRƯỜNG MỚI: Chỉ cho phép Quản trị viên (Permission Bit 8) sử dụng lệnh
        default_member_permissions: "8",
        options: [
            {
                name: 'role',
                description: 'The role that users will receive after successful verification.',
                type: 8, // Type 8 represents a ROLE option
                required: true,
            },
        ],
    },
];

// Endpoint for registering Global Commands
const apiEndpoint = `https://discord.com/api/v10/applications/${CLIENT_ID}/commands`;

(async () => {
    try {
        if (!CLIENT_ID || !BOT_TOKEN) {
            console.error("Error: Missing CLIENT_ID or BOT_TOKEN. Please check your .env.local file.");
            return;
        }

        console.log('Starting application (/) commands registration...');

        const response = await fetch(apiEndpoint, {
            method: 'PUT', // Use PUT to overwrite all previous commands
            headers: {
                // Use the Bot Token for authorization
                'Authorization': `Bot ${BOT_TOKEN}`, 
                'Content-Type': 'application/json',
            },
            // Send the commands array
            body: JSON.stringify(commands), 
        });

        if (!response.ok) {
            throw new Error(`Discord API Error: ${response.status} - ${await response.text()}`);
        }

        console.log('Successfully registered application (/) commands.');
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
})();
