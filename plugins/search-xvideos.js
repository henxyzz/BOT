import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('Masukkan Query Xvideos');
    }

    const apiKey = 'FanzOffc'; 
    const query = encodeURIComponent(text);
    const url = `https://api.fanzoffc.eu.org/api/xvideossearch/?query=${query}&apikey=${apiKey}`;
    
    m.reply('Tunggu sebentar, permintaan Anda sedang diproses...');

    try {
        let response = await fetch(url);
        if (!response.ok) {
            return m.reply('Gagal mengambil data dari API.');
        }

        let result = await response.json();

        if (result.status && result.data && Array.isArray(result.data)) {
            let links = result.data
                .map((v, i) => 
                    `${i + 1}. *${v.title}*\n   - Resolusi: ${v.resolution}\n   - Durasi: ${v.duration}\n   - Artis: ${v.artist}\n   - [Lihat Video](${v.link})\n`
                )
                .join('\n');

            m.reply(`Hasil pencarian untuk "${text}":\n\n${links}`);
        } else {
            m.reply('Tidak ada hasil yang ditemukan.');
        }
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat memproses permintaan.');
    }
};

handler.command = ["xvideossearch"];
handler.premium = true
handler.nsfw = true
export default handler;