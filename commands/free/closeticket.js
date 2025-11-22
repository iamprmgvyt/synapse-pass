
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closeticket')
        .setDescription('Closes the current ticket.'),
    async execute(interaction) {
        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            const errorEmbed = createEmbed('Error', 'This is not a ticket channel.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Save transcript
        const transcriptPath = path.join(__dirname, '..', '..', 'data', 'transcripts');
        if (!fs.existsSync(transcriptPath)) {
            fs.mkdirSync(transcriptPath, { recursive: true });
        }
        const transcriptFile = path.join(transcriptPath, `${ticket.ticketId}.txt`);
        let transcript = '';
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        messages.reverse().forEach(msg => {
            transcript += `[${msg.createdAt.toDateString()}] ${msg.author.tag}: ${msg.content}\n`;
        });
        fs.writeFileSync(transcriptFile, transcript);


        await interaction.channel.delete();
        await Ticket.deleteOne({ channelId: interaction.channel.id });

        // Log embed
        // This should be sent to the log channel, will implement later
    },
};
