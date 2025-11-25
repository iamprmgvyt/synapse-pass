import querystring from 'querystring';
import connectToDatabase from '../../../lib/mongodb';
import GuildConfig from '../../../models/GuildConfig';

// --- Cấu hình Biến Môi trường & Constants ---
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const BOT_TOKEN = process.env.BOT_TOKEN; 
const DISCORD_API_BASE = 'https://discord.com/api/v10';
const SCOPE_JOIN = 'guilds.join'; 

// --- Hàm tiện ích ---

/**
 * Xác định URL cơ sở của ứng dụng.
 * @param {import('next').NextApiRequest} req 
 * @returns {string} Base URL
 */
const getBaseUrl = (req) => {
    const domain = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL;
    if (domain) {
        return domain.endsWith('/') ? domain.slice(0, -1) : domain;
    }
    // Fallback cho môi trường phát triển/local
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    return `${protocol}://${req.headers.host}`;
};

/**
 * Giải mã tham số state (Base64) để lấy Guild ID và các dữ liệu khác.
 * @param {string} state - Base64 encoded string
 * @returns {{guildId: string}} Decoded state object
 */
const decodeState = (state) => {
    try {
        const decodedString = Buffer.from(state, 'base64').toString('utf-8');
        return JSON.parse(decodedString);
    } catch (e) {
        console.error("Error decoding state:", e);
        return null;
    }
};

/**
 * Xử lý luồng OAuth2 Callback.
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
    const { code, state, error: discordError } = req.query;

    // 1. Xử lý lỗi từ Discord và State
    if (discordError || !code) {
        console.error("Discord returned an error or missing code:", discordError);
        return res.redirect(`/error?message=${encodeURIComponent('User denied authorization or missing authorization code.')}`);
    }

    const stateData = decodeState(state);
    if (!stateData || !stateData.guildId) {
        return res.redirect(`/error?message=${encodeURIComponent('Invalid or missing state parameter (Guild ID).')}`);
    }

    const guildId = stateData.guildId;
    const baseUrl = getBaseUrl(req);
    const redirectUri = `${baseUrl}/api/auth/callback`;
    let userId = null;

    try {
        // 2. Trao đổi Code lấy Access Token (Server-to-Server)
        const tokenResponse = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: querystring.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                // Đảm bảo có đủ 3 scopes: 'identify', 'guilds', 'guilds.join'
                scope: 'identify guilds guilds.join', 
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error("Token exchange failed:", errorText);
            throw new Error('Failed to exchange authorization code for tokens.');
        }

        const tokens = await tokenResponse.json();
        const accessToken = tokens.access_token;
        const scopes = tokens.scope.split(' ');
        
        // 3. Lấy thông tin người dùng (UserID)
        const userResponse = await fetch(`${DISCORD_API_BASE}/users/@me`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user information.');
        }

        const user = await userResponse.json();
        userId = user.id;

        // 4. Kết nối DB và lấy Role ID đã cấu hình
        await connectToDatabase();
        const config = await GuildConfig.findOne({ guildId: guildId });

        if (!config || !config.verifiedRoleId) {
            throw new Error('Server verification role not configured (verifiedRoleId missing in database).');
        }
        const roleId = config.verifiedRoleId;


        // 5. Tự động thêm thành viên vào Guild (sử dụng scope 'guilds.join')
        // Endpoint này yêu cầu BOT_TOKEN để thực hiện hành động PUT
        if (scopes.includes(SCOPE_JOIN)) {
            const joinResponse = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/members/${userId}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bot ${BOT_TOKEN}`, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ access_token: accessToken }),
            });
            
            // 201: created/joined, 204: already exists. 409: đã tồn tại (ignored)
            if (!joinResponse.ok && joinResponse.status !== 204 && joinResponse.status !== 409) {
                const errorText = await joinResponse.text();
                console.warn(`[Guild Join] Failed for User ${userId} in Guild ${guildId}. Status: ${joinResponse.status}. Error: ${errorText}`);
                // Vẫn tiếp tục gán role
            } else if (joinResponse.status === 201) {
                console.log(`User ${userId} successfully joined Guild ${guildId}.`);
            }
        }
        
        // 6. Gán Vai trò cho thành viên (sử dụng BOT_TOKEN - quyền bot)
        const roleAssignmentResponse = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
            method: 'PUT', // PUT để thêm role
            headers: { 
                'Authorization': `Bot ${BOT_TOKEN}`,
            },
        });

        if (!roleAssignmentResponse.ok) {
            const errorText = await roleAssignmentResponse.text();
            console.error(`Role assignment failed: Status ${roleAssignmentResponse.status}. Error: ${errorText}`);
            throw new Error('Failed to assign the verification role. Check bot permissions (Manage Roles) and hierarchy.');
        }

        // 7. Hoàn tất thành công
        console.log(`User ${userId} successfully verified and assigned role ${roleId} in guild ${guildId}.`);
        return res.redirect(`/success?guild=${guildId}`);

    } catch (error) {
        // Xử lý lỗi chung và chuyển hướng đến trang lỗi
        console.error("Authentication/Role Assignment Error:", error.message);
        return res.redirect(`/error?message=${encodeURIComponent(error.message)}&user=${userId}`);
    }
}
