import db from "@/services/db";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Get user from supabase
    const supabase = createPagesServerClient({ req, res });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    // Check if user has permission to manage subscriptions
    const authorizedEmails = process.env.NEXT_PUBLIC_CAN_DELETE_SONG?.split(',') || [];
    if (!authorizedEmails.includes(user.email)) {
        return res.status(403).json({ error: "Not authorized to manage subscriptions" });
    }

    const { userEmail, paidUntil } = req.body;

    if (!userEmail || !paidUntil) {
        return res.status(400).json({ error: "User email and paid_until date are required" });
    }

    try {
        // First check if user exists in the database
        const [userRows] = await db.pool.execute(`
            SELECT id FROM users WHERE email = ?
        `, [userEmail]);

        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found with this email" });
        }

        const userId = userRows[0].id;

        // Update user subscription
        const [result] = await db.pool.execute(`
            UPDATE users 
            SET payment_date = "1993-01-19 00:00:00", 
                payment_confirmed = 1, 
                paid_until = ? 
            WHERE email = ?
        `, [paidUntil, userEmail]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Failed to update user subscription" });
        }

        res.status(200).json({ 
            message: "User subscription updated successfully",
            userEmail,
            paidUntil 
        });
    } catch (error) {
        console.error("Error updating user subscription:", error);
        res.status(500).json({ error: "Error updating user subscription" });
    }
} 