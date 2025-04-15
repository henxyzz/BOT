let handler = async (m, {conn}) => {
let audio = {
    audio: {url: 'https://files.catbox.moe/xp3p6p.mp3'},
    mimetype: 'audio/mp4',
    ptt: true,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 1,
        mediaUrl: '',
        title: global.config.watermark,
        body: global.config.author,
        sourceUrl: '',
        thumbnail: await (await conn.getFile('https://files.catbox.moe/nw42tx.jpg')).data,
        renderLargerThumbnail: true
      }
    }
  };

  conn.sendMessage(m.chat, audio, { quoted: m })
}

handler.customPrefix = /^(assalam|aslam(ualaikum)?)/i;
handler.command = new RegExp();
export default handler