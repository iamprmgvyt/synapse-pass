
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { getTicketSettings } = require('../../utils/ticketUtils');
const { isPremium } = require('../../utils/premiumUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unassign')
        .setDescription('Unassigns a ticket from a staff member.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.guild.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

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
        
        if (!ticket.staffId) {
            const errorEmbed = createEmbed('Error', 'This ticket is not assigned to anyone.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        ticket.staffId = null;
        await ticket.save();

        const successEmbed = createEmbed('Ticket Unassigned', `This ticket has been unassigned.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
