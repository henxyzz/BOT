import { screenshotWeb } from "../lib/scrape.js"

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args[0]) return m.reply(`Masukan Urls! \n\nContoh : \n${usedPrefix + command} https://google.com dekstop`)
        if (!args[0].startsWith('http')) return m.reply('Link hanya diawali http/https')
        if (!isValidURL(args[0])) return m.reply("Link Tidak Valid!")
        let screen = type.filter(v => v.type === args[1])
        if (!screen.length) return m.reply("Masukan tipe layar\n\n" + type.map(v => { return `*•* ${v.type}` }).join("\n"))
        await global.loading(m, conn)
        let screenshot = await screenshotWeb(args[0], { width: screen[0].width, height: screen[0].height }, 2000)
        await conn.sendFile(m.chat, screenshot, false, `Link : ${args[0]}`, m)
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['ssweb']
handler.tags = ['internet']
handler.command = /^(screenshot(web(site)?)|ss(web(site)?))$/i
handler.limit = true
export default handler

const type = [
    {
        type: "dekstop",
        width: 1920,
        height: 1080
    }, {
        type: "phone",
        width: 1080,
        height: 2400
    }
]

const regex = /^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;

function isValidURL(url) {
    return regex.test(url)
}