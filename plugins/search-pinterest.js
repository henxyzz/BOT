import { pinterest } from '../lib/scrape.js'

let handler = async (m, { conn, command, usedPrefix, text }) => {
    try {
        let isHentai = isHent.exec(text)
        let ephemeral = conn.chats[m.chat]?.metadata?.ephemeralDuration || conn.chats[m.chat]?.ephemeralDuration || false

        if (!text) {
            return m.reply(`Masukan Query! \n\nContoh : \n${usedPrefix + command} Hu Tao`)
        }
        if (isHentai) {
            return m.reply('Jangan Mencari Hal Aneh!, Ketahuan Owner Bakal Di Banned')
        }
        await global.loading(m, conn)
        let result = await pinterest(text)
        let { data, mime } = await conn.getFile(result)
        if (/image/i.test(mime)) {
            await conn.sendFile(m.chat, data, false, '', m)
        } else {
            await conn.sendMessage(m.chat, { video: data, fileName: Date.now() + ".mp4", mimetype: "video/mp4" }, { quoted: m, ephemeralExpiration: ephemeral })
        }
    } catch (e) {
        console.error(e)
        m.reply(`Tidak dapat menemukan *${text}*`)
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['pinterest']
handler.tags = ['search']
handler.command = /^(pin(terest)?)$/i
handler.limit = true
export default handler

let isHent = /vicidior|kimi|babat|ceker|toket|tobrut|sepon(g|k)?|desah|xnxx|khalifah|sexy|bikini|bugil|r34|xx(x)?|sex|porno|tete|payudara|penis|montok|ngocok|oppai|naked|bikini|sex(y|i)|boha(y|i)|tetek|titi(t)?|hent(ai|ao)?|animeh|puss(y|i)|dick|xnxx|kontol|colmek|coli|cum|hot|meme(k|g)|neocoil(l)?|yamete|kimochi|boke(p)?|nsfw|rule34|telanjang|crot|peju/i