
const { EmbedBuilder } = require('discord.js');

const createEmbed = (title, description, color = 0x0099FF) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: 'Synapse Pass' });
};

module.exports = { createEmbed };
