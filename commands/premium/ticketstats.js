
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketstats')
        .setDescription('Shows statistics about tickets.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const totalTickets = await Ticket.countDocuments({ guildId: interaction.guild.id });
        const openTickets = await Ticket.countDocuments({ guildId: interaction.guild.id, status: 'open' });
        const closedTickets = totalTickets - openTickets;

        const statsEmbed = createEmbed(
            'Ticket Statistics',
            `**Total Tickets:** ${totalTickets}\n` +
            `**Open Tickets:** ${openTickets}\n` +
            `**Closed Tickets:** ${closedTickets}`
        );
        await interaction.reply({ embeds: [statsEmbed] });
    },
};
