import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // Allow CORS for ESP32
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { level, location } = req.body;
        
        if (!level) {
            return res.status(400).json({ error: 'Level is required' });
        }

        // Connect to Neon database
        const sql = neon(process.env.DATABASE_URL);
        
        // Save the alert
        await sql`
            INSERT INTO alerts (level, custom_location, status)
            VALUES (${level}, ${location || '12 S3 - EDISON'}, 'active')
        `;

        console.log(`✅ Alert saved from ESP32: ${level}`);
        
        res.status(200).json({ 
            success: true, 
            message: 'Alert saved to database' 
        });
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Failed to save alert',
            details: error.message 
        });
    }
}
