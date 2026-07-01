import { config } from '../config/index.js';

const buildSlackPayload = (error, req) => {
  const text = [
    '*Error 5XX en BildyApp*',
    `timestamp: ${new Date().toISOString()}`,
    `metodo: ${req.method}`,
    `ruta: ${req.originalUrl}`,
    `mensaje: ${error.message}`,
    `stack: ${error.stack}`,
  ].join('\n');

  return { text };
};

export const sendErrorToSlack = async (error, req) => {
  if (!config.slackWebhookUrl) {
    return;
  }

  try {
    const response = await fetch(config.slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildSlackPayload(error, req)),
    });

    if (!response.ok) {
      console.error('Error enviando a Slack:', response.statusText);
    }
  } catch (slackError) {
    console.error('Error enviando a Slack:', slackError.message);
  }
};