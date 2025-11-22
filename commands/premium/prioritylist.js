const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prioritylist')
        .setDescription('Lists all tickets with a high priority.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const tickets = await Ticket.find({ guildId: interaction.guild.id, priority: 'high' });
        if (tickets.length === 0) {
            const infoEmbed = createEmbed('High Priority Tickets', 'There are no high priority tickets.');
            return interaction.reply({ embeds: [infoEmbed] });
        }

        const description = tickets.map(t => `<#${t.channelId}> - Created by <@${t.userId}>`).join('\n');
        const ticketsEmbed = createEmbed('High Priority Tickets', description);
        await interaction.reply({ embeds: [ticketsEmbed] });
    },
};
