import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
let genAI = new GoogleGenerativeAI("AIzaSyBL8zt0eSiidVE_C5o3SgyOW3drFgg9gwg");

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        if (!text) return m.reply(`Masukan prompt! \n\nContoh: \n${usedPrefix + command} apakah hari ini bakal cerah?`)
        await global.loading(m, conn)
        let q = m.quoted ? m.quoted: m
        let mime = (q.msg || q).mimetype || ''
        if (mime) {
            let download = await q.download(true)
            let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
            let image = {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(download)).toString("base64"),
                    mimeType: "image/png",
                },
            }
            let result = await model.generateContent([text, image])
            m.reply(result.response.text(), false, false, { smlcap: false })
        } else {
            let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
            let result = await model.generateContent(text)
            m.reply(result.response.text(), false, false, { smlcap: false })
        }
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['gemini']
handler.tags = ['ai']
handler.command = ['gemini', 'bard']
handler.limit = true
export default handler