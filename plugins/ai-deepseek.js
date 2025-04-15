/*
- [ *PLUGINS AI DEEPSEEK* ]
- Description: Plugins ai yang baru pake new api, soalnya yang lama rusak apinya

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

import axios from "axios";

async function deepseek(query) {
  let { data } = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
    model: "deepseek/deepseek-chat:free",
    messages: [{
      role: "user",
      content: query
    }]
  }, {
    headers: {
      'Authorization': `Bearer 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`,
      'Content-Type': 'application/json'
    }
  });
  return data;
}
    
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukkan prompt\nContoh: *${usedPrefix + command}* Apa itu ikan?`);
    m.react("⌛")
    try {
      const hytam = await deepseek(text);
      let hasil = hytam?.choices?.[0]?.message?.content.trim();
      
      conn.sendMessage(m.chat, {
       // SESUAIKAN AJA
       document: ``,
       fileName: ``,
       mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
       fileLength: 999999999,
       pageCount: '2025',
       caption: `*DeepSeek AI :* ${hasil}`.trim(),
       contextInfo: {
         externalAdReply: {  
           title: `DEEPSEEK AI`, 
           body: '',
           thumbnailUrl: ``,
           sourceUrl: ``,
           mediaType: 1,
           renderLargerThumbnail: true
         }
       }
      });
    } catch (err) {
      m.reply(`Error: ${err}`);
    }
};

handler.help = ['deepseek <prompt>'];
handler.tags = ['ai'];
handler.command = /^(deepseek)$/i;

export default handler;