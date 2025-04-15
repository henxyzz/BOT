/*
Jangan Hapus Wm Bang 

*Spotify Download  Plugins Esm*

Yuk Rame In. https://chat.whatsapp.com/GjovEmWPnfRInOvrQztMLX :v

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VaDMn8D3mFYDKDGIFW2J/543
*/

import fetch from 'node-fetch';

async function spotiDown(spotiUrl) {
  try {
    const urlOne = await fetch(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(spotiUrl)}`);
    const one = await urlOne.json();

    if (one.result) {
      const { id, type, name, image, artists, gid } = one.result;
      const urlTwo = await fetch(`https://api.fabdl.com/spotify/mp3-convert-task/${gid}/${id}`);
      const two = await urlTwo.json();

      if (two.result) {
        return {
          id: id,
          title: name,
          creator: artists,
          type: type,
          cover: image,
          urlDown: `https://api.fabdl.com${two.result.download_url}`
        };
      } else {
        throw new Error('Gagal mendapatkan URL musik');
      }
    } else {
      throw new Error('Gagal menemukan informasi musik');
    }
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

const handler = async (m, { conn, args }) => {
  try {
  
    if (!args[0]) {
      throw 'Masukkan URL Spotify yang valid!\nContoh: .spotify https://open.spotify.com/track/3zakx7RAwdkUQlOoQ7SJRt';
    }

    const result = await spotiDown(args[0]);
    const message = `
*°${result.title}*\n
*Artis:* ${result.creator}
*Type:* ${result.type}
    `;

    await conn.sendMessage(m.chat, { 
      image: { url: result.cover }, 
      caption: message 
    }, { quoted: m });

    await conn.sendMessage(m.chat, { 
      audio: { url: result.urlDown }, 
      mimetype: 'audio/mp4', 
      ptt: false 
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: `${error.message || error}` }, { quoted: m });
  }
};

handler.help = ['spotify <url>'];
handler.command = ['spotify', 'spdl'];
handler.limit = false;

export default handler;