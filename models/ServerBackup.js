import mongoose from 'mongoose';

// Schema cho mỗi thành viên đã được sao lưu
const verifiedMemberSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    verifiedAt: { type: Date, default: Date.now }
}, { _id: false });

// Schema chính cho việc cấu hình Server Backup
const serverBackupSchema = new mongoose.Schema({
    // ID của server Discord
    guildId: { type: String, required: true, unique: true }, 

    // ID của Admin đã thực hiện lệnh backup lần cuối
    adminId: { type: String, required: true },
    
    // Tên của server tại thời điểm backup
    serverName: { type: String, required: true },
    
    // Mảng chứa các ID thành viên đã xác minh
    verifiedMembers: [verifiedMemberSchema],
    
    // Thời gian backup cuối cùng
    lastBackup: { type: Date, default: Date.now }
});

// Tạo index kết hợp để truy vấn nhanh hơn
serverBackupSchema.index({ guildId: 1, adminId: 1 }, { unique: true });

// Tái sử dụng model đã tồn tại nếu có, nếu không thì tạo mới
const ServerBackup = mongoose.models.ServerBackup || mongoose.model('ServerBackup', serverBackupSchema, 'server_backups');

export default ServerBackup;
