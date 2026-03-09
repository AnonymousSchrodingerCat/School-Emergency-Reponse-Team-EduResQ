import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { level, location } = req.body;
        
        const sql = neon(process.env.DATABASE_URL);
        
        await sql`
            INSERT INTO alerts (level, custom_location, status)
            VALUES (${level}, ${location || '12 S3 - EDISON'}, 'active')
        `;

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
