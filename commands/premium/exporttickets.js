
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exporttickets')
        .setDescription('Exports all tickets to a JSON file.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const tickets = await Ticket.find({ guildId: interaction.guild.id });
        if (tickets.length === 0) {
            const infoEmbed = createEmbed('Export Tickets', 'There are no tickets to export.');
            return interaction.reply({ embeds: [infoEmbed] });
        }

        const json = JSON.stringify(tickets, null, 2);
        const buffer = Buffer.from(json, 'utf-8');
        const attachment = new AttachmentBuilder(buffer, { name: 'tickets.json' });

        const successEmbed = createEmbed('Tickets Exported', 'All tickets have been exported to a JSON file.');
        await interaction.reply({ embeds: [successEmbed], files: [attachment], ephemeral: true });
    },
};
