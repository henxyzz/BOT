import sharp from "sharp"
import fs from "fs"
import path from "path"
import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        let [atas, bawah] = text.split("|")
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) return m.reply(`Balas Gambar/Sticker Dengan Command ${usedPrefix + command}`)
        if (!/image\/(jpe?g|png)|opus|webp/i.test(mime)) return m.reply("Hanya Support Image Dan Sticker!")
        if (q.isAnimated) return m.reply("Not Supported!")

        await global.loading(m, conn)
        let media = await q.download()

        if (/opus|webp/.test(mime)) {
            let filename = `./tmp/${Date.now()}.jpg`
            await sharp(media).toFormat('jpeg').toFile(filename)
            let { files } = await uploadImage(fs.readFileSync(filename))
            let request = global.API('https://some-random-api.com', '/canvas/overlay/wasted', { avatar: files[0].url })
            let stiker = await sticker(false, request, global.config.stickpack, global.config.stickauth)
            await conn.sendFile(m.chat, stiker, '', '', m)
        } else {
            let { files } = await uploadImage(media)
            let request = global.API('https://some-random-api.com', '/canvas/overlay/wasted', { avatar: files[0].url })
            let stiker = await sticker(false, request, global.config.stickpack, global.config.stickauth)
            await conn.sendFile(m.chat, stiker, '', '', m)
        }
    } finally {
        await global.loading(m, conn, true)
    }
}

handler.help = ['wasted']
handler.tags = ['sticker']
handler.command = /^(wasted)$/i
export default handler