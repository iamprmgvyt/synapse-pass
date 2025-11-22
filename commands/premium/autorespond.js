
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');

// This is a simplified version. A full implementation would require a listener.
// We'll store the auto-response message in the ticket data for now.

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorespond')
        .setDescription('Sets an auto-response message for a ticket.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to auto-respond with. Type "disable" to turn off.')
                .setRequired(true)),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            const errorEmbed = createEmbed('Error', 'This is not a ticket channel.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const message = interaction.options.getString('message');
        if (message.toLowerCase() === 'disable') {
            ticket.autoResponse = null;
            await ticket.save();
            const successEmbed = createEmbed('Auto-Response Disabled', 'The auto-responder for this ticket has been disabled.');
            return interaction.reply({ embeds: [successEmbed] });
        }
        
        ticket.autoResponse = message;
        await ticket.save();

        const successEmbed = createEmbed('Auto-Response Set', `The auto-response message has been set.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
