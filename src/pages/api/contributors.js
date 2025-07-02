import db from "@/services/db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const contributors = await db.getContributors();
        res.status(200).json({ contributors });
    } catch (error) {
        console.error("Error fetching contributors:", error);
        res.status(500).json({ error: "Error fetching contributors" });
    }
} 