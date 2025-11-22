
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('importtickets')
        .setDescription('Imports tickets from a JSON file.'),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const infoEmbed = createEmbed(
            'Import Tickets',
            'This command is a placeholder. To import tickets, you would need to provide a JSON file with the same structure as the export file. The bot would then parse this file and create the tickets and channels accordingly.'
        );
        await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
    },
};
