// bot/interactionCreate.js
// Chứa logic xử lý cho sự kiện 'interactionCreate'
// (Được trích xuất từ client.js gốc)

/**
 * Xử lý tất cả các tương tác (Interactions) từ Discord.
 * Đảm bảo phản hồi nhanh chóng (dưới 3s) để tránh timeout của Discord.
 * @param {import('discord.js').Interaction} interaction Đối tượng tương tác Discord
 */
async function handleInteraction(interaction) {
    // Chỉ xử lý Slash Commands
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    console.log(`[Interaction] Received command: /${commandName} from ${interaction.user.tag}`);

    try {
        if (commandName === 'help') {
            // Acknowledge the interaction immediately to prevent the 3s timeout
            await interaction.reply({ 
                content: '**Synapse Pass Help:**\n' +
                         '**/setup-auth**: Setup the authentication gateway. Requires Administrator permissions.\n' +
                         '**/help**: Displays this instruction guide.',
                ephemeral: false // Publicly visible
            });
        } else if (commandName === 'setup-auth') {
            // Defer the reply to buy more time (up to 15 minutes) for complex processing
            await interaction.deferReply({ ephemeral: true }); 
            
            // TODO: Add the actual 'setup-auth' business logic here.
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work
            
            await interaction.editReply({ 
                content: '✅ Command `/setup-auth` received. Feature under development. Data: ' + 
                         `Role ID: ${interaction.options.getRole('role').id}, Visibility: ${interaction.options.getString('visibility')}`
            });
        }
    } catch (error) {
        console.error(`❌ [Interaction Error] Error processing /${commandName}:`, error);
        
        // Attempt to send an error reply if nothing has been sent yet
        if (!interaction.deferred && !interaction.replied) {
            await interaction.reply({ content: 'Error: Could not execute this command due to a system failure.', ephemeral: true });
        } else if (interaction.deferred) {
            await interaction.editReply({ content: 'Error: Could not complete this command due to a system failure.', ephemeral: true });
        }
    }
}

module.exports = { handleInteraction };
