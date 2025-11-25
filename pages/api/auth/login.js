import querystring from 'querystring';

// Get configuration information from environment variables
// Đã đổi tên biến để phù hợp với quy ước chung (REDIRECT_URI) và tránh xung đột.
const CLIENT_ID = process.env.CLIENT_ID || "YOUR_DISCORD_CLIENT_ID";
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/api/auth/callback";

// The required scopes for this application:
// 1. 'identify': To get user's basic info (ID, username).
// 2. 'guilds': To check if the user is an administrator of the target guild.
// 3. 'guilds.join': NEW! To automatically join the user to the target guild.
const SCOPES = ['identify', 'guilds', 'guilds.join'];

// Helper: Encode state to include Guild ID
const encodeState = (guildId) => {
    // In a real application, you would add a CSRF token here.
    // We are simply encoding the Guild ID for context.
    const data = { guildId: guildId };
    return Buffer.from(JSON.stringify(data)).toString('base64');
};

/**
 * Handles Discord OAuth2 Login initiation requests.
 * Reads the guild_id from the query and redirects the user to Discord.
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res
 */
export default function handler(req, res) {
    const { guild_id } = req.query;

    if (!guild_id) {
        // Fallback or error handling if guild_id is missing
        return res.status(400).send("Missing guild_id parameter.");
    }

    // Encode the guild_id into the state parameter
    const state = encodeState(guild_id);

    const params = {
        client_id: CLIENT_ID, // Đã đổi thành CLIENT_ID
        redirect_uri: REDIRECT_URI, // Đã đổi thành REDIRECT_URI
        response_type: 'code',
        // Join scopes with a space (automatically handled by querystring)
        scope: SCOPES.join(' '),
        state: state,
    };

    // Construct the final Discord Authorization URL
    const discordAuthUrl = `https://discord.com/oauth2/authorize?${querystring.stringify(params)}`;

    // Redirect the user to the Discord authorization page
    res.setHeader('Location', discordAuthUrl);
    res.status(302).end();
}
