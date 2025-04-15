// ch
let handler = async(m, { conn, text }) => {
if (!text) return m.reply("[❗] input text");

try {
let ch = (Object.keys(conn.chats)).filter((v) => v.endsWith("@newsletter"));
await conn.reply(ch, text, m);

m.reply("✔ Done Broadcast All Ch") 
} catch (e) {
     console.log(e);
     return m.reply(e.message);
};

};
handler.command = handler.help = ["bcgcch","jpmch"];
handler.tags = ["owner"];
handler.owner = true;

export default handler;


// *pastikan anda menggunakan baileys yg support ch*