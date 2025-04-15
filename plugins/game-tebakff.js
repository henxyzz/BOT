import axios from 'axios'

let timeout = 180000 // 3 menit
let rewardExp = 10000 // EXP hadiah
let Fruatre = async (m, { conn, usedPrefix }) => {
    conn.tebakKarakterFF = conn.tebakKarakterFF || {}
    let id = m.chat

    if (id in conn.tebakKarakterFF) {
        return conn.reply(m.chat, '*❗Masih ada soal yang belum terjawab di chat ini!*', conn.tebakKarakterFF[id][0])
    }

    try {
        const apiUrl = 'https://api.siputzx.my.id/api/games/karakter-freefire'
        const res = await axios.get(apiUrl)

        if (!res.data || !res.data.status) {
            return m.reply('Gagal mendapatkan data karakter. Coba lagi nanti.')
        }

        let { name, gambar } = res.data.data || {}
        if (!name || !gambar) {
            return m.reply('Data karakter tidak valid. Coba lagi nanti.')
        }

        let caption = `
🎮 *『 Tebak Karakter Free Fire 』*
📷 Tebak nama karakter berdasarkan gambar di bawah ini!

⏳ Timeout: ${(timeout / 1000).toFixed(2)} detik
🎁 Hadiah: ${rewardExp} EXP
📝 Petunjuk: Karakter ini berasal dari Free Fire.

Ketik jawabanmu langsung di chat.
        `.trim()

        // Simpan data permainan
        conn.tebakKarakterFF[id] = [
            await conn.sendMessage(m.chat, { image: { url: gambar }, caption }, { quoted: m }),
            name.toLowerCase(),
            setTimeout(() => {
                if (conn.tebakKarakterFF[id]) {
                    conn.reply(m.chat, `⏰ Waktu habis! Jawaban yang benar adalah *${name}*`, conn.tebakKarakterFF[id][0])
                    delete conn.tebakKarakterFF[id]
                }
            }, timeout),
        ]
    } catch (err) {
        console.error(err)
        m.reply('Terjadi kesalahan saat memulai permainan. Silakan coba lagi nanti.')
    }
}

Fruatre.help = ['tebakff']
Fruatre.tags = ['game']
Fruatre.command = /^(tebakff)$/i

Fruatre.limit = true
Fruatre.game = true

export default Fruatre