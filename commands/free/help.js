
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands.'),
    async execute(interaction) {
        const userIsPremium = await isPremium(interaction.user.id);

        let description = '🎟️ **Free Commands**\n';
        const freeCommandFiles = fs.readdirSync(path.join(__dirname, '..', 'free')).filter(file => file.endsWith('.js'));
        for (const file of freeCommandFiles) {
            const command = require(path.join(__dirname, '..', 'free', file));
            description += `\`/${command.data.name}\` - ${command.data.description}\n`;
        }
        
        const adminCommandFiles = fs.readdirSync(path.join(__dirname, '..', 'admin')).filter(file => file.endsWith('.js'));
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            description += '\n🛠️ **Admin Commands**\n';
            for (const file of adminCommandFiles) {
                const command = require(path.join(__dirname, '..', 'admin', file));
                description += `\`/${command.data.name}\` - ${command.data.description}\n`;
            }
        }


        if (userIsPremium) {
            description += '\n✨ **Premium Commands**\n';
            const premiumCommandFiles = fs.readdirSync(path.join(__dirname, '..', 'premium')).filter(file => file.endsWith('.js'));
            for (const file of premiumCommandFiles) {
                const command = require(path.join(__dirname, '..', 'premium', file));
                description += `\`/${command.data.name}\` - ${command.data.description}\n`;
            }
        }

        const helpEmbed = createEmbed('Help', description);
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
