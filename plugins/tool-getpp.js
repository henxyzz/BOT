import fs from "fs"
let handler = async(m) => {
    try {
        await global.loading(m, conn)
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0]: m.sender
        else who = m.sender
        let pp = await conn.profilePictureUrl(who, 'image').catch(_ => fs.readFileSync('./src/avatar_contact.png'))
        await conn.sendFile(m.chat, pp, 'profile.jpg', `@${who.split`@`[0]}`, m, null, { mentions: [who] })
    } catch (e) {
        m.reply("Tidak dapat mengambil PP")
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['getprofile']
handler.tags = ['tools']
handler.command = /^(get(pp|profile))$/i

handler.group = true
handler.limit = true
export default handler