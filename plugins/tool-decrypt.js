import { webcrack } from 'webcrack'
import fs from 'fs'

let handler = async (m, { usedPrefix, text, args, command }) => {
 try {
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})
  m.reply('Anda Menghabiskan 10 Limit Buat Fitur Dari Kang Rafi Hacker Ini')
const usage = `Kalo Kek Gitu Salah Tolol:
${prefix + command} (Masukin Teksnya Kontol, Yang Bakal Gw Bobol )
${prefix + command} doc (Reply Code Javascript Yang Berbentuk Document)`;

if (args.length >= 1) {
text = args.join(" ");
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text;
} else {
return m.reply(usage);
}

try {
let message;
if (text === 'doc' && m.quoted && m.quoted.mtype === 'documentMessage') {
let docBuffer;
if (m.quoted.mimetype) {
docBuffer = await m.quoted.download();
}
message = await webcrack(docBuffer.toString('utf-8'));
} else {
message = await webcrack(text);
}

const filePath = './tmp/Decrypt_by_Rafi_Hacker.js';
fs.writeFileSync(filePath, message.code);

await conn.sendMessage(m.chat, {
document: {
url: filePath
},
mimetype: 'application/javascript',
fileName: 'Decrypt_by_Rafi_Hacker.js'
}, {quoted: m});

} catch (error) {
const errorMessage = `There is an error: ${error.message}`;
await m.reply(errorMessage);
}
} finally {
 conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})}
}
handler.help = ['decrypt']
handler.tags = ['tools']
handler.command = /^(decrypt|dec)$/i
handler.limit = 10
handler.owner = true
export default handler