
const { SlashCommandBuilder } = require('discord.js');
const { Settings } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setstaffrole')
        .setDescription('Sets the staff role for ticket management.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to be used for staff')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const role = interaction.options.getRole('role');
        const settings = await Settings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { staffRoleId: role.id },
            { new: true, upsert: true }
        );

        const successEmbed = createEmbed('Staff Role Set', `The staff role has been set to ${role}.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
