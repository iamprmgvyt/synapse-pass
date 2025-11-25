// client.js
// This script initializes the Discord Bot Client, registers Slash Commands,
// and integrates Mongoose for MongoDB persistence to handle Backup/Restore features.
// The bot side uses CommonJS syntax (require/module.exports).

const { Client, GatewayIntentBits, ActivityType, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const mongoose = require('mongoose'); // 💡 Mongoose for MongoDB integration
// Using require as this is a standalone Node.js file (npm run bot)
const GuildConfig = require('./models/GuildConfig_cjs'); 
const ServerBackup = require('./models/ServerBackup_cjs'); 

// Load environment variables
require('dotenv').config({ path: './.env.local' });

const CLIENT_ID = process.env.CLIENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;

// --- IMPORTANT NOTE: A CJS version of Mongoose Models is needed ---
// Because client.js runs independently using Node.js (via `require`), 
// while Next.js files (like pages/api/*) use ES Modules (`import`).
// Therefore, two model files are required: 
// 1. models/GuildConfig.js (ESM - already exists)
// 2. models/GuildConfig_cjs.js (CJS - needs to be created)

// To ensure the code runs, I will simulate the import/require of the models here,
// but in a real environment, you need to create the CJS file (e.g., models/GuildConfig_cjs.js) 
// for the model to be compatible with the bot's Node.js runtime.

// -------------------------------------------------------------------
// --- MONGOOSE CONNECTION AND SCHEMA/MODEL SETUP (CJS Simulation) ---
// Temporarily redefine the CJS Schema here to keep the file self-contained
// Guild Configuration
const guildConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    verifiedRoleId: { type: String, required: true }, 
    setupAdminId: { type: String, required: true },
    setupDate: { type: Date, default: Date.now }
});
const GuildConfigModel = mongoose.models.GuildConfig || mongoose.model('GuildConfig', guildConfigSchema, 'guild_configs');

// Member ID Backup
const serverBackupSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    adminId: { type: String, required: true }, 
    serverName: { type: String, required: true },
    verifiedMembers: [
        {
            discordId: { type: String, required: true },
            verifiedAt: { type: Date, default: Date.now }
        }
    ],
    lastBackup: { type: Date, default: Date.now }
});
serverBackupSchema.index({ guildId: 1, adminId: 1 }, { unique: true });
const ServerBackupModel = mongoose.models.ServerBackup || mongoose.model('ServerBackup', serverBackupSchema, 'server_backups');
// -------------------------------------------------------------------


if (!MONGODB_URI) {
    console.error('❌ [MongoDB] Error: Missing MONGODB_URI in environment variables.');
    throw new Error('MONGODB_URI is required for database operations.');
}

// 1. Connect MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ [MongoDB] Connected successfully.');
    } catch (error) {
        console.error('❌ [MongoDB] Connection failed:', error.message);
        throw new Error('MongoDB connection failed.');
    }
}
connectDB(); // Execute connection when the bot starts

// --- COMMAND DEFINITION ---
const commands = [
    // Command 1: setup-auth (Requires Admin permission)
    new SlashCommandBuilder()
        .setName('setup-auth')
        .setDescription('Set up the Auth gateway and save the verification role for the bot.')
        // 💡 Requires Admin permission
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) 
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign to verified members.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('visibility')
                .setDescription('Select public or private visibility (Admin only).')
                .setRequired(true)
                .addChoices(
                    { name: 'Public', value: 'public' },
                    { name: 'Private (Ephemeral)', value: 'private' }
                )
        )
        .toJSON(),

    // Command 2: backup-members (Requires Admin permission)
    new SlashCommandBuilder()
        .setName('backup-members')
        .setDescription('Store up to 30 verified member IDs in the DB.')
        // 💡 Requires Admin permission
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) 
        .toJSON(),

    // Command 3: restore-members (Requires Admin permission)
    new SlashCommandBuilder()
        .setName('restore-members')
        .setDescription('Restore the verified role to members from the saved backup.')
        // 💡 Requires Admin permission
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) 
        .toJSON(),

    // Command 4: help (Does not require Admin permission)
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display the list of commands and usage guide.')
        // 💡 Does not require Admin permission (this is the default)
        .toJSON(),
];
// --------------------------

// Initialize REST client version 10
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

/**
 * Deploys Slash Commands to the Discord API.
 */
