import connectToDatabase from '../../../lib/mongodb';
import GuildConfig from '../../../models/GuildConfig';
import querystring from 'querystring';

// Discord OAuth2 constants
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Utility function to determine the base URL
const getBaseUrl = (req) => {
    const domain = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL;
    if (domain) {
        return domain.endsWith('/') ? domain.slice(0, -1) : domain;
    }
    // Fallback for development/local
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    return `${protocol}://${req.headers.host}`;
};

// API handler
export default async function handler(req, res) {
    const { code, state: guildId, error } = req.query;
    
    // 1. Handle potential error redirect from Discord
    if (error) {
        console.error('Discord OAuth Error:', error);
        return res.redirect(`/error?message=${encodeURIComponent('Discord authorization failed.')}`);
    }

    // Check for essential parameters
    if (!code || !guildId) {
        return res.redirect(`/error?message=${encodeURIComponent('Missing OAuth code or guild ID.')}`);
    }

    const baseUrl = getBaseUrl(req);
    const redirectUri = `${baseUrl}/api/auth/callback`;

    let userAccessToken;
    let discordUser;

    try {
        // --- 2. Exchange Code for Token ---
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: querystring.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                scope: 'identify guilds.join',
            }),
        });
        
        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('Token Exchange Error:', tokenData);
            return res.redirect(`/error?message=${encodeURIComponent(tokenData.error_description || 'Failed to exchange code for token.')}`);
        }

        userAccessToken = tokenData.access_token;

        // --- 3. Get User Identity ---
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${userAccessToken}`,
            },
        });
        
        discordUser = await userResponse.json();

        if (discordUser.id) {
            console.log(`User ${discordUser.username} (ID: ${discordUser.id}) successfully identified.`);
        } else {
            return res.redirect(`/error?message=${encodeURIComponent('Failed to fetch user profile.')}`);
        }

        // --- 4. Connect to DB and Get Role Config ---
        await connectToDatabase();
        const config = await GuildConfig.findOne({ guildId });

        if (!config || !config.verifiedRoleId) {
            console.warn(`Guild ${guildId} configuration not found or role missing.`);
            return res.redirect(`/error?message=${encodeURIComponent('Verification role not configured by server administrator.')}`);
        }
        
        // --- 5. Add User to Guild (Guilds.Join Scope) ---
        // This requires the OAuth2 token (which has the guilds.join scope).
        const memberAddResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bot ${process.env.BOT_TOKEN}`, // Typically requires Bot token for this endpoint
            },
            body: JSON.stringify({
                access_token: userAccessToken,
                roles: [config.verifiedRoleId] // Assign the role immediately
            }),
        });

        const memberAddData = await memberAddResponse.json();
        
        // Discord returns 201 (Created) if the user was added, 204 (No Content) if they were already in the guild.
        if (memberAddResponse.ok || memberAddResponse.status === 201 || memberAddResponse.status === 204) {
            // Success! The user is now in the guild and has the verified role.
            console.log(`User ${discordUser.id} successfully joined/updated in guild ${guildId} with role ${config.verifiedRoleId}.`);
            return res.redirect('/success');
        } else {
            console.error('Error adding user to guild/assigning role:', memberAddResponse.status, memberAddData);
            let errorMessage = 'Failed to add user to server or assign role.';
            if (memberAddResponse.status === 403) {
                errorMessage = 'Bot is missing permissions (MANAGE_ROLES) or its role is too low to assign the verified role.';
            }
            return res.redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
        }
        
    } catch (e) {
        console.error('Fatal API Callback Error:', e);
        return res.redirect(`/error?message=${encodeURIComponent('An unexpected error occurred during the verification process.')}`);
    }
}
