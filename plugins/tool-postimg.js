/*
Jangan Hapus Wm Bang 

*postimg  Plugins Esm*

Yah Intinya Sih Kayak Tourl

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029Vb2WECv9xVJaXVi46y2m
*/

import axios from 'axios'
import cheerio from 'cheerio'
import FormData from 'form-data'

async function postimg(buffer) {
  try {
    let data = new FormData()
    data.append('optsize', '0')
    data.append('expire', '0')
    data.append('numfiles', '1')
    data.append('upload_session', Math.random())
    data.append('file', buffer, `${Date.now()}.jpg`)

    const res = await axios.post('https://postimages.org/json/rr', data)
    const html = await axios.get(res.data.url)
    const $ = cheerio.load(html.data)

    let link = $('#code_html').attr('value')
    let image = $('#code_direct').attr('value')
    let delimg = $('#code_remove').attr('value')

    return { link, image, delimg }
  } catch (err) {
    throw err
  }
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image/.test(mime)) return m.reply(`Kirim gambar dengan caption *${usedPrefix}postimg* atau balas gambar`)

    let media = await q.download()

    m.reply('Tunggu Bentar...')

    let result = await postimg(media)

    let caption = `*Successful Image Upload*\n\n` +
                  `*Link HTML :* ${result.link}\n` +
                  `*Direct Link :* ${result.image}\n` +
                  `*Delete Image :* ${result.delimg}`

    await conn.sendMessage(m.chat, { image: { url: result.image }, caption }, { quoted: m })
  } catch (e) {
    m.reply(`*Gagal mengunggah gambar:*\n${e}`)
  }
}

handler.help = ['postimg']
handler.command = ['postimg']
handler.tags = ['tools']
handler.limit = false

export default handler