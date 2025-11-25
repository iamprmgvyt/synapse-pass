import mongoose from 'mongoose';

// Định nghĩa schema cho cấu hình máy chủ (Guild) Discord
// Schema này sẽ lưu trữ Guild ID và Role ID cần gán khi người dùng xác thực thành công.
const GuildConfigSchema = new mongoose.Schema({
    // ID của máy chủ Discord (Guild ID)
    guildId: {
        type: String,
        required: true,
        unique: true, // Đảm bảo mỗi máy chủ chỉ có một cấu hình
    },
    // ID của vai trò (Role ID) sẽ được gán cho thành viên đã xác thực
    verifiedRoleId: {
        type: String,
        required: true,
    },
    // Các trường tùy chọn khác có thể thêm sau này (ví dụ: kênh log)
    logChannelId: {
        type: String,
        required: false,
    },
}, { 
    timestamps: true // Tự động thêm createdAt và updatedAt
});

// Kiểm tra xem Model đã tồn tại chưa để tránh lỗi khi reload (trong Next.js development)
export default mongoose.models.GuildConfig || mongoose.model('GuildConfig', GuildConfigSchema);
