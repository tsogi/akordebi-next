import db from "@/services/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const searchText = req.body.searchText;
        let response = { status: "", msg: "", data: "" }
    
        try {
            let rows = await db.searchSongs(searchText);
            response.status = "ok";
            response.msg = "";
            response.data = rows;
    
            res.json(response);
        } catch (err) {
            response.status = "error";
            response.msg = err;
            res.json(response)
        }
    }
}