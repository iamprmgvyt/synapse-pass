
const { SlashCommandBuilder } = require('discord.js');
const { Ticket } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketcount')
        .setDescription('Shows the number of tickets in the server.'),
    async execute(interaction) {
        const count = await Ticket.countDocuments({ guildId: interaction.guild.id });
        const countEmbed = createEmbed('Ticket Count', `There are currently **${count}** tickets in this server.`);
        await interaction.reply({ embeds: [countEmbed] });
    },
};
