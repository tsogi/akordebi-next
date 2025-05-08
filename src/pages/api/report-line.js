import db from "@/services/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { lineNumber, lineText, songUrl, reportText } = req.body;
    
    // Validate required fields
    if (!lineText || !songUrl || !reportText) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get the client IP
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
    
    // Store the report in the database
    await db.storeReport(lineNumber, lineText, songUrl, reportText, ip);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling report submission:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 