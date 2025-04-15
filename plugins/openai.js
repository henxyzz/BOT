import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(
            m.chat,
            `Masukkan prompt!\n\nContoh: *${usedPrefix + command} kapan Indonesia merdeka*`,
            m
        );
    }

    try {
        let res = await axios.post(
            'https://api.blackbox.ai/api/chat',
            {
                messages: [{ role: 'user', content: text }],
                userSelectedModel: 'deepseek-v3',
                validated: '10f37b34-a166-4efb-bce5-1312d87f2f94'
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        conn.reply(m.chat, res.data, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `Terjadi kesalahan: ${error.response?.data?.message || error.message}`, m);
    }
};

handler.command = /^(ai|openai)$/i;
handler.help = ["ai","openai"];
handler.tags = ["ai"];
handler.limit = true;

export default handler;