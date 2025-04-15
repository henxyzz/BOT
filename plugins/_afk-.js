let handler = async (m, { text }) => {
    let user = global.db.data.users[m.sender]
    const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg")
    user.afk = +new Date()
    user.afkReason = text
    let k = `➠ ${conn.getName(m.sender)} AFK Dengan Alasan ${text ? ': ' + text : ''}`
    conn.sendMessage(m.chat, {
        text: k,
        contextInfo: {
        mentionedJid: conn.parseMention(k),
        groupMentions: [],
        forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    "newsletterJid": "120363399767711649@newsletter",
                    "serverMessageId": 103,
                    "newsletterName":  `⌜ 🛑 Maichan AI⌟`},
            externalAdReply: {
                title: 'M U L A I  A F K',
                body: `❲ ${conn.getName(m.sender)} ❳`,
                showAdAttribution: true,
                mediaType: 1,
                sourceUrl: 'https://whatsapp.com/channel/0029VbAWMXH9MF96XXhayf08'',
                thumbnailUrl: pp,
                renderLargerThumbnail: false,
            }
        }
    })
}

handler.help = ['afk']
handler.tags = ['main']
handler.command = /^afk$/i
handler.group = true

export default handler