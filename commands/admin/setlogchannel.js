
const { SlashCommandBuilder } = require('discord.js');
const { Settings } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Sets the channel where ticket logs will be sent.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel for ticket logs')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        await Settings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { logChannelId: channel.id },
            { new: true, upsert: true }
        );

        const successEmbed = createEmbed('Log Channel Set', `The ticket log channel has been set to ${channel}.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
