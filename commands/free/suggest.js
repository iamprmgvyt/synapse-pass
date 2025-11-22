
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Send a suggestion for the bot.')
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('Your suggestion message')
                .setRequired(true)),
    async execute(interaction) {
        const suggestion = interaction.options.getString('suggestion');
        const owner = await interaction.client.users.fetch(process.env.OWNER_ID);
        if (owner) {
            const suggestionEmbed = createEmbed(
                'New Suggestion',
                `**From:** ${interaction.user.tag} (${interaction.user.id})\n` +
                `**Guild:** ${interaction.guild.name}\n\n` +
                `**Suggestion:**\n${suggestion}`
            );
            try {
                await owner.send({ embeds: [suggestionEmbed] });
                const successEmbed = createEmbed('Suggestion Sent', 'Thank you for your suggestion!');
                await interaction.reply({ embeds: [successEmbed], ephemeral: true });
            } catch (error) {
                console.error('Could not send suggestion DM to owner.', error);
                const errorEmbed = createEmbed('Error', 'Could not deliver suggestion at this time.', 0xFF0000);
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
