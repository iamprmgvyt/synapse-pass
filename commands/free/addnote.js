
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { getTicketSettings } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addnote')
        .setDescription('Adds a note to the current ticket.')
        .addStringOption(option =>
            option.setName('note')
                .setDescription('The note to add')
                .setRequired(true)),
    async execute(interaction) {
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
        
        const note = interaction.options.getString('note');
        const noteObject = {
            author: interaction.user.tag,
            content: note,
            timestamp: new Date(),
        };

        ticket.messages.push(noteObject);
        await ticket.save();

        const successEmbed = createEmbed('Note Added', `Successfully added a note to this ticket.`);
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },
};
