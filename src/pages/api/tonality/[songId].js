import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import db from '@/services/db';

export default async function handler(req, res) {
    const supabase = createPagesServerClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { songId } = req.query;
    const userId = session.user.id;
    
    if (req.method === 'GET') {
        try {
            const tonality = await db.getUserTonality(userId, songId);
            res.status(200).json({ tonality: tonality || 0 });
        } catch (error) {
            console.error('Error fetching tonality:', error);
            res.status(500).json({ error: 'Failed to fetch tonality' });
        }
    } else if (req.method === 'POST') {
        try {
            const { tonality } = req.body;
            
            if (tonality < -6 || tonality > 6) {
                return res.status(400).json({ error: 'Tonality must be between -6 and 6' });
            }

            if (tonality === 0) {
                // Remove the record from db if tonality is 0
                await db.deleteUserTonality(userId, songId);
            } else {
                await db.setUserTonality(userId, songId, tonality);
            }
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error setting tonality:', error);
            res.status(500).json({ error: 'Failed to set tonality' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 