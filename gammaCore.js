require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const alpha = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

alpha.onText(/\/trace (.+)/, async (msg, match) => {
    const xid = msg.chat.id;
    const trackNum = match[1];

    try {
        const res = await axios.get(`https://api.aftership.com/v4/trackings/aramex/${trackNum}`, {
            headers: {
                'aftership-api-key': process.env.AFTERSHIP_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const t = res.data.data.tracking;
        alpha.sendMessage(xid, `
📦 شركة: Aramex
🚚 الحالة: ${t.tag}
📍 الموقع الأخير: ${t.checkpoints[0]?.location || 'غير متوفر'}
🕒 آخر تحديث: ${t.checkpoints[0]?.checkpoint_time || 'غير متوفر'}
        `);
    } catch (err) {
        alpha.sendMessage(xid, '❌ لم أتمكن من التتبع.');
    }
});
