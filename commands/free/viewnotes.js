
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { getTicketSettings } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewnotes')
        .setDescription('Views all notes for the current ticket.'),
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

        const notes = ticket.messages.filter(msg => msg.author); // Simple check for note objects
        if (notes.length === 0) {
            const infoEmbed = createEmbed('Ticket Notes', 'There are no notes for this ticket.');
            return interaction.reply({ embeds: [infoEmbed], ephemeral: true });
        }
        
        const description = notes.map(note => `**${note.author}** (${new Date(note.timestamp).toDateString()}): ${note.content}`).join('\n\n');

        const notesEmbed = createEmbed('Ticket Notes', description);
        await interaction.reply({ embeds: [notesEmbed], ephemeral: true });
    },
};
