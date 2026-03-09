import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        
        const alerts = await sql`
            SELECT id, level, custom_location, status, created_at
            FROM alerts 
            ORDER BY created_at DESC 
            LIMIT 100
        `;

        return res.status(200).json(alerts);
    } catch (error) {
        return res.status(500).json({ 
            error: 'Database error',
            message: error.message 
        });
    }
}
