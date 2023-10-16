const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'; // Replace with your Webhook URL

export async function sendSlackNotification(message) {
    const payload = {
        text: message
    };

    const response = await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    console.log("resp", response);

    if (!response.ok) {
        throw new Error(`Failed to send slack message with status code ${response.status}`);
    }
}