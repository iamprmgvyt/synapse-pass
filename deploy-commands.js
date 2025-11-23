<<<<<<< HEAD
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
=======
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandFolders = ['free', 'premium', 'admin'];

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', folder, file));
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), // You need to add CLIENT_ID to your .env
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
>>>>>>> d7705f512eae99dcf31b28c870815fc7efe23666
    }
})();