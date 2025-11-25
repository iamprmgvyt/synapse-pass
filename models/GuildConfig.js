import mongoose from 'mongoose';

const GuildConfigSchema = new mongoose.Schema({
  guildId: { 
    type: String, 
    required: true, 
    unique: true // Each server gets one config
  }, 
  roleId: { 
    type: String, 
    required: true // The role ID to be assigned
  }, 
  authLink: { 
    type: String // Optional: Custom Auth link
  }
});

// Avoid Mongoose OverwriteModelError
export default mongoose.models.GuildConfig || mongoose.model('GuildConfig', GuildConfigSchema);