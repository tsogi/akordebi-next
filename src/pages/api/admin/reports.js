import db from "@/services/db";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
    // Get user from supabase
    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    // Check if user has permission to manage reports
    const authorizedEmails = process.env.NEXT_PUBLIC_CAN_DELETE_SONG?.split(',') || [];
    if (!authorizedEmails.includes(user.email)) {
        return res.status(403).json({ error: "Not authorized to manage reports" });
    }

    if (req.method === "GET") {
        try {
            // Get all reports, ordered by most recent first
            const [reports] = await db.pool.execute(`
                SELECT id, song_url, line_number, line_text, report_text, status, ip, created_at, updated_at
                FROM reports 
                ORDER BY created_at DESC
            `);

            res.status(200).json({ reports });
        } catch (error) {
            console.error("Error fetching reports:", error);
            res.status(500).json({ error: "Error fetching reports" });
        }
    } else if (req.method === "POST") {
        const { reportId, status } = req.body;

        if (!reportId || !status) {
            return res.status(400).json({ error: "Report ID and status are required" });
        }

        try {
            // Update report status
            const [result] = await db.pool.execute(`
                UPDATE reports 
                SET status = ?, updated_at = NOW() 
                WHERE id = ?
            `, [status, reportId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Report not found" });
            }

            res.status(200).json({ 
                message: "Report status updated successfully",
                reportId,
                status 
            });
        } catch (error) {
            console.error("Error updating report status:", error);
            res.status(500).json({ error: "Error updating report status" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
} 