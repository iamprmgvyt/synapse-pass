
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoclose')
        .setDescription('Configures the auto-close functionality.'),
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
            'Auto-Close Tickets',
            'This command is a placeholder. A full implementation would allow you to set a duration of inactivity after which tickets are automatically closed. This requires a background task to periodically check ticket activity.'
        );
        await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
    },
};
