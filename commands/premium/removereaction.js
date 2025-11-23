
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const { getTicketSettings } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removereaction')
        .setDescription('Removes a reaction from a message in a ticket.')
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('The ID of the message to remove the reaction from')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to remove')
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
            const reaction = message.reactions.cache.get(emoji);
            if(reaction) {
                await reaction.remove();
                 const successEmbed = createEmbed('Reaction Removed', `Successfully removed reaction from the message.`);
                await interaction.reply({ embeds: [successEmbed], ephemeral: true });
            } else {
                const errorEmbed = createEmbed('Error', 'Reaction not found.', 0xFF0000);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            const errorEmbed = createEmbed('Error', 'Could not remove reaction. Make sure the message ID and emoji are correct.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
