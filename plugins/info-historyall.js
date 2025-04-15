import moment from "moment-timezone"

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users
    let dataUser = Object.entries(user)
    let result = []

    for (let [number, value] of dataUser) {
        if (typeof value.historyTrx != "object") {
            //console.log("No historyTrx found for user:", number)
            continue
        }

        let dataHistory = Object.values(value.historyTrx)

        for (let history of dataHistory) {
            if (!history.time || !history.nominal || !history.type) {
                //console.log("Incomplete transaction data for user:", number)
                continue
            }

            if (/refund/i.test(history.type)) {
                //console.log("Skipping refund transaction for user:", number)
                continue
            }

            //console.log("Transaction found:", history)
            result.push({
                jid: number,
                ...history
            })
        }
    }

    if (result.length === 0) {
        m.reply("Tidak ada transaksi yang ditemukan.")
        return
    }

    result.sort((a, b) => b.time - a.time)

    let caption = `*HISTORY SEMUA TRANSAKSI*\n\n`

    for (let i = 0; i < result.length; i++) {
        let v = result[i]
        caption += `
*${i + 1}.* ${v.jid.slice(0, 6)}..
Type : ${v.type}
Nominal : Rp ${toRupiah(v.nominal)}
Transaksi Time : ${getTime(v.time)}
`.trim() + "\n\n"
    }

    m.reply(caption.trim())
}

handler.help = ["historyall"]
handler.tags = ["topup"]
handler.desc = "Untuk Melihat Semua History"
handler.command = /^(historyall)$/i
export default handler

const formattedDate = ms => moment(ms).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm')

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/g, ".")

export const getTime = ms => {
    let { days, hours, minutes } = parseMs(+new Date() - ms)
    return days ? `${days} days ago` : hours ? `${hours} hours ago` : minutes ? `${minutes} minutes ago` : `a few seconds ago`
}

const parseMs = ms => ({
    days: Math.trunc(ms / 86400000),
    hours: Math.trunc(ms / 3600000) % 24,
    minutes: Math.trunc(ms / 60000) % 60
})