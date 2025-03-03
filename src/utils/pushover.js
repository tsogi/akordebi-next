import Pushover from 'node-pushover';

const push = new Pushover({
  token: process.env.PUSHOVER_APP_TOKEN,
  user: process.env.PUSHOVER_USER_KEY
});

export async function sendNotification(message) {
  try {
    await push.send('აკორდები.გე - ახალი შეტყობინება', message);
    return true;
  } catch (error) {
    console.error('Error sending Pushover notification:', error);
    return false;
  }
} 