let handler = async m => m

handler.before = async m => {
    let user = global.db.data.users[m.sender]
    const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg")

if (!m.isGroup) return false
  if (user.afk > -1) {
    let f = `
➠ Masih hidup ternyata wkwk\nKamu Berhenti AFK${user.afkReason ? ' Setelah ' + user.afkReason : ''}
➠ Selama ${(new Date - user.afk).toTimeString()}
`
conn.sendMessage(m.chat, {
text: f,
contextInfo: {
mentionedJid: conn.parseMention(f),
groupMentions: [],
forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    "newsletterJid": "120363399767711649@newsletter",
                    "serverMessageId": 103,
                    "newsletterName":  `⌜ 🛑 Maichan AI⌟`},
externalAdReply: {
title: 'A F K  S T O P',
body: `❲ ${conn.getName(m.sender)} ❳`,
showAdAttribution: true,
mediaType: 1,
sourceUrl: '',
thumbnailUrl: pp,
renderLargerThumbnail: false
}}
}, {quoted: m})
    user.afk = -1
    user.afkReason = ''
  }
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let user = global.db.data.users[jid]
    if (!user) continue
    let afkTime = user.afk
    if (!afkTime || afkTime < 0) continue
    let reason = user.afkReason || ''
    let pp2 = await conn.profilePictureUrl(jid, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg")
    let z = `
➠ Jangan Tag Dia Kak!
Dia Sedang AFK ${reason ? 'Dengan Alasan ' + reason : 'Tanpa Alasan'}
➠ Selama ${(new Date - afkTime).toTimeString()}
`
conn.sendMessage(m.chat, {
text: z,
contextInfo: {
mentionedJid: conn.parseMention(z),
groupMentions: [],
forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    "newsletterJid": "120363399767711649@newsletter",
                    "serverMessageId": 103,
                    "newsletterName":  `⌜ 🛑 Maichan AI⌟`},
externalAdReply: {
title: 'S E D A N G  A F K',
body: `❲ ${conn.getName(jid)} ❳`,
showAdAttribution: true,
mediaType: 1,
sourceUrl: 'https://whatsapp.com/channel/0029VbAWMXH9MF96XXhayf08',
thumbnailUrl: pp2,
renderLargerThumbnail: false
}}
}, {quoted: m})
  }
  return true
}

export default handler