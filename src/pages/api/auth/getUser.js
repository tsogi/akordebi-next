import db from "@/services/db";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Get user from supabase
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userExists = await db.getUserByID(user.id);
    let userDetails = null;

    if (userExists) {
      userDetails = userExists;
    } else {
      userDetails = await db.setUserData(user);
    }
    return res.status(200).json({ user: userDetails });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
