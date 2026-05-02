const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// TODO: revisar , no me convence 
const buildSlackPayload = (message) => {
  return {
    text: message,
  };
}

const sendErrorToSlack = async (message) => {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('SLACK_WEBHOOK_URL is not defined. Skipping Slack notification.');
    return;
    }
    const payload = buildSlackPayload(message);
    try {
      const response = await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        });
        if (!response.ok) {
            console.error('Failed to send error to Slack:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending error to Slack:', error);
    }
};

module.exports = {sendErrorToSlack};