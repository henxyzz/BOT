/* wm sikit😹😹
• ytmp4 by udin
•type esm
*/
import fetch from 'node-fetch';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Penggunaan: ${usedPrefix}${command} <URL YouTube>\nContoh: ${usedPrefix}${command} https://www.youtube.com/watch?v=example`;

    try {
        const { data } = await axios.get(`https://ytdl-api.caliphdev.com/download/video?url=${encodeURIComponent(text)}`);
        
        if (!data?.status) throw 'Gagal mengunduh video. Pastikan URL yang dimasukkan valid.';

        const {
            videoDetails: { title, cover, lengthSeconds },
            downloadUrl
        } = data;

        if (!downloadUrl) throw 'Link download tidak ditemukan.';

        const caption = `
🎬 *YouTube MP4 Downloader* 🎬
    
📌 *Judul*  : ${title || 'Tidak tersedia'}
⏳ *Durasi* : ${lengthSeconds ? `${lengthSeconds} detik` : 'Tidak tersedia'}
📥 *Mengunduh video...*
`;

        await conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: title || 'Judul tidak tersedia',
                    body: 'Mengunduh video...',
                    thumbnailUrl: cover || '',
                },
            },
        });

        const videoBuffer = await fetch(downloadUrl).then(res => res.buffer());
        await conn.sendMessage(m.chat, { video: videoBuffer, mimetype: 'video/mp4', fileName: `${title}.mp4` }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply(' Terjadi kesalahan saat mengunduh video. Silakan coba lagi nanti.');
    }
};

handler.help = ['ytmp4'].map(v => v + ' <URL YouTube>');
handler.tags = ['downloader'];
handler.command = /^(ytmp4|ytvideo)$/i;

export default handler;