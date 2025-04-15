/*
- [ *PLUGINS META AI* ]
- Description: Plugins meta ai

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

import axios from 'axios';

async function llama(query) {
  try {
    let { data } = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "meta-llama/llama-3.3-70b-instruct:free",
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
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}
 
const handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) return m.reply(`Masukan prompt\nContoh: *${usedPrefix + command}* Apa itu ikan`);    
  m.react("⌛");
  
  try {
    const hytam = await llama(text);
    let hasil = hytam?.choices?.[0]?.message?.content?.trim() || '';
    
    conn.sendMessage(m.chat, {
       // SESUAIKAN AJA
       document: ``,
       fileName: ``,
       mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
       fileLength: 999999999,
       pageCount: '2025',
       caption: `*Meta AI :* ${hasil}`.trim(),
       contextInfo: {
         externalAdReply: {  
           title: `META AI`, 
           body: '',
           thumbnailUrl: ``,
           sourceUrl: ``,
           mediaType: 1,
           renderLargerThumbnail: true
         }
       }
    });
  } catch (error) {
    await conn.sendMessage(m.chat, {
      text: `Error: ${error.message}`,
    });
  }
}
 
handler.help = ['meta <prompt>']
handler.tags = ['ai']
handler.command = /^(meta)$/i
handler.register = true
 
export default handler;