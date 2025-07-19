import db from "@/services/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const contributors = await db.getContributorsWithPayments();
            res.status(200).json({ contributors });
        } catch (error) {
            console.error('Error fetching contributors:', error);
            res.status(500).json({ error: 'Failed to fetch contributors' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 