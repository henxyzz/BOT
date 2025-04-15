const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const https = require('https');

async function uploadToCDN(media, expirationTime = 0) {
    let formData = new FormData();
    formData.append('file', fs.createReadStream(media));
    formData.append('expirationOption', expirationTime > 0 ? 'custom' : 'permanent');
    formData.append('expiration', expirationTime);

    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'Nauval.mycdn.biz.id',
            port: 443,
            path: '/upload',
            method: 'POST',
            headers: formData.getHeaders(),
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    let json = JSON.parse(data);
                    if (json.status === 'success' && json.url) {
                        resolve(json.url);
                    } else {
                        reject(new Error('Upload gagal atau response tidak valid.'));
                    }
                } catch (err) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', (e) => reject(e));
        formData.pipe(req);
    });
}

let handler = async (m, { conn, text, pulsar }) => {
    try {
        let url = text?.trim();
        let img;

        if (!url) {
            let q = m.quoted ? m.quoted : m;
            let mime = (q.msg || q).mimetype || '';

            if (!mime) return m.reply('Fotonya mana? Reply gambar atau upload.');
            if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Tipe ${mime} tidak didukung! Gunakan JPG atau PNG.`);

            await pulsar.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });
            await m.reply('_Sedang memproses..._');

            try {
                img = await q.download();
                if (!img) throw new Error('Gagal mengunduh gambar.');
                let filePath = './temp_image.jpg';
                fs.writeFileSync(filePath, img);
                url = await uploadToCDN(filePath);
                fs.unlinkSync(filePath);
            } catch (error) {
                return m.reply(`Terjadi kesalahan saat mengunggah gambar: ${error.message}`);
            }
        }

        let imageBuffer = await upscale(url);
        if (!imageBuffer) {
            return m.reply('Gagal memperbesar gambar.');
        }

        let cap = 'Berikut hasil gambar HD-mu!';
        await pulsar.sendMessage(m.chat, { image: imageBuffer, caption: cap }, { quoted: m });
        await pulsar.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error('Error:', e);
        m.reply('Terjadi kesalahan dalam proses.');
    }
};

handler.command = ['hd2'];
handler.tags = ['tools'];
handler.help = ['hd2 (reply gambar atau kirim link)'];

module.exports = handler;

async function upscale(url) {
    try {
        console.log(`Mengirim permintaan ke API dengan URL: ${url}`);

        const api = `https://www.velyn.biz.id/api/tools/remini?url=${encodeURIComponent(url)}`;
        const response = await axios.get(api, { responseType: 'arraybuffer' });

        console.log(`Response status: ${response.status}`);

        if (response.status !== 200) {
            throw new Error(`Upscale gagal dengan status ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error saat upscaling gambar:', error);
        return null;
    }
}