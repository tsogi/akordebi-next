import { sendSlackNotification } from "@/services/slack";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const message = req.body.message;

        let response = { status: "", msg: "", data: "" }
    
        try {
            await sendSlackNotification(message);
            response.status = "ok";
    
            res.json(response);
        } catch (err) {
            response.status = "error";
            response.msg = err;
            res.json(response)
        }
    }
}