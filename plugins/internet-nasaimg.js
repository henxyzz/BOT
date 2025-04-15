/*
- [ *PLUGINS NASA IMAGE* ]
- Description: Get random image from nasa + desc

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    let randomDate = new Date(startDate.getTime() + Math.random() * (new Date().getTime() - startDate.getTime()));
    let formattedDate = randomDate.toISOString().split('T')[0];

    let res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=VxxFjtUSju0FF6y9MZtBdEbOg6FeysaE69xoW3Rn&date=${formattedDate}`); 

    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    
    m.react("⌛");
    
    let result = await res.json();

    let caption = `
*Berikut adalah hasil gambar yang di ambil oleh NASA* 🔭

> Judul: ${result.title}
> Tanggal: ${result.date}

${result.explanation}

*${result.hdurl}*
`.trim();

    await conn.sendMessage(m.chat, { image: { url: result.hdurl }, caption: caption }, { quoted: m })

  } catch (error) {
    console.error(error);
    m.reply(`Maaf, terjadi kesalahan saat mengambil gambar. Silakan coba lagi nanti.`);
  }
}

handler.help = ['nasaimg']
handler.tags = ['internet']
handler.command = /^(nasaimg)$/i

handler.register = true
handler.premium = false
handler.limit = true

export default handler