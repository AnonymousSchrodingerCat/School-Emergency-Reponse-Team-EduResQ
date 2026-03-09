import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sql = neon(process.env.DATABASE_URL);
        
        const stats = await sql`
            SELECT 
                COUNT(*) as total_alerts,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_alerts,
                COUNT(CASE WHEN level = 'RED' THEN 1 END) as red_alerts,
                COUNT(CASE WHEN level = 'ORANGE' THEN 1 END) as orange_alerts,
                COUNT(CASE WHEN level = 'YELLOW' THEN 1 END) as yellow_alerts
            FROM alerts
        `;

        return res.status(200).json(stats[0] || {});
    } catch (error) {
        return res.status(500).json({ 
            error: 'Stats error',
            message: error.message 
        });
    }
}
