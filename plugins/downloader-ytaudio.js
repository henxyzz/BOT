/*
- Fitur: Ytmp3 
- Type: Plugins ( esm )
- By:HamzDxD

Thanks Kepada Penyedia Api 
> Vreden
*/

import fetch from 'node-fetch';

const handler = async (m, { conn, command, text }) => {
  if (!text) throw `Gunakan: ${command} <URL>`;

  await conn.sendMessage(m.chat, { react: { text: '♻️', key: m.key } });

  try {
    const api = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(text)}`;
    const response = await fetch(api);
    const data = await response.json();
    
    if (!data.result || !data.result.download.url) throw 'Gagal mendapatkan audio. Coba lagi!';

    const { metadata, download } = data.result;
    const { title, duration, views, author, thumbnail } = metadata;
    const audioUrl = download.url;
 await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title,
          body: `Durasi: ${duration.timestamp} | Views: ${views.toLocaleString()}`,
          thumbnailUrl: thumbnail,
          renderLargerThumbnail: true,
          mediaType: 1,
          mediaUrl: text,
          sourceUrl: text
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    throw 'Coba Lagi Nanti!';
  }
};

handler.help = ['ytmp3 <URL>'];
handler.tags = ['downloader'];
handler.command = /^(ytmp3|yta|ytaudio)$/i;

export default handler