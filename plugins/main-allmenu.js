let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text
}) => {
    conn.reply(m.chat, `Salah Bro Hrs Nya Menu List All😂`, m);
}
handler.help = ['allmenu']
handler.tags = ['main']
handler.command = /^(allmenu)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

export default handler