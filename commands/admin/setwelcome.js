
const { SlashCommandBuilder } = require('discord.js');
const { Settings } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Sets the welcome message for new tickets.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The welcome message')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const message = interaction.options.getString('message');
        await Settings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { welcomeMessage: message },
            { new: true, upsert: true }
        );

        const successEmbed = createEmbed('Welcome Message Set', `The welcome message has been updated.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
