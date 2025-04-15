/*
- [ *PLUGINS OUT GC ( SELECT GC )* ]
- Description: Outgc berdasarkan nomor yang di ingin

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

let handler = async (m, { conn, usedPrefix, command, isOwner, isGroup, args }) => {
    m.react("⌛")
    const replyWithAd = async (text) => { 
        await conn.sendMessage(m.chat, { 
            text,
            contextInfo: {
                // ISI BEBAS AJA
                externalAdReply: {
                  title: `Out group`,
                  body: ``,
                  thumbnailUrl: ``,
                  sourceUrl: ``,
                  mediaType: 1,
                },
            },
        });
    }
    let groupList = await conn.groupFetchAllParticipating();
    let groups = Object.values(groupList); 
    if (groups.length === 0) {
        return m.reply('Bot tidak tergabung dalam grup mana pun.');
    }
    if (!args[0]) {
        let groupText = '*Daftar Grup yang Ditempati Bot:*\n\n';
        groups.forEach((group, index) => {
            groupText += `> ${index + 1}. ${group.subject}\n`;
        });
        groupText += `\nKetik nomor grup untuk keluar.\nContoh: *${usedPrefix + command}* 1`;
        return replyWithAd(groupText);
    }
    let groupIndex = parseInt(args[0]) - 1;
    if (isNaN(groupIndex) || groupIndex < 0 || groupIndex >= groups.length) {
        return replyWithAd('Nomor grup tidak valid.');
    }
    let selectedGroup = groups[groupIndex].id;
    await conn.groupLeave(selectedGroup);
    replyWithAd(`Berhasil keluar dari grup: ${groups[groupIndex].subject}`);
};

handler.help = ['outgc'];
handler.tags = ['owner'];
handler.command = ['outgc'];
handler.rowner = true

export default handler;