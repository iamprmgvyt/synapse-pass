
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { getTicketSettings } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockticket')
        .setDescription('Locks the current ticket channel.'),
    async execute(interaction) {
        const settings = await getTicketSettings(interaction.guild.id);
        if (!interaction.member.roles.cache.has(settings.staffRoleId)) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            const errorEmbed = createEmbed('Error', 'This is not a ticket channel.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        await interaction.channel.permissionOverwrites.edit(ticket.userId, {
            SendMessages: false,
        });

        const successEmbed = createEmbed('Ticket Locked', 'This ticket has been locked. The user cannot send messages.');
        await interaction.reply({ embeds: [successEmbed] });
    },
};
