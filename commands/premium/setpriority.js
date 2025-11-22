
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { isPremium } = require('../../utils/premiumUtils');
const { getTicketSettings } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setpriority')
        .setDescription('Sets the priority of the current ticket.')
        .addStringOption(option =>
            option.setName('priority')
                .setDescription('The priority level')
                .setRequired(true)
                .addChoices(
                    { name: 'Low', value: 'low' },
                    { name: 'Normal', value: 'normal' },
                    { name: 'High', value: 'high' }
                )),
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

        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            const errorEmbed = createEmbed('Error', 'This is not a ticket channel.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const priority = interaction.options.getString('priority');
        ticket.priority = priority;
        await ticket.save();

        const successEmbed = createEmbed('Priority Set', `The priority of this ticket has been set to **${priority}**.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
