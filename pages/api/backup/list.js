import connectToDatabase from '../../../lib/mongodb';
import ServerBackup from '../../../models/ServerBackup'; // ESM version of the model

/**
 * API handler to list all member backups saved by a specific admin.
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
    // This API is intended to be called from the dashboard/web interface.
    // In a real-world scenario, you would need authentication here to verify 
    // that the caller is a legitimate admin and has the right to view this data.
    // For this example, we will simulate the request using a query parameter.
    
    // Check if the request is a GET request (for fetching data)
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed. Use GET.' });
    }

    const { adminId } = req.query;

    if (!adminId) {
        return res.status(400).json({ success: false, message: 'Missing adminId query parameter.' });
    }

    try {
        await connectToDatabase();
        
        // Find all backup records associated with the provided adminId.
        // In a deployed app, you might only return records where the adminId matches 
        // the currently authenticated Discord user.
        const backups = await ServerBackup.find({ adminId: adminId }).lean();

        // Format the output: we only return essential data to the dashboard
        const formattedBackups = backups.map(backup => ({
            id: backup._id.toString(), // Convert MongoDB ObjectId to string
            guildId: backup.guildId,
            serverName: backup.serverName,
            memberCount: backup.verifiedMembers.length,
            lastBackup: backup.lastBackup,
            createdAt: backup.createdAt,
        }));

        return res.status(200).json({ 
            success: true, 
            data: formattedBackups 
        });

    } catch (e) {
        console.error('API Error fetching backups:', e);
        return res.status(500).json({ success: false, message: 'Internal Server Error while fetching backups.' });
    }
}
