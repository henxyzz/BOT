import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, 'Masukkan Link Xnxx', m);

  let url = args[0]; 
  let apikey = 'FanzOffc'; 
  
  m.reply('Tunggu sebentar, permintaan Anda sedang diproses...');
  
  try {
    let res = await fetch(`https://api.fanzoffc.eu.org/api/xnxxdl/xvideosdl/?url=${url}&apikey=${apikey}`);
    
    if (!res.ok) {
      return conn.reply(m.chat, 'Terjadi kesalahan saat mengambil data dari API.', m);
    }

    let json = await res.json();

    if (!json.status) {
      return conn.reply(m.chat, 'Gagal mengambil data dari API.', m);
    }

    let { title, URL, duration, image, info, files } = json.data;

    let message = `
    *Judul :* ${title}
    *Info :* ${info}`;

    let videoUrl = files.high;

    let videoRes = await fetch(videoUrl);
    if (!videoRes.ok) {
      return conn.reply(m.chat, 'Gagal mengunduh video.', m);
    }

    const buffer = await videoRes.buffer();
    await conn.sendMessage(m.chat, { video: buffer, caption: message }, { quoted: m });

  } catch (error) {
    console.error(error);
    return conn.reply(m.chat, 'Terjadi kesalahan saat memproses permintaan Anda.', m);
  }
};

handler.command = ["xnxxdl", "xvideosdl"];
handler.premium = true
handler.nsfw = true
export default handler;