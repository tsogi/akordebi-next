import db from "@/services/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { songId } = req.query

    let response = { status: "", msg: "", data: "" }
    let rows = await db.getSongDifficulties(songId);

    // let count = rows.reduce((accumulator, current) => accumulator + parseInt(current.difficulty), 0);
    let averageDifficulty = rows.reduce((accumulator, current) => accumulator + parseInt(current.difficulty), 0) / rows.length;
    
    if (isNaN(averageDifficulty)) {
      averageDifficulty = 0;
    } else {
        averageDifficulty = Math.round(averageDifficulty);
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const existingDifficulty = await db.getDifficultyForIp(songId, ip);

    response.status = "ok";
    response.msg = "";
    response.data = { averageDifficulty, existingDifficulty };
    res.json(response);
  }

  if (req.method === 'POST') {
    const { songId } = req.query

    let response = { status: "", msg: "", data: "" }
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const existingDifficulty = await db.getDifficultyForIp(songId, ip);
  
    if (existingDifficulty) {
        response.status = "error";
        response.msg = "ხმა უკვე მიცემული გაქვთ";
        return res.json(response);
    }
  
    const affectedRows = await db.saveDifficulty(songId, req.body.difficulty, ip);
  
    if (affectedRows) {
        response.status = "ok";
        response.msg = "ხმა დაფიქსირებულია";
    } else {
        response.status = "error";
        response.msg = "დაფიქსირდა შეცდომა";
    }
    res.json(response);
  }

  if (req.method === 'PUT') {
    const { songId } = req.query

    let response = { status: "", msg: "", data: "" }
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let existingDifficulty = await db.getDifficultyForIp(songId, ip);
  
    if (!existingDifficulty) {
      return res.status(404).json({ message: 'Difficulty Rating was not found' });
    }
  
    let affectedRows = await db.updateDifficulty(songId, req.body.difficulty, ip);

    if (affectedRows) {
        response.status = "ok";
        response.msg = "ხმა დაფიქსირებულია";
    } else {
        response.status = "error";
        response.msg = "დაფიქსირდა შეცდომა";
    }
    res.json(response);
  }
}