import { verifyKey } from 'discord-interactions';
import connectToDatabase from '../../lib/mongodb';
import GuildConfig from '../../models/GuildConfig';

// Helper: Check permissions (Administrator ONLY)
// Since /setadminrole is removed, we only check for the Administrator permission bit (8).
function hasPermission(member, requiredPermission) {
    const memberPermissions = BigInt(member.permissions); 
    const ADMINISTRATOR = BigInt(8); 

    // 1. Always allow users with the true Administrator permission bit (highest priority)
    if ((memberPermissions & ADMINISTRATOR) === ADMINISTRATOR) { 
        return true;
    }

    // 2. Public commands are allowed (used for /help)
    if (requiredPermission === 'PUBLIC') {
        return true;
    }

    // Default fail state 
    return false;
}

// Helper: Generate the clean Auth URL
const getAuthLink = (guildId) => {
    const domain = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';
    // Remove trailing slash if present
    const baseUrl = domain.endsWith('/') ? domain.slice(0, -1) : domain;
    return `${baseUrl}/api/auth/login?guild_id=${guildId}`;
};

// Helper: Safely find option value
const getOption = (options, name) => {
    const option = options.find(opt => opt.name === name);
    return option ? option.value : null;
};

export default async function handler(req, res) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = JSON.stringify(req.body);

  // 1. Security Signature Verification
  if (!verifyKey(body, signature, timestamp, process.env.PUBLIC_KEY)) {
    return res.status(401).send('Invalid Request Signature');
  }

  const interaction = req.body;
  
  // 2. Handle Discord PING (Health Check)
  if (interaction.type === 1) {
      return res.send({ type: 1 });
  }

  // 3. Handle Application Commands
  if (interaction.type === 2) {
      await connectToDatabase();
      const { member, guild_id, data } = interaction;
      // Fetch config is now only needed for saving, not permission checks
      // const guildConfig = await GuildConfig.findOne({ guildId: guild_id }); // Removed as adminRoleId is not used

      let responseContent;

      // --- COMMAND: /help ---
      if (data.name === 'help') {
           responseContent = `
              ### 📚 Synapse Pass - Command Help
              
              Synapse Pass automatically assigns a role to members after successful OAuth2 verification.
              
              **1. General Command:**
              - \`/help\`: Displays this help information.
              
              **2. Management Command (Requires Administrator Permission):**
              - \`/setup-auth [role] [visibility]\`: Sets up the verification system, specifying the role to be assigned upon successful verification, and controls message visibility (Public or Private).
          `;
          return res.send({
              type: 4,
              data: { content: responseContent }
          });
      }

      // --- COMMAND: /setup-auth ---
      else if (data.name === 'setup-auth') {
          const roleId = getOption(data.options, 'role');
          const visibility = getOption(data.options, 'visibility') || 'private'; // Default to private/ephemeral
          let deniedMessage = null; 

          // Determine flags: 0 for Public, 64 for Ephemeral/Private
          const flags = visibility === 'public' ? 0 : 64;

          // Check Permissions: Administrator (Permission 8) is required
          if (!hasPermission(member, 'ADMINISTRATOR')) {
              deniedMessage = `❌ **Denied:** Requires Administrator permission to run this command.`;
          }
          
          if (deniedMessage) {
              return res.send({ type: 4, data: { content: deniedMessage, flags: 64 } });
          }
          
          // Save Configuration (Fetch if not already done)
          await GuildConfig.updateOne(
              { guildId: guild_id },
              { $set: { roleId: roleId, adminRoleId: null } }, // Ensure adminRoleId is nulled out if this command is run
              { upsert: true }
          );

          const authLink = getAuthLink(guild_id);
          
          responseContent = `### ✅ Setup Complete!\n\n**Target Role:** <@&${roleId}>\n**Visibility:** ${visibility === 'public' ? 'Public' : 'Private (Ephemeral)'}\n**Verification Link:** [Click here to Verify](${authLink})\n\n*Note: Ensure the Bot's role is higher than the target role for role assignment.*`;
          
          return res.send({
            type: 4, 
            data: {
              content: responseContent,
              flags: flags // Use calculated visibility flags
            }
          });
      }
      
      // Fallback 
      return res.send({ 
          type: 4, 
          data: { content: `⚠️ Unknown command or missing handler for /${data.name}.` }
      });
  }

  return res.status(404).end();
}