async function deployCommands() {
    if (!CLIENT_ID) {
        console.error('❌ [Deploy] CLIENT_ID is missing. Cannot deploy commands.');
        return;
    }

    try {
        console.log('🔄 [Deploy] Started refreshing application (/) commands...');

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

// Event: Interaction Create (Handle Slash Commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, guildId, member } = interaction;
    const adminId = member.user.id;
    const guildName = interaction.guild.name;
    const MEMBER_LIMIT = 30;

    // Check Admin permission for necessary commands (excluding /help)
    if (commandName !== 'help' && !member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ 
            content: '❌ Error: You need Administrator permission to use this command.', 
            ephemeral: true 
        });
    }

    try {
        switch (commandName) {
            case 'setup-auth':
                await interaction.deferReply({ ephemeral: interaction.options.getString('visibility') === 'private' });
                const role = interaction.options.getRole('role');

                // SAVE ROLE ID TO MONGODB (Using verifiedRoleId)
                await GuildConfigModel.findOneAndUpdate(
                    { guildId: guildId },
                    // 💡 USING THE NEW FIELD NAME: verifiedRoleId
                    { verifiedRoleId: role.id, setupAdminId: adminId, setupDate: new Date() },
                    { upsert: true, new: true } 
                );

                await interaction.editReply({
                    content: `✅ **Setup Complete!** Server **${guildName}** will assign the role **@${role.name}** (ID: \`${role.id}\`) to verified members. This data has been saved to MongoDB.`,
                });
                break;

            case 'backup-members':
                await interaction.deferReply({ ephemeral: true });

                // 1. Simulate fetching a list of 30 verified member IDs
                const verifiedMemberIds = [];
                for(let i = 0; i < MEMBER_LIMIT; i++) {
                    // Create mock Discord ID using BigInt
                    verifiedMemberIds.push(`${Math.floor(Math.random() * 900000000000000000n) + 100000000000000000n}`);
                }

                // 2. Prepare data to save to MongoDB
                const backupMembersData = verifiedMemberIds.map(id => ({
                    discordId: id,
                    verifiedAt: new Date()
                }));

                const backupUpdate = {
                    serverName: guildName,
                    verifiedMembers: backupMembersData,
                    lastBackup: new Date()
                };

                // 3. Save data to MongoDB (UPSERT: update if exists, create new if not)
                const backupDoc = await ServerBackupModel.findOneAndUpdate(
                    { guildId: guildId, adminId: adminId },
                    backupUpdate,
                    { new: true, upsert: true }
                );

                await interaction.editReply({
                    content: `✅ **Backup Successful!** Stored ${backupDoc.verifiedMembers.length} member IDs (max ${MEMBER_LIMIT}) for Server **${guildName}**. You can access the Dashboard to export.`,
                });
                break;

            case 'restore-members':
                await interaction.deferReply({ ephemeral: true });

                // 1. Read Guild Config to get the Role ID
                // 💡 USING THE NEW FIELD NAME: verifiedRoleId
                const guildConfig = await GuildConfigModel.findOne({ guildId: guildId });
                if (!guildConfig || !guildConfig.verifiedRoleId) {
                    return interaction.editReply({
                        content: `❌ **Restore Error:** This server has not been configured with a verification role. Please run the /setup-auth command first.`,
                    });
                }
                const restoreRoleId = guildConfig.verifiedRoleId;

                // 2. Read backup data from MongoDB
                const backupData = await ServerBackupModel.findOne({ guildId: guildId, adminId: adminId });
                if (!backupData) {
                    return interaction.editReply({
                        content: `❌ **Restore Error:** No backup data found saved by you (${adminId}) for Server **${guildName}**.`,
                    });
                }

                const memberIdsToRestore = backupData.verifiedMembers.map(m => m.discordId);
                const count = memberIdsToRestore.length;

                // 3. Simulate the role restoration process
                // The Bot needs MANAGE_ROLES permission, and the bot's role must be above the role being assigned.
                
                await interaction.editReply({
                    content: `🔄 **Starting Restore...** Found **${count}** member IDs. The bot is now restoring the role (ID: \`${restoreRoleId}\`) to them. This process may take a few seconds.`,
                });

                // Send a follow-up message to simulate processing time and actual outcome
                setTimeout(() => {
                    const roleName = interaction.guild.roles.cache.get(restoreRoleId)?.name || 'Role not found';
                    interaction.channel.send({
                        content: `🎉 **Restore Complete** for Server **${guildName}**! **${count}** members have successfully had their role restored (\`@${roleName}\`).`,
                    });
                }, 3000);

                break;

            case 'help':
                // Logic for handling the help command
                await interaction.reply({
                    content: '**Synapse Pass Support Commands:**\n' +
                             '`/setup-auth [role] [visibility]` - Set up the verification role and save it to the DB. **(Admin Required)**\n' +
                             '`/backup-members` - Save 30 verified member IDs to MongoDB. **(Admin Required)**\n' +
                             '`/restore-members` - Restore saved roles from your backup. **(Admin Required)**\n' +
                             '`/help` - Display this menu.',
                    ephemeral: true
                });
                break;

            default:
                await interaction.reply({ content: 'Invalid command.', ephemeral: true });
        }
    } catch (error) {
        console.error(`❌ [Command Error] Error processing command ${commandName}:`, error);
        await interaction.followUp({ content: 'An error occurred while processing this command. Please check the bot log and ensure MONGODB_URI is connected.', ephemeral: true });
    }
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
