import db from "@/services/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    // Enable CORS for mobile app
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.json({
                    status: "error",
                    msg: "ელ-ფოსტა და პაროლი აუცილებელია"
                });
            }

            // Get user by email
            const user = await db.getUserByEmail(email);

            if (!user) {
                return res.json({
                    status: "error",
                    msg: "მომხმარებელი ვერ მოიძებნა"
                });
            }

            // Check if user has password (registered via email)
            if (!user.password_hash) {
                return res.json({
                    status: "error",
                    msg: "ეს ანგარიში შექმნილია სოციალური ქსელით. გთხოვთ გამოიყენოთ Apple ან Google ავტორიზაცია"
                });
            }

            // Verify password
            const isValid = await bcrypt.compare(password, user.password_hash);

            if (!isValid) {
                return res.json({
                    status: "error",
                    msg: "არასწორი პაროლი"
                });
            }

            // Return user data (without password)
            res.json({
                status: "ok",
                data: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    paid_until: user.paid_until,
                    totalFavorites: user.totalFavorites,
                }
            });
        } catch (err) {
            console.error('Error logging in user:', err);
            res.json({
                status: "error",
                msg: "შესვლა ვერ მოხერხდა"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
