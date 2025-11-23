import connectToDatabase from '../../../lib/mongodb';
import GuildConfig from '../../../models/GuildConfig';

export default async function handler(req, res) {
  const { code, state: guildId } = req.query; 
  
  if (!code || !guildId) {
    // Redirect to a custom error page if parameters are missing
    return res.redirect('/error?message=Missing authentication code or Guild ID.');
  }

  try {
    // 1. EXCHANGE CODE FOR ACCESS TOKEN
    const tokenData = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI,
        scope: 'identify guilds.join',
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then(r => r.json());

    if (tokenData.error) throw new Error(tokenData.error_description || 'Token Exchange Failed');

    // 2. GET USER ID FROM ACCESS TOKEN
    const user = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }).then(r => r.json());

    // 3. RETRIEVE ROLE CONFIG FROM MONGODB
    await connectToDatabase();
    const config = await GuildConfig.findOne({ guildId: guildId });
    
    if (!config) {
      return res.redirect(`/error?message=Server configuration not found for Guild ${guildId}. Please ask the Admin to run /setup-auth.`);
    }

    // 4. ADD ROLE TO USER (Using the BOT's Token for permissions)
    const roleEndpoint = `https://discord.com/api/guilds/${guildId}/members/${user.id}/roles/${config.roleId}`;
    
    const roleRes = await fetch(roleEndpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`, // CRUCIAL: Use the Bot's token to execute the role addition
        'Content-Length': '0' // Required by Discord API for PUT requests
      },
    });

    if (roleRes.status !== 204) {
      // Role assignment failed (e.g., bot lacks permission, role is too high)
      const errorText = await roleRes.text();
      console.error('Role Add Failed:', errorText);
      return res.redirect(`/error?message=Role assignment failed. Status: ${roleRes.status}. Check bot permissions and role hierarchy.`);
    }

    // 5. SUCCESS
    res.redirect('/success'); // Redirect to the success page
  } catch (error) {
    console.error('Callback Error:', error);
    res.redirect(`/error?message=Authentication Failed. ${error.message}`);
  }
}