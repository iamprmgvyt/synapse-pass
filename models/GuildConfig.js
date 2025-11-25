import mongoose from 'mongoose'; // Đã chuyển lại thành cú pháp import

const guildConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    // Vai trò được gán sau khi xác minh thành công.
    verifiedRoleId: { type: String, required: false }, 
    
    // ID của Admin đã thiết lập lần cuối.
    setupAdminId: { type: String, required: true },
    setupDate: { type: Date, default: Date.now }

    // Các trường liên quan đến mật khẩu đã bị loại bỏ theo yêu cầu.
});

// Sử dụng export default cho môi trường Next.js/ES Module
export default mongoose.models.GuildConfig || mongoose.model('GuildConfig', guildConfigSchema, 'guild_configs');
