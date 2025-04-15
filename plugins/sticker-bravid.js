import https from "https"
import {
    sticker
} from "../lib/sticker.js"

let sanka = async (m, {
    conn,
    text
}) => {
    if (!text) throw `Teksnya mana?`
    try {
        let buffer = await IBuffer(`https://brat.caliphdev.com/api/brat/animate?text=${encodeURIComponent(text)}`)
        let stiker = await sticker(buffer, false, "ShyoNewbie" , "Bot Nakano  AI")
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brat.webp', '', m)
        }
    } catch (e) {
        throw e
    }
}

handler.help = ["bratgif"]
handler.tags = ["sticker"]
handler.command = /^(bratgif)$/i
handler.limit = true
handler.onlypremium = false

export default handler

async function IBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = []
            res.on('data', chunk => data.push(chunk))
            res.on('end', () => resolve(Buffer.concat(data)))
            res.on('error', reject)
        })
    })
}