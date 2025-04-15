import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function uploadVideo(filePath) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const response = await axios.post('https://videy.co/api/upload', formData, {
            headers: { ...formData.getHeaders() }
        });

        return response.data;
    } catch (error) {
        throw new Error('Gagal mengunggah video');
    }
}

const handler = async (m, { conn }) => {
    try {
        await m.reply('⌛Waiting For Minute');

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        if (!mime.startsWith('video/')) {
            throw 'Silakan kirim video dengan caption *videy-up* atau reply video!';
        }

        let media = await q.download();
        if (!media) throw 'Gagal mengunduh video.';

        const filePath = './temp_video.mp4';
        await fs.promises.writeFile(filePath, media);

        let result = await uploadVideo(filePath);
        await fs.promises.unlink(filePath);

        await m.reply('✅Done Nih Bokep Videy');
        await conn.reply(m.chat, `*Video Berhasil Diunggah*\n\n*Video ID :* ${result.id}\n\n *Link :* https://videy.co/v?id=${result.id}`, m);

    } catch (error) {
        await m.reply('❌Error Banh');
        await conn.reply(m.chat, `*Error:* ${error.message || error}`, m);
    }
};

handler.help = ['videy-up'];
handler.tags = ['tools'];
handler.command = /^videy-up$/i;

export default handler;