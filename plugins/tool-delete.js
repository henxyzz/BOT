let handler = async (m, { conn, isOwner, isAdmin }) => {
	if (!m.quoted) return
	let { chat, fromMe } = m.quoted
	let charm = global.db.data.chats[m.chat]
	if (!fromMe) {
		if (isOwner || isAdmin) {
			try {
				if ((!charm.nsfw && m.isGroup) || isOwner) {
					conn.sendMessage(chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender } })
				} else {
					m.reply(`Tidak dapat hapus pesan saat *nsfw* aktif!`)
				}
			} catch (e) {
				console.log(e)
			}
		} else {
			m.reply(`*「ADMIN GROUP ONLY」*`)
		}
	} else {
		try {
			if ((!charm.nsfw && m.isGroup) || isOwner) {
				conn.sendMessage(chat, { delete: m.quoted.vM.key })
			} else {
				m.reply(`Tidak dapat hapus pesan saat *nsfw* aktif!`)
			}
		} catch (e) {
			console.log(e)
		}
	}
}

handler.menugroup = ['delete']
handler.tagsgroup = ['group']
handler.command = /^(d|delete|del)$/i

handler.group = true
handler.admin = true
export default handler