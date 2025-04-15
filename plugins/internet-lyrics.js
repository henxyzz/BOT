import axios from 'axios'
let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        if (!text) return m.reply(`Masukan lirik yang ingin kamu cari! \n\nContoh: \n${usedPrefix + command} Dandelions`)
        await global.loading(m, conn)
        let { data } = await axios.get(API('https://some-random-api.com', '/lyrics', { title: text } ))
        if (data?.error) return m.reply(data.error)
        let caption = `
Title: ${data.title}
Author: ${data.author}

Lyrics: 
${data.lyrics}
`.trim()
        await conn.adReply(m.chat, caption, `${data.title} By ${data.author}`, '', data.thumbnail.genius, data.links.genius, m)
    } catch (e) {
        m.reply(`Tidak dapat menemukan lirik *${text}*`)
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['lyrics']
handler.tags = ['internet']
handler.command = ['lyrics', 'lirik']
export default handler