import { verifyKey } from 'discord-interactions';
import querystring from 'querystring';
// NOTE: For this simulated environment, we will mock the database connection and model.

// Helper: Check permissions (Administrator ONLY)
function hasPermission(member, requiredPermission) {
    // Administrator permission bit (8)
    const ADMINISTRATOR_BIT = BigInt(8); 
    const memberPermissions = BigInt(member.permissions); 

    // 1. Always allow users with the true Administrator permission bit (highest priority)
    if ((memberPermissions & ADMINISTRATOR_BIT) === ADMINISTRATOR_BIT) { 
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

// Helper: Generate Mock Discord ID
const generateMockDiscordId = () => {
  const base = Math.floor(Math.random() * 900000000000000000) + 100000000000000000;
  return base.toString();
};

// MOCK DATABASE CONFIGURATION (Replaces MongoDB/Mongoose)
// Stores configuration (roleId) and backup data (backupMembers, lastBackup).
const mockDatabase = {};

/**
 * Mocks updating the Guild configuration in a database.
 * @param {string} guildId 
 * @param {object} config 
 */
const mockUpdateGuildConfig = async (guildId, config) => {
    // Simulate async database operation
    await new Promise(resolve => setTimeout(resolve, 50)); 
    mockDatabase[guildId] = { ...mockDatabase[guildId], ...config };
    console.log(`Mock DB Updated for Guild ${guildId}:`, mockDatabase[guildId]);
};


export default async function handler(req, res) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const body = JSON.stringify(req.body);

  // 1. Security Signature Verification
  if (!process.env.PUBLIC_KEY || !verifyKey(body, signature, timestamp, process.env.PUBLIC_KEY)) {
    // In a real scenario, PUBLIC_KEY would be set. For mock environments, this might fail.
    // For this simulation, we'll bypass verification if the key isn't set, but warn.
    if (!process.env.PUBLIC_KEY) {
        console.warn("PUBLIC_KEY not set. Bypassing signature verification (MOCK MODE).");
    } else {
        return res.status(401).send('Invalid Request Signature');
    }
  }

  const interaction = req.body;
  
  // 2. Handle Discord PING (Health Check)
  if (interaction.type === 1) {
      return res.send({ type: 1 });
  }

  // 3. Handle Application Commands
  if (interaction.type === 2) {
      const { member, guild_id, data } = interaction;
      let responseContent;
      let deniedMessage = null;
      const currentConfig = mockDatabase[guild_id] || {};
      
      // Check Permissions for Admin commands
      if (data.name !== 'help' && !hasPermission(member, 'ADMINISTRATOR')) {
          deniedMessage = `❌ **Denied:** Requires Administrator permission to run this command.`;
          return res.send({ type: 4, data: { content: deniedMessage, flags: 64 } });
      }

      // --- COMMAND: /help ---
      if (data.name === 'help') {
           responseContent = `
              ### 📚 Synapse Pass - Command Help
              
              Synapse Pass automatically assigns a role to members after successful OAuth2 verification.
              
              **1. General Command:**
              - \`/help\`: Displays this help information.
              
              **2. Management Commands (Requires Administrator Permission):**
              - \`/setup-auth [role] [visibility]\`: Sets up the verification system, specifying the role to be assigned and message visibility (Public or Private).
              - \`/backup-members\`: Simulates fetching all current members' IDs and saving them as a manual backup.
              - \`/restore-members\`: Simulates assigning the verification role to all members stored in the latest backup.
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

          // Determine flags: 0 for Public, 64 for Ephemeral/Private
          const flags = visibility === 'public' ? 0 : 64;
          
          // Save Configuration (MOCK DB Operation)
          await mockUpdateGuildConfig(guild_id, { roleId: roleId });

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
      
      // --- COMMAND: /backup-members ---
      else if (data.name === 'backup-members') {
          // Simulation: Fetch a mock list of 50 member IDs
          const mockMembers = Array.from({ length: 50 }, () => ({
              id: generateMockDiscordId(),
              username: `MockUser_${Math.random().toString(36).substring(2, 7)}`,
          }));
          
          const backupTime = Date.now();
          
          // Save the mock backup list to the mock database
          await mockUpdateGuildConfig(guild_id, { 
              backupMembers: mockMembers, 
              lastBackup: backupTime 
          });

          responseContent = `### 💾 Backup Successful (Mocked)!
          \n- **Member IDs Backed Up:** ${mockMembers.length} (Simulated)
          \n- **Last Backup Time:** <t:${Math.floor(backupTime / 1000)}:f>
          \n\n*Note: In a real system, the Bot would fetch real member IDs here. This uses mock data.*`;
          
          return res.send({
            type: 4, 
            data: { content: responseContent, flags: 64 }
          });
      }
      
      // --- COMMAND: /restore-members ---
      else if (data.name === 'restore-members') {
          const membersToRestore = currentConfig.backupMembers;
          const roleId = currentConfig.roleId;

          if (!membersToRestore || membersToRestore.length === 0) {
              responseContent = `❌ **Restore Failed:** No backup data found for this server. Please run \`/backup-members\` first.`;
              return res.send({ type: 4, data: { content: responseContent, flags: 64 } });
          }

          if (!roleId) {
              responseContent = `❌ **Restore Failed:** No verification role configured. Please run \`/setup-auth\` first.`;
              return res.send({ type: 4, data: { content: responseContent, flags: 64 } });
          }

          // Simulation: Log the restore process
          const restoreCount = membersToRestore.length;
          const membersListPreview = membersToRestore.slice(0, 5).map(m => `\`${m.id}\``).join(', ');

          responseContent = `### 🚀 Restore Initiated (Mocked)!
          \n- **Members Targeted:** ${restoreCount}
          \n- **Target Role:** <@&${roleId}>
          \n- **Preview:** IDs like ${membersListPreview}...
          \n\n*Simulation complete. In a real system, the Bot would now assign the role to all ${restoreCount} backed-up members. This may take a few minutes.*`;
          
          return res.send({
            type: 4, 
            data: { content: responseContent, flags: 64 }
          });
      }
      
      // Fallback 
      return res.send({ 
          type: 4, 
          data: { content: `⚠️ Unknown command or missing handler for /${data.name}.` }
      });
  }

  return res.status(400).end();
}
