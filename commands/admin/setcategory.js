
const { SlashCommandBuilder } = require('discord.js');
const { Settings } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcategory')
        .setDescription('Sets the category where new tickets will be created.')
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('The category for tickets')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const category = interaction.options.getChannel('category');
        if (category.type !== 4) { // 4 = GUILD_CATEGORY
             const errorEmbed = createEmbed('Error', 'Please select a category.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        await Settings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { ticketCategoryId: category.id },
            { new: true, upsert: true }
        );

        const successEmbed = createEmbed('Ticket Category Set', `The ticket category has been set to ${category}.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
