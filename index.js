const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();
const commandFolders = ['free', 'premium', 'admin'];

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', folder, file));
        client.commands.set(command.data.name, command);
    }
}

const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Managing tickets');
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        const [action, ticketId] = interaction.customId.split('_');
        
        if (action === 'close') {
            const command = client.commands.get('closeticket');
            if(command) await command.execute(interaction);
        }
        if (action === 'claim') {
            const command = client.commands.get('claim');
             if(command) await command.execute(interaction);
        }
        return;
    }
    
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('There was an error while executing this command!');
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(process.env.PREFIX)) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    // A simple interaction object mock for prefix commands
    const interaction = {
        client: client,
        guild: message.guild,
        channel: message.channel,
        user: message.author,
        member: message.member,
        options: {
            getString: (name) => args[0], // Simplified for now
            getRole: (name) => message.mentions.roles.first(),
            getChannel: (name) => message.mentions.channels.first(),
            getUser: (name) => message.mentions.users.first(),
            getInteger: (name) => parseInt(args[0]),
            getString: (name) => args.join(' '),
        },
        reply: async (options) => {
            if (typeof options === 'string') {
                return message.channel.send(options);
            }
            return message.channel.send(options);
        },
        deferReply: async () => {}, // Placeholder
        followUp: async (options) => message.channel.send(options),
        editReply: async (options) => {}, // Placeholder
    };


    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Error')
            .setDescription('There was an error while executing this command!');
        await message.channel.send({ embeds: [errorEmbed] });
    }
});


client.login(process.env.BOT_TOKEN);