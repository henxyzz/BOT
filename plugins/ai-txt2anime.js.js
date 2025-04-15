import axios from 'axios';
import axios from 'axios';

const handler = async (m, { conn, args }) => {
  const prompt = args.join(' ');

  if (!prompt) {
    return conn.sendMessage(m.chat, { text: `Masukkan prompt!\n*EX:* .txt2anime loli` }, { quoted: m });
  }

  try {
    const res = await generateAnimeImage(prompt);
    if (!res.status) throw new Error(res.message);

    await conn.sendMessage(m.chat, {
      image: { url: res.image },
      caption: `✨ *Prompt:* ${prompt}`
    }, { quoted: m });

  } catch (error) {
    conn.sendMessage(m.chat, { text: `Error: ${error.message || 'Gagal membuat gambar.'}` }, { quoted: m });
  }
};

handler.help = ['txt2anime <prompt>'];
handler.tags = ['ai', 'nsfw'];
handler.limit = true;
handler.command = /^(txt2anime)$/i;
handler.register = true;
handler.limit = true

export default handler;
//export default handler;

async function generateAnimeImage(prompt) {
  try {
    return await new Promise(async (resolve, reject) => {
      if (!prompt) return reject("Prompt tidak boleh kosong!");

      axios.post("https://aiimagegenerator.io/api/model/predict-peach", {
        prompt,
        key: "Anime",
        width: 512,
        height: 768,
        quantity: 1,
        size: "512x768",
        nsfw: true
      }).then(res => {
        const data = res.data;
        if (data.code !== 0) return reject(data.message);
        if (!data.data?.url) return reject("Gagal mendapatkan URL gambar!");

        return resolve({
          status: true,
          image: data.data.url
        });
      }).catch(reject);
    });
  } catch (e) {
    return { status: false, message: e.message };
  }
}