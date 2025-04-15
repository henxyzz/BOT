/*
Jangan Hapus Wm Bang 

*Kraken Uploder & Kraken Downloader  Plugins Esm*

Untuk Upload Cuma Supp Image Kalau Down Cuma Support Video Entah lah Mungkin Gw Aja Yang Bego :v

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

Down : https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P/211

Uploader :  https://whatsapp.com/channel/0029VaAMjXT4yltWm1NBJV3J/1375
*/

import axios from 'axios';
import cheerio from 'cheerio';
import BodyForm from 'form-data';

async function krakenUpload(buffer, filename = "upload.jpg") {
  try {
    const BASEURL = 'https://krakenfiles.com';

    const { data: page } = await axios.get(BASEURL);
    const uploadUrl = page.match(/url: "([^"]+)"/)?.[1];

    const form = new BodyForm();
    form.append('files[]', buffer, {
      filename,
      contentType: 'image/jpeg',
    });

    const { data: upload } = await axios.post(uploadUrl, form, {
      headers: {
        referer: BASEURL,
        'user-agent': 'Mozilla/5.0',
        ...form.getHeaders(),
      },
    });

    const files = upload.files[0];

    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: mediaGet } = await axios.get(BASEURL + files.url, {
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
    });

    const dl = cheerio.load(mediaGet)('#link1').val();

    return {
      name: files.name,
      size: files.size,
      url: dl,
    };
  } catch (error) {
    throw `Terjadi kesalahan saat upload: ${error.message}`;
  }
}

async function krakenDownload(url) {
  if (!/krakenfiles.com/.test(url)) throw "Silakan masukkan URL dari Krakenfiles";
  
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Posify/1.0.0",
      "Referer": url,
      "Accept": "*/*",
    },
  });

  let $ = cheerio.load(data);
  let downloadUrl = $("video source").attr("src");

  if (!downloadUrl) throw "*Hanya Support Down Video*";

  return "https:" + downloadUrl;
}

let handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) throw "Gunakan format:\n- *kraken up* (upload gambar)\n- *kraken down <url>* (download video)";

    if (args[0] === "up") {
      await m.reply('[⌛] Wait Bosku🤭');

      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || '';
      if (!mime || !mime.startsWith('image/')) throw 'Silakan kirim atau reply *gambar* untuk diupload.';

      let media = await q.download();
      let result = await krakenUpload(media);


      await conn.sendMessage(m.chat, { text: result.url }, { quoted: m });

    } else if (args[0] === "down" && args[1]) {

      let videoUrl = await krakenDownload(args[1])

      await conn.sendMessage(m.chat, { video: { url: videoUrl } }, { quoted: m });
    } else {
      throw "Format salah! Gunakan:\n- *kraken up* (upload gambar)\n- *kraken down <url>* (download video)";
    }
  } catch (error) {
    await conn.sendMessage(m.chat, { text: `*Error:* ${error}` }, { quoted: m });
  }
};

handler.help = ['kraken up', 'kraken down <url>'];
handler.tags = ['tools', 'downloader']
handler.command = ['kraken'];
handler.limit = false;

export default handler;