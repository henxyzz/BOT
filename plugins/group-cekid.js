/* [ CEK ID GROUP SUPPORT LINK ]
* Dibuat oleh : https://whatsapp.com/channel/0029Vafqv9YCnA7wYTSDOI3F
*/

let handler = async (m, { conn, args, groupMetadata }) => {
    let linkRegex = /chat\.whatsapp\.com\/([\w\d]+)/i;
    let match = args[0] ? args[0].match(linkRegex) : null;

    if (match) {
        let code = match[1];
            let group = await conn.groupAcceptInvite(code);
            conn.reply(m.chat, `${group}`, m);
    } else {
        conn.reply(m.chat, `${groupMetadata.id}`, m);
    }
};

handler.help = ["cekid"];
handler.tags = ["group"];
handler.command = /^(cekid|idgc|gcid)$/i;

handler.group = true;

module.exports = handler;