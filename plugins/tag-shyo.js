import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn }) => { 
let stiker = await sticker(null, global.API(`https://telegra.ph/file/8ac46a72f7e06beb88332.jpg`), global.packname, global.author)
    if (stiker) return await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
}
handler.customPrefix = /^(@6282176642989)$/i
handler.command = new RegExp
export default handler