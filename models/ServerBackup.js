// models/ServerBackup.js
// ES Module syntax for use with Next.js API routes

import mongoose from 'mongoose';

// Defines the structure for storing verified member ID backups.
const ServerBackupSchema = new mongoose.Schema({
    // Discord Guild ID (Server ID)
    guildId: { 
        type: String, 
        required: true 
    },
    // ID of the Admin who initiated this backup.
    adminId: { 
        type: String, 
        required: true 
    }, 
    // Name of the server at the time of backup.
    serverName: { 
        type: String, 
        required: true 
    },
    // Array of verified members' IDs and verification time.
    verifiedMembers: [
        {
            discordId: { type: String, required: true },
            verifiedAt: { type: Date, default: Date.now }
        }
    ],
    // Date of the last backup.
    lastBackup: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Index to ensure each admin can only have one backup record per guild.
ServerBackupSchema.index({ guildId: 1, adminId: 1 }, { unique: true });

// Check if the model already exists to prevent re-compilation.
const ServerBackup = mongoose.models.ServerBackup || mongoose.model('ServerBackup', ServerBackupSchema, 'server_backups');

export default ServerBackup;
