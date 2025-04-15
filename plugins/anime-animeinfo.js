import axios from 'axios'
import *as cheerio from 'cheerio'

let animeCache = []

let handler = async (m, { conn, command, args }) => {
  if (command === 'animechart') {
    const url = 'https://www.livechart.me/spring-2025/all'
    try {
      const { data } = await axios.get(url)
      const $ = cheerio.load(data)
      const animeList = []

      $('article.anime').each((index, el) => {
        animeList.push({
          id: index + 1,
          title: $(el).find('h3.main-title a').text().trim(),
          synopsis: $(el).find('.anime-synopsis p').text().trim(),
          rating: $(el).find('.anime-avg-user-rating').text().trim(),
          date: $(el).find('.anime-date').text().trim(),
          episodes: $(el).find('.anime-episodes').text().trim(),
          poster: $(el).find('.poster-container img').attr('src'),
        })
      })

      animeCache = animeList

      const topButtons = animeList.slice(0, 3)
      const listText = animeList
        .slice(0, 10)
        .map(anime => `✨ *${anime.id}. ${anime.title}*`).join('\n')

      await conn.sendMessage(m.chat, {
        text: `🌸 *Anime Musim Semi 2025* 🌸\n\n${listText}\n\n` +
              `Ketik *.animeinfo <id>* untuk melihat detail anime.\n` +
              `_Contoh: .animeinfo 1_`,
        footer: 'Powered by LiveChart.me',
        buttons: topButtons.map(anime => ({
          buttonId: `.animeinfo ${anime.id}`,
          buttonText: { displayText: `▶️ ${anime.title.slice(0, 20)}` },
          type: 1
        })),
        headerType: 1
      }, { quoted: m })

    } catch (err) {
      m.reply('❌ Gagal mengambil data anime.\n' + err.message)
    }
  }

  if (command === 'animeinfo') {
    if (!args[0]) return m.reply('Masukkan ID anime!\nContoh: .animeinfo 1')
    const id = parseInt(args[0])
    const anime = animeCache.find(a => a.id === id)
    if (!anime) return m.reply('Anime tidak ditemukan.')

    let caption = `*🌟 ${anime.title}*\n\n`
    caption += `⭐ *Rating:* ${anime.rating || 'Belum ada'}\n`
    caption += `🎬 *Episodes:* ${anime.episodes || 'Tidak diketahui'}\n`
    caption += `🗓️ *Tanggal Tayang:* ${anime.date || '-'}\n\n`
    caption += `📝 *Sinopsis:*\n${anime.synopsis || 'Tidak tersedia.'}`

    await conn.sendMessage(m.chat, {
      image: { url: anime.poster },
      caption,
      contextInfo: {
        externalAdReply: {
          title: anime.title,
          body: 'Klik untuk lihat di LiveChart',
          thumbnailUrl: anime.poster,
          mediaType: 1,
          sourceUrl: 'https://www.livechart.me/spring-2025/all'
        }
      }
    }, { quoted: m })
  }
}

handler.help = ['animechart', 'animeinfo <id>']
handler.tags = ['anime']
handler.command = /^animechart|animeinfo$/i

export default handler