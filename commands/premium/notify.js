
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Notifies the ticket creator of an update.'),
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
        
        const user = await interaction.client.users.fetch(ticket.userId);
        if (user) {
            try {
                const notifyEmbed = createEmbed('Ticket Update', `Your ticket <#${interaction.channel.id}> has been updated by a staff member.`);
                await user.send({ embeds: [notifyEmbed] });
                const successEmbed = createEmbed('Notification Sent', `Successfully notified ${user.tag}.`);
                await interaction.reply({ embeds: [successEmbed], ephemeral: true });
            } catch (error) {
                const errorEmbed = createEmbed('Error', 'Could not send a DM to the user. They may have DMs disabled.', 0xFF0000);
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
