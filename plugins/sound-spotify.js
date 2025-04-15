import { SpotifyAPI } from '../lib/spotify.js';
import axios from 'axios'
const {
    generateWAMessageFromContent,
    proto,
    prepareWAMessageMedia
} = (await import("@adiwajshing/baileys")).default

let handler = async (m, { conn, text, usedPrefix, command, isPrems }) => {
    try {
        if (!text) return m.reply(`Masukan judul lagu atau link spotify! \n\nContoh : \n${usedPrefix + command} rewrite the star \n${usedPrefix + command} https://open.spotify.com/track/65fpYBrI8o2cfrwf2US4gq`)
        await global.loading(m, conn)
        if (/http(s)?:\/\/open.spotify.com\/track\/[-a-zA-Z0-9]/i.test(text)) {
            let input = text.replace('https://', '').split('/')[2]
            let spotify = await SpotifyAPI()
            let { popularity, id, duration_ms, name, artists, album } = await spotify.getTracks(input)
            let caption = `
_*${name}*_

Artist : ${artists[0].name}
Duration : ${convertMsToMinSec(duration_ms)}
Popularity : ${popularity}
Id : ${id}

Album Info :
• Name : ${album.name}
• Release : ${album.release_date}
• Id : ${album.id}
`.trim()
            let chat = await conn.sendFile(m.chat, 'https://external-content.duckduckgo.com/iu/?u=' + album.images[0].url, false, caption, m, false, false, { smlcap: true, except: [id, album.id] })
            let audio = await spotifydl(text)
            await conn.sendFile(m.chat, audio.download, null, null, chat, { mimetype: "audio/mpeg" });
        } else {
            let spotify = await SpotifyAPI()
            let { tracks } = await spotify.trackSearch(text)
            let list = tracks.items.map((v, i) => {
                return [`${usedPrefix + command} ${v.external_urls.spotify}`, (i + 1).toString(), `${v.name} \nArtist By ${v.artists[0].name}`]
            })
            await conn.textList(m.chat, `Terdapat *${tracks.items.length} Hasil* \nSilahkan pilih lagu yang kamu mau!`, false, list, m, {
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: false,
                        mediaType: 1,
                        title: tracks.items[0].name,
                        body: `Artist By ${tracks.items[0].artists[0].name}`,
                        thumbnail: (await conn.getFile("https://external-content.duckduckgo.com/iu/?u=" + tracks.items[0].album.images[0].url)).data,
                        renderLargerThumbnail: true,
                        mediaUrl: tracks.items[0].external_urls.spotify,
                        sourceUrl: tracks.items[0].external_urls.spotify
                    }
                }
            })
        }
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['spotify']
handler.tags = ['sound', 'premium']
handler.command = /^spotify$/i
handler.onlyprem = true
handler.premium = true
export default handler;

function convertMsToMinSec(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

async function spotifydl(url) {
    try {
        const Response = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`, {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"24\", \"Chromium\";v=\"116\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                Referer: "https://spotifydownload.org/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
        });

        const response = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${Response.data.result.gid}/${Response.data.result.id}`, {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"24\", \"Chromium\";v=\"116\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                Referer: "https://spotifydownload.org/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
        });

        const result = {
            title: Response.data.result.name,
            type: Response.data.result.type,
            artis: Response.data.result.artists,
            durasi: Response.data.result.duration_ms,
            image: Response.data.result.image,
            download: `https://api.fabdl.com${response.data.result.download_url}`
        };

        return result;
    } catch (error) {
        throw error; 
    }
}

async function sendButton(jid, row = [], quoted = '', opts ={}) {
        const isImage = /image/.test(opts.type) ? "image" : false;
	const isVideo = /video/.test(opts.type) ? "video" : false;
	const isMedia = isImage || isVideo
        let header = opts.thumb ? (await prepareWAMessageMedia({ ...(isMedia && { [isMedia]: {url: opts.thumbnailUrl ? opts.thumbnailUrl : media.thumbnail } }), }, { upload: conn.waUploadToServer })) : false
        
	let msg = generateWAMessageFromContent(jid, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: opts.content ? opts.content : ''
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: opts.wm ? opts.wm : ''
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false,
            ...opts.thumb ? header : ''
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              ...row
              ],
          }),
        })
    }
  }
}, {quoted, userJid: quoted})
conn.relayMessage(jid, msg.message, {
  messageId: msg.key.id,
})
}