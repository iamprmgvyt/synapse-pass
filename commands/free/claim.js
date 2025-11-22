
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { getTicketSettings } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claims the current ticket.'),
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

        if (ticket.claimedBy) {
            const errorEmbed = createEmbed('Error', `This ticket is already claimed by <@${ticket.claimedBy}>.`, 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        ticket.claimedBy = interaction.user.id;
        await ticket.save();

        const successEmbed = createEmbed('Ticket Claimed', `This ticket has been claimed by ${interaction.user}.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
