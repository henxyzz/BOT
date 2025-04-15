let handler = async (m, { conn, args, usedPrefix }) => {
    try {
        let response = args.join(' ').split('|')
        if (!args[0]) return m.reply(`Masukan text \n\nContoh: \n ${usedPrefix}meme4 Teks1|Teks2`)
        await global.loading(m, conn)
        let res = API('lol', '/api/meme2', { text1: response[0], text2: response[1] }, 'apikey')
        await conn.sendFile(m.chat, res, 'error.jpg', 'Ini Dia...', m, false)
    } catch (e) {
        throw e
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['meme4']
handler.tags = ['maker']
handler.command = /^(meme4)$/i

handler.limit = true

export default handler