import axios from 'axios'
import fs from 'fs'
import moment from 'moment-timezone'
import { otakudesu } from '../lib/scrape.js'

let handler = async(m, { conn, usedPrefix, command, text, isPrems }) => {
    try {
        if (!text) return m.reply(`Masukan Query Atau Link!\n\nContoh :\n${usedPrefix + command} Tonikaku Kawai\n${usedPrefix + command} https://otakudesu.lol/anime/tonikaku-ni-kawaii-sub-indo/`)
        await global.loading(m, conn)
        let d = new Date(new Date + 3600000)
        let locale = 'id'
        let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        let url = text.startsWith('http') ? text.replace(/http(s)?:\/\//i, '').split('/')[1]: text
        let user = global.db.data.users[m.sender]
        let name = user.registered ? user.name : await conn.getName(m.sender)
        let hwaifu = JSON.parse(fs.readFileSync('./json/hwaifu.json', 'utf-8'))
        if (/^anime/i.test(url)) {
            let result = await otakudesu.detail(text)
            let teks = `
Title : ${result.title.indonesia}
Produser : ${result.producer}
Status : ${result.status}
Total Eps : ${result.total_eps}
Durasi : ${result.duration}
Release : ${result.release}
Studio : ${result.studio}
Genre : ${result.genre}
${result.synopsis ? `
Synopsis : 
${result.synopsis}` : ""}
`.trim()
            let list = result.link_eps.map((v, i) => {
                return [`${usedPrefix + command} ${v.link}`, (i + 1).toString(), `${v.episode} \nUpload At ${v.upload_at}`]
            })
            await conn.textList(m.chat, teks, result.thumbnail, list, m)
        } else if (/^episode/i.test(url)) {
            let result = await otakudesu.download(text)

            let res720p = await originalUrl(result.link_mp4.find(v => v.type.trim() == "Mega" && /Mp4 720p/i.test(v.resolusi)).link)
            let res480p = await originalUrl(result.link_mp4.find(v => v.type.trim() == "Mega" && /Mp4 480p/i.test(v.resolusi)).link)
            let res360p = await originalUrl(result.link_mp4.find(v => v.type.trim() == "Mega" && /Mp4 360p/i.test(v.resolusi)).link)

            let list = [
                [`${usedPrefix}mega ${res360p}`, "1", "Download Resolusi 360p"],
                [`${usedPrefix}mega ${res480p}`, "2", "Download Resolusi 480p"],
                [`${usedPrefix}mega ${res720p}`, "3", "Download Resolusi 720p"]
            ]
            await conn.textList(m.chat, `Terdapat *3 Resolusi*`, false, list, m)
        } else {
            let result = await otakudesu.search(text)
            let list = result.map((v, i) => {
                return [`${usedPrefix + command} ${v.link}`, (i + 1).toString(), `${v.title.length > 50 ? `${v.title.slice(0, 50)}..` : v.title} \nGenre : ${v.genres} \nStatus : ${v.status}`]
            })
            await conn.textList(m.chat, `Terdapat *${result.length} Result*`, false, list, m)
        }
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['otakudesu']
handler.tags = ['anime']
handler.command = /^(otakudesu)$/i
handler.limit = true
export default handler

async function originalUrl(url) {
    return (await axios(url)).request.res.responseUrl
}

const delay = time => new Promise(res => setTimeout(res, time))

function wish() {
    let wishloc = ''
    const time = moment.tz('Asia/Jakarta').format('HH')
    wishloc = ('Hi')
    if (time >= 0) {
        wishloc = ('Selamat Malam')
    }
    if (time >= 4) {
        wishloc = ('Selamat Pagi')
    }
    if (time >= 11) {
        wishloc = ('Selamat Siang')
    }
    if (time >= 15) {
        wishloc = ('️Selamat Sore')
    }
    if (time >= 18) {
        wishloc = ('Selamat Malam')
    }
    if (time >= 23) {
        wishloc = ('Selamat Malam')
    }
    return wishloc
}