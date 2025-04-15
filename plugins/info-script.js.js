import fs from 'fs'

let handler = async (m, { conn }) => {
	let pfft = " ```🚩 Jika Ingin Membeli Ketik Owner Saja || https://wa.me//6281217523837``` ";
conn.sendMessage(m.chat, {
      text: pfft,
      contextInfo: {
      externalAdReply: {
      title: `The Script In For Sale📥`,
      body: '[❗] Script Ini Tidak Gratis',
      thumbnailUrl: `https://files.catbox.moe/s0ulcy.png`,
      sourceUrl: `https://whatsapp.com/channel/0029VbAWMXH9MF96XXhayf08`,
      mediaType: 1,
      renderLargerThumbnail: true
      }}})
}
handler.command = /^(sc|script)$/i;

export default handler;