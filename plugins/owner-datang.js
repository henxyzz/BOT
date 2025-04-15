import fetch from 'node-fetch'
let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    try {
        let maximus = `*Waduhh*, Ownerku *Dikaa* Datang, Ayo Tepuk Tangan.\n@${m.sender.split('@')[0]}`
        await conn.sendMessage(m.chat, {
            text: maximus,
            contextInfo: {
                externalAdReply: {
                    title: "MieChan AI",
                    body: "♕ DikaaOffc Dev",
                    thumbnailUrl: "https://i.supa.codes/50wWLt",
                    sourceUrl: "",
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargeThumbnail: true
                }
            }
        }, {
            quoted: m
        })
    } catch (e) {
        console.log(e)
        throw `Fitur Error.`
    }
}

handler.customPrefix = /^(hallo|cihuy)$/i
handler.command = new RegExp
handler.owner = true
export default handler