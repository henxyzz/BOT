import ytdl from '@distube/ytdl-core'
import { toAudio } from '../../lib/converter.js'
import fs from 'fs'
import sharp from "sharp"

let regex = /https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(\?[\w=&-]+)?|https:\/\/(?:www\.)?youtube\.com\/(?:shorts|watch)\/[a-zA-Z0-9_-]+(?:\?si=[a-zA-Z0-9_-]+)?/i

let handler = async (m, { conn, args, command, usedPrefix }) => {
    try {
        if (!conn.youtube) conn.youtube = {}
        if (!args[0]) return m.reply(`Masukan Link Youtube!\n\nContoh :\n${usedPrefix + command} https://youtu.be/Wky7Gz_5CZs`)
        let isLink = args[0].match(regex)
        if (!isLink) return m.reply("Itu bukan link youtube!")
        if (typeof conn.youtube[m.sender] !== "undefined") return m.reply("Kamu masih download!")
        await conn.loading(m, conn)
        conn.youtube[m.sender] = "loading"
        let agent = ytdl.createAgent(cookies)
        let { videoDetails } = await ytdl.getInfo(args[0], { agent })
        let caption = `
*Youtube Audio Downloader*

❏ Title : ${videoDetails.title}
❏ View : ${toRupiah(videoDetails.viewCount)}
❏ Category : ${videoDetails.category}
❏ Author : ${videoDetails.ownerChannelName}
`.trim()
        let thumbnail = (await conn.getFile(videoDetails.thumbnails.reverse()[0].url)).data
        let filename = "./tmp/" + Date.now() + ".jpg"
        await sharp(thumbnail).toFormat('jpeg').toFile(filename)
        
        let chat = await conn.adReply(m.chat, caption, videoDetails.title, null, filename, args[0], m)
        let audio = await getAudio(args[0])
        let sizeMB = audio.byteLength / (1024 * 1024)
        if (sizeMB > 50000) return m.reply("Size audio terlalu besar!")
        await conn.sendFile(m.chat, audio.data, null, null, chat, false, { mimetype: "audio/mpeg" })
    } finally {
        await conn.loading(m, conn, true)
        delete conn.youtube[m.sender]
    }
}
handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.command = /^(yt(mp3|audio)|youtube(mp3|audio))$/i
handler.limit = true
export default handler

async function getAudio(url) {
    let randomName = new Date() * 1 + '.mp4'
    let agent = ytdl.createAgent(cookies)
    let stream = ytdl(url, {
        filter: (info) => (info.itag == 22 || info.itag == 18),
        agent
    }).pipe(fs.createWriteStream(`./tmp/${randomName}`))
    await new Promise((resolve, reject) => {
        stream.on('error', reject)
        stream.on('finish', resolve)
    })
    let audio = await toAudio(fs.readFileSync("./tmp/" + randomName), 'mp4')
    return audio
}

let getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

let toRupiah = number => parseInt(number).toLocaleString().replace(/,/g, ".")

const cookies = [
  { name: "__Secure-1PAPISID", value: "Zu2p9n9nyYorUEJK/AOBH4VHCZTzadN9SG" },
  { name: "__Secure-1PSID", value: "g.a000swixZeey1nn8oNomZF2fssqCAaE--6Me_7pPzslBog2drHEsLdecO-zeEpzoE-yyfCk4dgACgYKAQcSARQSFQHGX2Mi1MqASXpFt5nVy9HyGTiC8xoVAUF8yKpw6RMEseFUoaawIPoZthwq0076" },
  { name: "__Secure-1PSIDCC", value: "AKEyXzWsHM-vIlTlZ34ZJD7Fs7GPgKEeU1kMv6jsVhbFzzaf99c9svisdSUBgugbb6U8Z26u" },
  { name: "__Secure-1PSIDTS", value: "sidts-CjIBmiPuTWM6FhLCEVDUOmO2S26kyfSguhRhzXepmK-ulpd8cm5144ERmrgU12uWrJwvQxAA" },
  { name: "__Secure-3PAPISID", value: "Zu2p9n9nyYorUEJK/AOBH4VHCZTzadN9SG" },
  { name: "__Secure-3PSID", value: "g.a000swixZeey1nn8oNomZF2fssqCAaE--6Me_7pPzslBog2drHEsf13zZxYDfs6nVZFpFKUZkAACgYKAcMSARQSFQHGX2Mi44dp9P-R-r0p21tLm79oERoVAUF8yKrlS2kR2lte8GPFzeSqTxP50076" },
  { name: "__Secure-3PSIDCC", value: "AKEyXzXd-DzCunqq-RcPD9Kw9a9yojCzvLticSQXumRS0KjgQhNymGAdy6CZ8zRCkMNX75Ew" },
  { name: "__Secure-3PSIDTS", value: "sidts-CjIBmiPuTWM6FhLCEVDUOmO2S26kyfSguhRhzXepmK-ulpd8cm5144ERmrgU12uWrJwvQxAA" },
  { name: "APISID", value: "SD99dKneqBAIz4Q9/AXu42hk90YI67SKgA" },
  { name: "GPS", value: "1" },
  { name: "HSID", value: "A5r6nMEkDufdfw2OD" },
  { name: "LOGIN_INFO", value: "AFmmF2swRQIgOweAzmKdFCR2_iF8lWd1betVKYRT1TSBWsw97g0xI-8CIQCkKNovcHwVJKVgls2oJSJtwDzpsY8VT3zYquGb-9IXNw:QUQ3MjNmelREUGVMeW1mTk5fUjBYTjNmdzI0eUZTMl9sMTNHdGE1QWotSGNvQkxiUVVNcWh0OGQzZHdyVUdBNnRJYjA3M3FZRDlCQXVDZE5kVV9JLUpKRkhpakY5cURaejcxZWktMnBBTTh0T1pFa0ZyeXJLWHJwZENQZ1R4Yno2ZWtWUGlqZzYyb1piZG5KWE1TSnVOOG1LUktDOVVWaU9B" },
  { name: "PREF", value: "f6=40000000&tz=Asia.Jakarta" },
  { name: "SAPISID", value: "Zu2p9n9nyYorUEJK/AOBH4VHCZTzadN9SG" },
  { name: "SID", value: "g.a000swixZeey1nn8oNomZF2fssqCAaE--6Me_7pPzslBog2drHEsjBESFAl9NCb8drYA7OgPLAACgYKAaESARQSFQHGX2Mi9UjtcY4nG6KnYHhLwHmqAhoVAUF8yKrztmL8yGMNZ_Q1VXj7WfCr0076" },
  { name: "SIDCC", value: "AKEyXzUXLQ9TwZT08BwP49m1eLPhXvsn9C8PMfVpIqJ0Uw6fw9rBj_mhs4rZ3Rmo2VkSwZCn" },
  { name: "SSID", value: "AKTzmqL1eH-FU77LS" },
];