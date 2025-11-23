const { SlashCommandBuilder } = require('discord.js');
const { PremiumUser } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listpremium')
        .setDescription('Lists all premium users.'),
    async execute(interaction) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const premiumUsers = await PremiumUser.find({});
        if (premiumUsers.length === 0) {
            const infoEmbed = createEmbed('Premium Users', 'There are no premium users.');
            return interaction.reply({ embeds: [infoEmbed] });
        }

        const description = premiumUsers.map(user => {
            const expiration = user.premiumType === 'lifetime' ? 'Lifetime' : user.expirationDate.toDateString();
            return `<@${user.userId}> - ${user.premiumType} (Expires: ${expiration})`;
        }).join('\n');

        const embed = createEmbed('Premium User List', description);
        await interaction.reply({ embeds: [embed] });
    },
};
