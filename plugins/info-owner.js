import fs from 'fs'

let handler = async (m, { conn }) => {
	let owner = `_Cari Owner?_
*Nama Owner : DikaaOffc Dev*
*Kontak Owner : https://wa.me//6281217523837*

Silakan Pencet Link Kontak Owner Di Atas.
_Jangan Call Dan Spam Owner Yah, Terimakasih._`;
	await conn.sendMessage(m.chat, { image: { url: 'https://files.catbox.moe/vzsu7d.jpg' }, caption: owner }, m)
}
handler.help = ['owner']
handler.tags = ['owner']
handler.command = /^(owner)$/i;

export default handler;