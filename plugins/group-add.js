//*<>ADD, SUPPORT INVITE KETIKA DI PRIVATE!!<>*
//SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
//DON'T DELETE THIS WM!
//HAPUS WM MANDUL 7 TURUNAN 
//HAPUS WM=SDM RENDAH  
//`BAGI YANG RECODE DAN YANG MENYESUAIKAN LAGI NI CODE, MOHON UNTUK JANGAN DIHAPUS WM PERTAMA, ATAU BERI CREDIT LINK CH YANG SHARE CODE INI!`
//"aku janji tidak akan hapus wm ini, karena amanah ini harus saya pegang!"
//SENIN, 10 FEBRUARI 2025 21:57
const {
    getBinaryNodeChild,
    getBinaryNodeChildren,
    generateWAMessageFromContent,
    proto
} = (await import('@whiskeysockets/baileys')).default;

const handler = async (m, { conn, text, participants, usedPrefix, command }) => {
    if (!text && !m.quoted) {
        return m.reply(`reply pengguna/masukkan nomor,contoh:\n${usedPrefix + command} +628 xxx xxx`);
    }

    let link = await conn.groupInviteCode(m.chat).catch(() => null);
    if (!link) return m.reply("⚠️ Error: Tidak bisa mendapatkan kode undangan grup.");

    let metadata = await conn.groupMetadata(m.chat).catch(() => null);
    if (!metadata) return m.reply("⚠️ Error: Gagal mendapatkan informasi grup.");
    
    let groupName = metadata.subject;
    let existingParticipants = metadata.participants.map(user => user.id);
    let inputNumbers = [];

    if (m.quoted) {
        inputNumbers.push(m.quoted.sender.split('@')[0]);
    }

    if (text) {
        inputNumbers = inputNumbers.concat(
            text.split(',')
                .map(v => v.replace(/[^0-9]/g, ''))
                .filter(v => v.length > 4 && v.length < 20)
        );
    }

    inputNumbers = [...new Set(inputNumbers)];
//https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    for (const number of inputNumbers) {
        const jid = `${number}@s.whatsapp.net`;

        if (existingParticipants.includes(jid)) {
            await m.reply(`⚠️ Pengguna tersebut sudah menjadi anggota grup ini @${number}`);
            continue;
        }

        const exists = await conn.onWhatsApp(jid);
        if (!exists[0]?.exists) {
            await m.reply(`⚠️ Pengguna @${number} tidak terdaftar di WhatsApp`);
            continue;
        }

        try {
            const response = await conn.query({
                tag: 'iq',
                attrs: {
                    type: 'set',
                    xmlns: 'w:g2',
                    to: m.chat,
                },
                content: [{
                    tag: 'add',
                    attrs: {},
                    content: [{
                        tag: 'participant',
                        attrs: { jid },
                    }],
                }],
            });

            const participant = getBinaryNodeChildren(response, 'add');
            const user = participant[0]?.content.find(item => item.attrs.jid === jid);

            if (user?.attrs.error === '421') {
                m.reply("⚠️ Tidak dapat menambahkan pengguna tersebut. Mereka telah membatasi undangan ke grup.");
                continue;
            }

            if (user?.attrs.error === '408') {
                await m.reply(`✅ Undangan grup berhasil dikirim ke @${number} karena pengguna baru saja keluar dari grup.`);
                await conn.sendMessage(
                    jid, {
                        text: `✨ Anda diundang kembali ke grup ini:\nhttps://chat.whatsapp.com/${link}`,
                        contextInfo: {
                            externalAdReply: {
                                title: groupName,
                                body: null,
                                thumbnailUrl: await conn.profilePictureUrl(m.chat, 'image').catch(() => null),
                                sourceUrl: `https://chat.whatsapp.com/${link}`,
                                mediaType: 1,
                                renderLargerThumbnail: false,
                            },
                        },
                    }, { quoted: null }
                );
                continue;
            }

            if (user?.attrs.error === '403') {
                await m.reply(`Mengirim tautan ke @${number}.`);
                const content = getBinaryNodeChild(user, 'add_request');
                const { code, expiration } = content.attrs;
                const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => null);
                const jpegThumbnail = pp ? await fetch(pp).then(res => res.buffer()) : Buffer.alloc(0);

                const msgs = generateWAMessageFromContent(
                    m.chat,
                    proto.Message.fromObject({
                        groupInviteMessage: {
                            groupJid: m.chat,
                            inviteCode: code,
                            inviteExpiration: parseInt(expiration),
                            groupName: groupName,
                            jpegThumbnail: jpegThumbnail,
                            caption: "Undangan untuk bergabung ke grup WhatsApp saya",
                        },
                    }), {
                        userJid: conn.user.id,
                    }
                );
//hapus?=mandul https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
                await conn.sendMessage(jid, {
                    forward: msgs,
                    mentions: [jid]
                });
            }
        } catch (err) {
            console.error(err);
            await m.reply(`Error occurred while adding @${number}: ${err.message}`);
        }
    }
};

handler.help = ['add', '+'].map(v => v + ' nomor')
handler.tags = ['group']
handler.command = /^(add|menambahkan|\+)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null
export default handler
//*<>ADD, SUPPORT INVITE KETIKA DI PRIVATE!!<>*
//SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
//DON'T DELETE THIS WM!
//HAPUS WM MANDUL 7 TURUNAN 
//HAPUS WM=SDM RENDAH  
//`BAGI YANG RECODE DAN YANG MENYESUAIKAN LAGI NI CODE, MOHON UNTUK JANGAN DIHAPUS WM PERTAMA, ATAU BERI CREDIT LINK CH YANG SHARE CODE INI!`
//"aku janji tidak akan hapus wm ini, karena amanah ini harus saya pegang!"
//SENIN, 10 FEBRUARI 2025 21:57