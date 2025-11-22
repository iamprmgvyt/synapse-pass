
const mongoose = require('mongoose');

const premiumUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    premiumType: { type: String, enum: ['monthly', 'lifetime'], required: true },
    expirationDate: { type: Date, default: null },
});

const ticketSchema = new mongoose.Schema({
    ticketId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    channelId: { type: String, required: true },
    status: { type: String, default: 'open' },
    staffId: { type: String, default: null },
    priority: { type: String, default: 'normal' },
    createdAt: { type: Date, default: Date.now },
    messages: { type: Array, default: [] },
    claimedBy: { type: String, default: null },
    autoResponse: { type: String, default: null },
});

const settingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    staffRoleId: { type: String, default: null },
    logChannelId: { type: String, default: null },
    ticketCategoryId: { type: String, default: null },
    welcomeMessage: { type: String, default: 'Welcome to your ticket! Please describe your issue.' },
});

module.exports = {
    PremiumUser: mongoose.model('PremiumUser', premiumUserSchema),
    Ticket: mongoose.model('Ticket', ticketSchema),
    Settings: mongoose.model('Settings', settingsSchema),
};
