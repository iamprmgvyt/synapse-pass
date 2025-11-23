
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const { getTicketSettings } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addreaction')
        .setDescription('Adds a reaction to a message in a ticket.')
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('The ID of the message to react to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to react with')
                .setRequired(true)),
    async execute(interaction) {
        if (!(await isPremium(interaction.user.id))) {
            const errorEmbed = createEmbed('Error', 'This is a premium-only command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const settings = await getTicketSettings(interaction.guild.id);
        if (!interaction.member.roles.cache.has(settings.staffRoleId)) {
            const errorEmbed = createEmbed('Error', 'You do not have permission to use this command.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        
        const messageId = interaction.options.getString('messageid');
        const emoji = interaction.options.getString('emoji');

        try {
            const message = await interaction.channel.messages.fetch(messageId);
            await message.react(emoji);
            const successEmbed = createEmbed('Reaction Added', `Successfully added reaction to the message.`);
            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            console.error(error);
            const errorEmbed = createEmbed('Error', 'Could not add reaction. Make sure the message ID and emoji are correct.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
