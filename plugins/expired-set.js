let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || isNaN(args[0])) throw `Berapa Hari Sayang?`

    let who
    if (m.isGroup) who = args[1] ? args[1] : m.chat
    else who = args[1]

    var jumlahHari = 86400000 * args[0]
    var now = new Date() * 1
    if (now < global.db.data.chats[who].expired) global.db.data.chats[who].expired = jumlahHari
    else global.db.data.chats[who].expired = now + jumlahHari
    conn.reply(m.chat, `Berhasil Menetapkan Hari Kadaluarsa Untuk Grup Ini Selama ${args[0]} Hari.\n\nHitung Mundur : ${msToDate(global.db.data.chats[who].expired - now)}`, m)
}
handler.help = ['setexpired']
handler.tags = ['owner']
handler.command = /^(setexpired|addsewa)$/i
handler.rowner = true
handler.group = true

export default handler

function msToDate(ms) {
    let temp = ms
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + " Hari " + hours + " Jam " + minutes + " Menit";
    // +minutes+":"+sec;
}