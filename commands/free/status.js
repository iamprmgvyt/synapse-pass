
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Shows the bot\'s status.'),
    async execute(interaction) {
        const statusEmbed = createEmbed(
            'Bot Status',
            `**Ping:** ${interaction.client.ws.ping}ms\n` +
            `**Uptime:** ${Math.round(interaction.client.uptime / 1000 / 60 / 60)} hours\n` +
            `**Servers:** ${interaction.client.guilds.cache.size}\n` +
            `**MongoDB:** ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`
        );
        await interaction.reply({ embeds: [statusEmbed], ephemeral: true });
    },
};
