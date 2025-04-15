import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `📌 Masukkan URL Instagram!\n\nContoh: ${usedPrefix + command} https://www.instagram.com/reel/DHaz8IdvuWM/`;

    try {
        m.reply('⏳ *Wait!* Sedang mendownload video...');

        const apiUrl = `https://www.velyn.biz.id/api/downloader/instagram?url=${encodeURIComponent(args[0])}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data.url.length) throw '⚠️ Gagal mengambil video!';

        const { url } = data.data;
        const { username, like, comment, caption } = data.data.metadata;

        let captionText = `📥 *Instagram Video Downloader*\n\n`;
        captionText += `👤 *Username:* @${username}\n`;
        captionText += `❤️ *Likes:* ${like}\n`;
        captionText += `💬 *Komentar:* ${comment}\n`;
        captionText += `📌 *Caption:* ${caption || 'Tidak ada caption'}\n\n`;
        captionText += `🔗 *Sumber:* ${args[0]}`;

        await conn.sendFile(m.chat, url[0], 'instagram.mp4', captionText, m);
    } catch (err) {
        console.error(err);
        throw '❌ Terjadi kesalahan saat mengunduh video!';
    }
};

handler.command = ['igdl'];
handler.tags = ['downloader'];
handler.help = ['igdl <url>'];
handler.limit = true;

export default handler;