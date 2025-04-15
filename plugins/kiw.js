let handler = async (m, { conn, text }) => {
if(!text) throw ('ketik haii atau woww')
if (text.toLowerCase === 'hai') {
m.reply('haii')
}
if (text.toLowerCase === 'wow') {
m.reply('woww')
}
};

handler.help = ['help']
handler.command = /^(kiw)$/i;
handler.tags = ['tag'];

export default handler;