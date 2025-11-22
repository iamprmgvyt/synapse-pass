
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('massclose')
        .setDescription('Closes all open tickets in the server.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const tickets = await Ticket.find({ guildId: interaction.guild.id, status: 'open' });
        if (tickets.length === 0) {
            const infoEmbed = createEmbed('Mass Close', 'There are no open tickets to close.');
            return interaction.reply({ embeds: [infoEmbed] });
        }

        await interaction.reply({ embeds: [createEmbed('Mass Close', `Closing ${tickets.length} tickets...`)] });

        for (const ticket of tickets) {
            const channel = await interaction.guild.channels.fetch(ticket.channelId).catch(() => null);
            if (channel) {
                 // Save transcript
                const transcriptPath = path.join(__dirname, '..', '..', 'data', 'transcripts');
                if (!fs.existsSync(transcriptPath)) {
                    fs.mkdirSync(transcriptPath, { recursive: true });
                }
                const transcriptFile = path.join(transcriptPath, `${ticket.ticketId}.txt`);
                let transcript = '';
                const messages = await channel.messages.fetch({ limit: 100 });
                messages.reverse().forEach(msg => {
                    transcript += `[${msg.createdAt.toDateString()}] ${msg.author.tag}: ${msg.content}\n`;
                });
                fs.writeFileSync(transcriptFile, transcript);
                await channel.delete();
            }
            await Ticket.deleteOne({ _id: ticket._id });
        }

        const successEmbed = createEmbed('Mass Close', `Successfully closed ${tickets.length} tickets.`);
        await interaction.followUp({ embeds: [successEmbed] });
    },
};
