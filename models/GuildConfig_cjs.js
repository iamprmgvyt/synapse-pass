// models/GuildConfig_cjs.js
// CommonJS syntax for use with the Discord Bot (client.js)

const mongoose = require('mongoose');

// Defines the structure for storing Discord Guild configuration data.
const GuildConfigSchema = new mongoose.Schema({
    // Discord Guild ID (Server ID)
    guildId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    // ID of the role assigned to verified members.
    verifiedRoleId: { 
        type: String, 
        required: true 
    }, 
    // ID of the admin who set up the configuration.
    setupAdminId: { 
        type: String, 
        required: true 
    },
    // Date of initial setup.
    setupDate: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Check if the model already exists to prevent re-compilation.
const GuildConfigModel = mongoose.models.GuildConfig || mongoose.model('GuildConfig', GuildConfigSchema, 'guild_configs');

module.exports = GuildConfigModel;
