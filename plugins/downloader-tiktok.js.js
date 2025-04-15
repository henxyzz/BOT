import axios from "axios"
import { toAudio } from "../lib/converter.js"
let regex = /https:\/\/(www\.)?tiktok\.com\/(@[^\/]+\/(video|photo)\/\d+|\w+\/\d+|\w+)|https:\/\/(vt|vm)\.tiktok\.com\/\w+/i
let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args[0]) return m.reply(`Masukan link tiktok! \n\nContoh: \n${usedPrefix + command} https://vt.tiktok.com/ZSFxYcCdr/`)
        let isLink = args[0].match(regex)
        if (!isLink && !/tiktok-imgdl/i.test(command)) return m.reply("Itu bukan link tiktok!")
        await global.loading(m, conn)
        if (/tiktok-imgdl/i.test(command)) return await conn.sendFile(m.chat, args[0], "", "", m)
        let { data } = await tiktok(args[0])
        if (data?.images) {
            if (data.images.length > 1) {
                let list = data.images.map((v, i) => {
                    return [`${usedPrefix}tiktok-imgdl ${v}`, (i + 1).toString(), (i + 1).toString()]
                })
                await conn.textList(m.chat, `Terdapat *${data.images.length} Hasil* \nSilahkan pilih mana foto yang mau kamu Download!`, data.images[0], list, m, { noList: true })
            } else {
                await conn.sendFile(m.chat, data.images[0], "", "", m)
            }
        } else {
            let download = await conn.getFile(data.play)
            let vid = await conn.sendFile(m.chat, download.data, "", `Nickname : ${data.author.nickname} \nDuration : ${data.duration} \n\n${data.title}`.trim(), m)
            let audio = await toAudio(download.data, "mp4")
            await conn.sendFile(m.chat, audio.data, "", "", vid, false, { mimetype: "audio/mpeg" })
        }
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ["tiktok"]
handler.tags = ["downloader"]
handler.command = /^(tiktok-imgdl|tiktok(mp4|slide|foto|video)?|tt(mp4|slide|foto|video)?)$/i
handler.limit = true
handler.onlyprem = true
export default handler

async function tiktok(url) {
    let res = await axios.post("https://www.tikwm.com/api", {}, { params: { url, hd: 1 } })
    return res.data
}