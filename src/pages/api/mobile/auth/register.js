import db from "@/services/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

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
            const { email, password, full_name } = req.body;

            if (!email || !password) {
                return res.json({
                    status: "error",
                    msg: "ელ-ფოსტა და პაროლი აუცილებელია"
                });
            }

            if (password.length < 6) {
                return res.json({
                    status: "error",
                    msg: "პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს"
                });
            }

            // Check if user already exists
            const existingUser = await db.getUserByEmail(email);

            if (existingUser) {
                return res.json({
                    status: "error",
                    msg: "ეს ელ-ფოსტა უკვე დარეგისტრირებულია"
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Generate unique user ID
            const userId = `email_${uuidv4()}`;

            // Create user
            const userData = await db.createUserWithPassword({
                id: userId,
                email,
                full_name: full_name || '',
                password_hash: passwordHash
            });

            res.json({
                status: "ok",
                data: {
                    id: userData.id,
                    email: userData.email,
                    full_name: userData.full_name,
                }
            });
        } catch (err) {
            console.error('Error registering user:', err);
            res.json({
                status: "error",
                msg: "რეგისტრაცია ვერ მოხერხდა"
            });
        }
    } else {
        res.status(405).json({ status: "error", msg: "Method not allowed" });
    }
}
