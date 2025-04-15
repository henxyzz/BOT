*/ 
      🌸Don't Delete My Credits
* Plugins PlayDL
* TypeEsm 
* Saluran Infomarsi : 
https://whatsapp.com/channel/0029VavBc6uHAdNdbgCgOK0k

/*

import yts from 'yt-search';

let handler = async (m, {conn, text}) => {
if (!text) throw 'Masukkan judul'

let src = await yts(text)
let yt = src.videos[0]

await conn.sendMessage(m.chat, {image:{url:yt.thumbnail}, caption: yt.title}, {quoted:m})
return conn.sendMessage(m.chat, {
audio: {
    url: `https://kepolu-ytdl.hf.space/yt/dl?url=${yt.url}&type=audio`
},
mimetype: 'audio/mpeg',
contextInfo: {
externalAdReply: {
title: yt.title,
body: 'Audio Play',
mediaType: 2,
mediaUrl: yt.url,
thumbnailUrl: yt.thumbnail,
sourceUrl: yt.url,
containsAutoReply: true,
renderLargerThumbnail: true,
showAdAttribution: false,
}}}, { quoted: m})
    
}

handler.help = ['play']
 handler.command = ['play']
handler.tags = ['downloader']
export default handler