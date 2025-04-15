import { LikeDown } from "../lib/scrape.js"
const regex = /https:\/\/l\.likee\.video\/v\/[A-Za-z0-9]+/i
let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        if (!text) {
            return m.reply(`Masukan Link! \n\nContoh: \n${usedPrefix + command} https://l.likee.video/v/X1taJ3`)
        }
        if (!text.match(regex)) {
            return m.reply("Itu bukan link Likee!")
        }
        await global.loading(m, conn)
        let result = await LikeDown(text)
        if (result.status !== 200) {
            return m.reply("Error :)")
        }
        await conn.sendFile(m.chat, result.no_watermark, null, result.title, m)
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ["likee"]
handler.tags = ["downloader"]
handler.command = /^(like(e)?)$/i
handler.limit = true
export default handler