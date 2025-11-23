
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Send feedback about the bot.')
        .addStringOption(option =>
            option.setName('feedback')
                .setDescription('Your feedback message')
                .setRequired(true)),
    async execute(interaction) {
        const feedback = interaction.options.getString('feedback');
        const owner = await interaction.client.users.fetch(process.env.OWNER_ID);
        if (owner) {
            const feedbackEmbed = createEmbed(
                'New Feedback',
                `**From:** ${interaction.user.tag} (${interaction.user.id})\n` +
                `**Guild:** ${interaction.guild.name}\n\n` +
                `**Feedback:**\n${feedback}`
            );
            try {
                await owner.send({ embeds: [feedbackEmbed] });
                const successEmbed = createEmbed('Feedback Sent', 'Thank you for your feedback!');
                await interaction.reply({ embeds: [successEmbed], ephemeral: true });
            } catch (error) {
                console.error('Could not send feedback DM to owner.', error);
                const errorEmbed = createEmbed('Error', 'Could not deliver feedback at this time.', 0xFF0000);
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
