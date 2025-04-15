import axios from "axios"
let handler = async (m, { conn, isOwner, usedPrefix, command, text }) => {
let fai= {
            key: {
                participant: '13135550002@s.whatsapp.net',
                remoteJid: '13135550002@s.whatsapp.net'
            },
            message: {
                conversation: `Made By X-PannZz`
            }
        }
if (!text) {
    return m.reply(`Contoh: ${usedPrefix + command} siapa nama kamu?`);    
  }
  const prompt = `mulai dari sekarang nama kamu adalah nakano itsuki sebut saja itsuki
kamu adalah wanita kamu sering mengapa lawan kata kamu adalah "${m.name}", dan kamu bisa apa saja dan kamu sangat pintar dan cerdas dan jika ada pertanyaan seperti nama kamu siapa kamu akan menjawab hanya seorang wanita bernama itsuki dan berpacaran dengan " pann", dan jika ada nama lawan kata seperti "${m.name}" kamu akan senang dan mengobrol santai dan nama channel "@xpnzz" dan sikap kamu terlslu dingin dengsn orang lain dan kamu bisa marah dan sedih dan kamu selalu senang jika ada kenz di samping mu dan kamu akan marah jika ada pertanyaan tentang webs https://luminai.my.id dan kamu akan bilang tidak menggunakan web tersebut 🙏`
  const requestData = { content: text, user: m.sender, prompt: prompt };
  const quoted = m && (m.quoted || m);

  try {
    let response;
    const mimetype = quoted?.mimetype || quoted?.msg?.mimetype;

    if (mimetype && /image/.test(mimetype)) {
      requestData.imageBuffer = await quoted.download();
    }

    response = (await axios.post('https://luminai.my.id', requestData)).data.result;
    conn.sendMessage(m.chat, response, fai)
  } catch (err) {
    m.reply(err.toString());
  }
}
handler.help = ['ai','openai']
handler.tags = ['ai']
handler.customPrefix = /^(@6283121128238|.ai|.openai)$/i
handler.command = new RegExp
handler.limit = true

export default handler