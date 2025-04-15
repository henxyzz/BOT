import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
    if (!text) {
        return m.reply(`*• Example:* .copilot2trip Bagaimana saya mengunjungi Padang Pariaman?`);
    }

    try {
        let res = await fetch(`https://itzpire.com/ai/copilot2trip?q=${encodeURIComponent(text)}`);
        
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

        let gpt = await res.json();

        if (!gpt.result) throw new Error('Invalid response from API');

        let messageContent = {
            text: '> Travel Assistant Copilot AI\n\n' + gpt.result
        };

        await conn.sendMessage(m.chat, messageContent, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("❌ *Error:* " + e.message);
    }
};

handler.tags = ['ai'];
handler.help = ['copilot2trip'];
handler.command = /^copilot2trip$/i;

export default handler;