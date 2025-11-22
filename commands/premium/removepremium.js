
const { SlashCommandBuilder } = require('discord.js');
const { PremiumUser } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removepremium')
        .setDescription('Removes a premium user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove from premium')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const result = await PremiumUser.deleteOne({ userId: user.id });

        if (result.deletedCount === 0) {
            const errorEmbed = createEmbed('Error', 'That user is not a premium user.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed] });
        }

        const successEmbed = createEmbed('Premium Removed', `Successfully removed premium from ${user.tag}.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
