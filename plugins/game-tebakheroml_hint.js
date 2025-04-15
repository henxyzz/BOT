let handler = async (m, { conn }) => {
    conn.tebakheroml = conn.tebakheroml ? conn.tebakheroml : {}
    let id = m.chat
    if (!(id in conn.tebakheroml)) throw false
    let json = conn.tebakheroml[id][1]
    m.reply('Clue : ' + '```' + json.name.replace(/[AIUEOaiueo]/ig, '_') + '```' + '\n\n_*Jangan Balas Chat Ini Tapi Balas Soalnya*_')
}
handler.command = /^teml$/i
handler.limit = true
export default handler