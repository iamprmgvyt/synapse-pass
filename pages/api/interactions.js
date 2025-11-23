import { verifyKey } from 'discord-interactions';
import connectToDatabase from '../../lib/mongodb';
import GuildConfig from '../../models/GuildConfig';

// Helper function to construct the unique Auth URL
const getAuthLink = (guildId) => {
    // Ưu tiên sử dụng biến môi trường APP_URL (do người dùng định nghĩa, đảm bảo URL sạch sẽ).
    // Nếu không có, fallback về VERCEL_URL tự động (kèm https://).
    const domain = process.env.APP_URL || `https://${process.env.VERCEL_URL || 'your-project-name.vercel.app'}`;
    return `${domain}/api/auth/login?guild_id=${guildId}`;
};

export default async function handler(req, res) {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const body = JSON.stringify(req.body);

    // 1. Verify the security signature (REQUIRED for HTTP Interactions)
    if (!verifyKey(body, signature, timestamp, process.env.PUBLIC_KEY)) {
        return res.status(401).send('Invalid Request Signature');
    }

    const interaction = req.body;
    
    switch (interaction.type) {
        // Health Check (PONG)
        case 1: 
            return res.send({ type: 1 });

        // Handle Slash Command
        case 2: 
            const commandName = interaction.data.name;
            const guildId = interaction.guild_id;

            if (commandName === 'setup-auth') {
                // Get Role ID from the command option
                const roleId = interaction.data.options[0].value;
                await connectToDatabase();
                
                // Save/update configuration in MongoDB
                await GuildConfig.findOneAndUpdate(
                    { guildId: guildId },
                    { roleId: roleId },
                    { upsert: true, new: true }
                );

                const authLink = getAuthLink(guildId);
                
                return res.send({
                    type: 4, // Send message response
                    data: {
                        content: `✅ **Synapse Pass** setup complete!\n\n**Role to assign:** <@&${roleId}>\n**Verification Link:** \`${authLink}\`\n\nYou can embed this link in your rules channel.`,
                        flags: 64 // Ephemeral message
                    }
                });
            }
            break;
        
        default:
            return res.status(400).send('Unknown interaction type');
    }
}
