// Discord OAuth Login Initiator API Route
// File: pages/api/auth/login.js

// LƯU Ý QUAN TRỌNG: Bạn cần định nghĩa các biến môi trường này
// (DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI) trong file .env của dự án.
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "YOUR_DISCORD_CLIENT_ID";
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

// Các scopes cần thiết:
// 'identify': Lấy thông tin người dùng (ID, username).
// 'guilds': Lấy danh sách servers mà người dùng tham gia (để kiểm tra quyền quản lý).
// 'guilds.join': (Optional) Nếu bot cần thêm role sau khi xác thực.
const SCOPES = ['identify', 'guilds']; 

// Chúng ta sẽ dùng trạng thái (state) để lưu Guild ID, để biết người dùng
// đang đăng nhập cho server nào sau khi Discord trả về phản hồi.
// Điều này giúp ngăn chặn các yêu cầu giả mạo CSRF và gắn kết quá trình đăng nhập
// với server cụ thể.
const encodeState = (guildId) => {
    // Trong môi trường thực tế, bạn nên mã hóa thêm một token ngẫu nhiên để chống CSRF.
    // Ở đây, ta chỉ mã hóa Guild ID để đơn giản hóa.
    return btoa(JSON.stringify({ guildId, timestamp: Date.now() }));
};

/**
 * Xử lý yêu cầu HTTP để khởi tạo quá trình Discord OAuth2.
 * Đọc guild_id từ truy vấn và chuyển hướng người dùng đến Discord.
 * * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 */
export default function handler(req, res) {
    // 1. Lấy Guild ID từ truy vấn
    const { guild_id } = req.query;

    if (!guild_id) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing 'guild_id' query parameter." 
        });
    }

    // 2. Tạo chuỗi state (chứa Guild ID)
    const state = encodeState(guild_id);

    // 3. Xây dựng URL Discord OAuth2
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=${SCOPES.join('%20')}&state=${state}&prompt=consent`;

    // 4. Chuyển hướng người dùng
    console.log(`Redirecting user to Discord URL: ${discordAuthUrl}`);
    res.setHeader('Location', discordAuthUrl);
    res.status(302).end();
}
