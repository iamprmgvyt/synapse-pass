
const { SlashCommandBuilder, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Ticket, Settings } = require('../../utils/MongoDB/database');
const { createEmbed } = require('../../utils/embeds');
const { getTicketSettings } = require('../../utils/ticketUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newticket')
        .setDescription('Creates a new ticket.'),
    async execute(interaction) {
        const settings = await getTicketSettings(interaction.guild.id);
        const { staffRoleId, ticketCategoryId, welcomeMessage } = settings;

        if (!staffRoleId || !ticketCategoryId) {
            const errorEmbed = createEmbed('Error', 'The ticket system has not been set up yet.', 0xFF0000);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const ticketId = `ticket-${Date.now()}`;
        const channelName = `ticket-${interaction.user.username}`;

        const ticketChannel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: ticketCategoryId,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                },
                {
                    id: staffRoleId,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                },
            ],
        });

        const newTicket = new Ticket({
            ticketId: ticketId,
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            channelId: ticketChannel.id,
        });
        await newTicket.save();

        const welcomeEmbed = createEmbed('Ticket Created', welcomeMessage);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`close_${ticketId}`)
                    .setLabel('Close Ticket')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`claim_${ticketId}`)
                    .setLabel('Claim Ticket')
                    .setStyle(ButtonStyle.Success)
            );

        await ticketChannel.send({ embeds: [welcomeEmbed], components: [row] });

        const successEmbed = createEmbed('Success', `Your ticket has been created: ${ticketChannel}`);
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },
};
