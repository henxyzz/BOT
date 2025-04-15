import { processing } from '../lib/scrape.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted: m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) return m.reply('Fotonya Mana? Reply gambar atau upload')
        if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Tipe ${mime} tidak didukung!`)
        await global.loading(m, conn)
        let img = await q.download()
        let image = await processing(img, 'enhance')
        await conn.sendFile(m.chat, image, '', '', m)
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['unblur', 'remini']
handler.tags = ['ai']
handler.command = /^(remini|unblur)$/i
handler.limit = true
export default handler