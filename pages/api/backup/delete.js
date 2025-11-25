import connectToDatabase from '../../../lib/mongodb';
import ServerBackup from '../../../models/ServerBackup'; // ESM version of the model
import mongoose from 'mongoose';

/**
 * API handler to delete a specific member backup record.
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
    
    // This API only supports DELETE method
    if (req.method !== 'DELETE') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed. Use DELETE.' });
    }

    const { backupId, adminId } = req.query;

    if (!backupId || !adminId) {
        return res.status(400).json({ success: false, message: 'Missing backupId or adminId query parameter.' });
    }
    
    // Basic validation for MongoDB ObjectId format
    if (!mongoose.isValidObjectId(backupId)) {
        return res.status(400).json({ success: false, message: 'Invalid backup ID format.' });
    }

    try {
        await connectToDatabase();
        
        // Find and delete the backup record. 
        // IMPORTANT: We use both _id and adminId to ensure that only the admin who created the backup 
        // (or the currently authenticated admin) can delete it.
        const result = await ServerBackup.deleteOne({ 
            _id: backupId,
            adminId: adminId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Backup not found or you do not have permission to delete it.' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: `Backup ID ${backupId} successfully deleted.`
        });

    } catch (e) {
        console.error('API Error deleting backup:', e);
        return res.status(500).json({ success: false, message: 'Internal Server Error while deleting backup.' });
    }
}
