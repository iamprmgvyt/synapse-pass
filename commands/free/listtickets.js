const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listtickets')
        .setDescription('Lists all open tickets for the user.'),
    async execute(interaction) {
        const tickets = await Ticket.find({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (tickets.length === 0) {
            const infoEmbed = createEmbed('Your Tickets', 'You do not have any open tickets.');
            return interaction.reply({ embeds: [infoEmbed], ephemeral: true });
        }

        const description = tickets.map(t => `<#${t.channelId}> - Status: ${t.status}`).join('\n');
        const ticketsEmbed = createEmbed('Your Open Tickets', description);
        await interaction.reply({ embeds: [ticketsEmbed], ephemeral: true });
    },
};
