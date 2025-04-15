import axios from 'axios'
import { stalkff } from '../lib/scrape.js'
let handler = async (m, { conn, text }) => {
if (!text) throw 'Input your ID?'
let result = await stalkff(text)
m.reply(`*/ STALKING FREE FIRE \\*

Nama: ${result.nickname}
ID: ${text}`)
}
handler.help = ['stalkff'].map(v => v + ' <id>')
handler.tags = ['stalker']
handler.command = /^(stalkff|epep|idfreefire|idff)$/i
handler.limit = true
export default handler