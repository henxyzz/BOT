let handler = m => m

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (isAdmin || !m.isGroup) return

    if (m.message?.groupStatusMentionMessage) {
        await conn.reply(m.chat, `Jangan tag sw tolol kimak puqi idiot, mati aja sono`, m)
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        await conn.sendMessage(m.chat, { delete: m.key })
    }
    return true
}

export default handler