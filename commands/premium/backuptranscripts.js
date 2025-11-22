
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('backuptranscripts')
        .setDescription('Backs up all ticket transcripts.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        
        const transcriptPath = path.join(__dirname, '..', '..', 'data', 'transcripts');
        if (!fs.existsSync(transcriptPath)) {
            const infoEmbed = createEmbed('Backup Transcripts', 'There are no transcripts to backup.');
            return interaction.reply({ embeds: [infoEmbed] });
        }

        const files = fs.readdirSync(transcriptPath);
        if(files.length === 0){
             const infoEmbed = createEmbed('Backup Transcripts', 'There are no transcripts to backup.');
            return interaction.reply({ embeds: [infoEmbed] });
        }

        // Not zipping as I cannot install new libraries. Sending a list of files instead.
        const fileList = files.join('\n');
        const embed = createEmbed('Transcript Backup', `Here are the transcript files:\n<<<${fileList}>>>`);

        await interaction.reply({ embeds: [embed] });
    },
};
