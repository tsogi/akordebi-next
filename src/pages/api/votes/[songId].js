import db from "@/services/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { songId } = req.query

    let response = { status: "", msg: "", data: "" }
    let rows = await db.getSongVotes(songId);

    let count = rows.reduce((accumulator, current) => accumulator + parseInt(current.vote), 0);
    if(!rows.length) {
        // Todo create function for generating this responses
        response.status = "ok";
        response.msg = "";
        response.data = { totalCount: count };
        res.json(response);
        return;
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const existingVote = await db.getVoteForIp(songId, ip);

    response.status = "ok";
    response.msg = "";
    response.data = { totalCount: count, existingVote };
    res.json(response);
  }

  if (req.method === 'POST') {
    const { songId } = req.query

    let response = { status: "", msg: "", data: "" }
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const existingVote = await db.getVoteForIp(songId, ip);
  
    if (existingVote) {
        response.status = "error";
        response.msg = "ხმა უკვე მიცემული გაქვთ";
        return res.json(response);
    }
  
    const affectedRows = await db.saveVote(songId, req.body.vote, ip);
  
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
    let existingVote = await db.getVoteForIp(songId, ip);
  
    if (!existingVote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
  
    let affectedRows = await db.updateVote(songId, req.body.vote, ip);

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