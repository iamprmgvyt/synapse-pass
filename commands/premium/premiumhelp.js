
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premiumhelp')
        .setDescription('Lists all available premium commands.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        let description = '**Premium Commands**\n';
        const premiumCommandFiles = fs.readdirSync(path.join(__dirname, '..', 'premium')).filter(file => file.endsWith('.js'));
        for (const file of premiumCommandFiles) {
            const command = require(path.join(__dirname, '..', 'premium', file));
            description += `\`/${command.data.name}\` - ${command.data.description}\n`;
        }

        const helpEmbed = createEmbed('Premium Help', description);
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
