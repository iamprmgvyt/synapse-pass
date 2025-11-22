
const { SlashCommandBuilder } = require('discord.js');
const { execute: closeTicketExecute } = require('./closeticket');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('archive')
        .setDescription('Archives the current ticket.'),
    async execute(interaction) {
       await closeTicketExecute(interaction);
    },
};
