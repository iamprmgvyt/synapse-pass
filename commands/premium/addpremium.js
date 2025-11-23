
const { SlashCommandBuilder } = require('discord.js');
const { PremiumUser } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpremium')
        .setDescription('Adds a premium user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add to premium')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of premium (monthly or lifetime)')
                .setRequired(true)
                .addChoices(
                    { name: 'Monthly', value: 'monthly' },
                    { name: 'Lifetime', value: 'lifetime' }
                )),
    async execute(interaction) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const type = interaction.options.getString('type');
        let expirationDate = null;

        if (type === 'monthly') {
            expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 1);
        }

        const premiumUser = await PremiumUser.findOneAndUpdate(
            { userId: user.id },
            { premiumType: type, expirationDate: expirationDate },
            { new: true, upsert: true }
        );

        const successEmbed = createEmbed('Premium Added', `Successfully added premium to ${user.tag}.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
