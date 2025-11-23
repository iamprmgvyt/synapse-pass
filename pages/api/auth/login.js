export default function handler(req, res) {
  const { guild_id } = req.query;

  if (!guild_id) {
    return res.status(400).send("Missing 'guild_id' parameter. Cannot proceed.");
  }

  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  // SCOPE required: identify (to get user ID) and guilds.join (to add role)
  const scope = 'identify guilds.join'; 
  
  // The 'state' parameter is crucial: it carries the guildId back to the callback endpoint.
  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${guild_id}`;

  res.redirect(discordUrl);
}