let { downloadContentFromMessage } = (await import('@adiwajshing/baileys'));

let handler = async (m, { conn }) => {
    try {
        if (!m.quoted) return m.reply('where\'s message?')
        if (m.quoted.mtype !== 'viewOnceMessageV2') return m.reply('Itu Bukan Pesan ViewOnce')
        await global.loading(m, conn)
        let msg = m.quoted.message
        let type = Object.keys(msg)[0]
        let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image': 'video')
        let buffer = Buffer.from([])
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk])
        }
        if (/video/.test(type)) {
            return conn.sendFile(m.chat, buffer, 'media.mp4', msg[type].caption || '', m)
        } else if (/image/.test(type)) {
            return conn.sendFile(m.chat, buffer, 'media.jpg', msg[type].caption || '', m)
        }
    } catch (e) {
        throw e
    } finally {
        await global.loading(m, conn, true)
    }
}

handler.help = ['readviewonce']
handler.tags = ['tools']
handler.command = /^read(view(once)?)?|rvo$/i

export default handler