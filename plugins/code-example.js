let handler = async (m, { conn }) => {
m.reply(`let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw 'halo'
    if (text.toLowerCase() === 'LI123') {
        await conn.reply(m.chat, 'Wait !!', m);
    }
    if (text.toLowerCase() === 'Y20AR') {
        await conn.reply(m.chat, 'Wait !!', m);
    }
    if (text.toLowerCase() === '630FS') {
        await conn.reply(m.chat, 'Wait !!', m);
    }
    if (text.toLowerCase() === '01DHO') {
        await conn.reply(m.chat, 'Wait !!', m);
    }
    if (text.toLowerCase() === '5AINL1') {
        await conn.reply(m.chat, 'Wait !!', m);
    }
}

handler.help = ['help'];
handler.command = ['command'];
handler.tags = ['main'];

export default handler;`)
};

handler.help = ['example2']
handler.command = /^(example2)$/i;
handler.tags = ['code'];

export default handler;