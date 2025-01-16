const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/lsdkfj/lsdkfj/LbznmuC8Z'; // Todo move this to .env.local

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

    if (!response.ok) {
        throw new Error(`Failed to send slack message with status code ${response.status}`);
    }
}