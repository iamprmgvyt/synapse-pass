
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketinfo')
        .setDescription('Gets information about the current ticket.'),
    async execute(interaction) {
        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            const errorEmbed = createEmbed('Error', 'This is not a ticket channel.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const user = await interaction.client.users.fetch(ticket.userId);
        const claimedBy = ticket.claimedBy ? await interaction.client.users.fetch(ticket.claimedBy) : 'None';

        const infoEmbed = createEmbed(
            `Ticket Info: ${ticket.ticketId}`,
            `**Creator:** ${user.tag}\n` +
            `**Created At:** ${ticket.createdAt.toDateString()}\n` +
            `**Status:** ${ticket.status}\n` +
            `**Claimed By:** ${claimedBy.tag || claimedBy}`
        );
        await interaction.reply({ embeds: [infoEmbed] });
    },
};
