
const { SlashCommandBuilder } = require('discord.js');
const { Ticket, Settings } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketlogs')
        .setDescription('Sends the ticket transcript to the log channel.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        
        const settings = await Settings.findOne({ guildId: interaction.guild.id });
        if (!settings || !settings.logChannelId) {
            const errorEmbed = createEmbed('Error', 'The log channel has not been set.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const logChannel = await interaction.guild.channels.fetch(settings.logChannelId).catch(() => null);
        if (!logChannel) {
            const errorEmbed = createEmbed('Error', 'The log channel could not be found.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            const errorEmbed = createEmbed('Error', 'This is not a ticket channel.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const transcriptPath = path.join(__dirname, '..', '..', 'data', 'transcripts', `${ticket.ticketId}.txt`);
        if (!fs.existsSync(transcriptPath)) {
            const errorEmbed = createEmbed('Error', 'Transcript not found for this ticket.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const logEmbed = createEmbed('Ticket Log', `Transcript for ticket ${ticket.ticketId}`);
        await logChannel.send({ embeds: [logEmbed], files: [transcriptPath] });

        const successEmbed = createEmbed('Log Sent', `The transcript has been sent to the log channel.`);
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },
};
