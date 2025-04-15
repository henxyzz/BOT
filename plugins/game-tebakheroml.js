import fs from "fs"
let timeout = 120000
let money = 4999
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakheroml = conn.tebakheroml ? conn.tebakheroml: {}
    let id = m.chat
    if (id in conn.tebakheroml) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakheroml[id][0])
    let src = ( await fetch("https://raw.githubusercontent.com/Jabalsurya2105/database/master/games/tebakheroml.json").then(a => a.json())).result
    let json = src[Math.floor(Math.random() * src.length)]
    m.reply(`
Silahkan Tebak suara hero ini...

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}teml untuk bantuan
Bonus: ${money} MONEY
`.trim())
    conn.tebakheroml[id] = [
        await conn.sendFile(m.chat, json.audio, 'tebakheroml.mp3', "", m),
        json, money,
        setTimeout(() => {
            if (conn.tebakheroml[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}*`, conn.tebakheroml[id][0])
            delete conn.tebakheroml[id]
        }, timeout)
    ]
}
handler.help = ['tebakheroml']
handler.tags = ['game']
handler.command = /^tebakheroml$/i

handler.group = true
handler.game = true
handler.limit = 15

export default handler