import db from "@/services/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const eventName = req.body.eventName;
        const eventDetails = req.body.eventDetails;
        let response = { status: "", msg: "", data: "" }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
        try {
            await db.storeLog(eventName, eventDetails, ip);
            response.status = "ok";
    
            res.json(response);
        } catch (err) {
            console.log(err)
            response.status = "error";
            response.msg = err;
            res.json(response)
        }
    }
}