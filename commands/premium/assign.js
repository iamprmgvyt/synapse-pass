
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { getTicketSettings } = require('../../utils/ticketUtils');
const { isPremium } = require('../../utils/premiumUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assign')
        .setDescription('Assigns a ticket to a staff member.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The staff member to assign the ticket to')
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
        
        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) {
            const errorEmbed = createEmbed('Error', 'This is not a ticket channel.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        if(!member.roles.cache.has(settings.staffRoleId)){
            const errorEmbed = createEmbed('Error', 'The user you are trying to assign is not a staff member.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        ticket.staffId = user.id;
        await ticket.save();

        const successEmbed = createEmbed('Ticket Assigned', `This ticket has been assigned to ${user}.`);
        await interaction.reply({ embeds: [successEmbed] });
    },
};
