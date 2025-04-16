import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import db from "@/services/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the user from the session using Supabase auth
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    // Use the MySQL db service to update the subscription
    const result = await db.activateUserSubscription(userId);
    
    if (!result.success) {
      return res.status(500).json({ error: "Failed to update subscription" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
} 