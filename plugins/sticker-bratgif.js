import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { 
    execSync
 } from 'child_process'

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {

    text = text ?
        text :
        m.quoted?.text ||
        m.quoted?.caption ||
        m.quoted?.description ||
        ''

    if (!text) return m.reply(`[ ! ] Mohon masukkan atau balas teks yang valid.`)
    if (text.length > 250) return m.reply(`Karakter terbatas, max 250!`)

    conn.sendMessage(m.chat, {
        react: {
            text: '🕒',
            key: m.key,
        }
    })

    const words = text.split(" ")
    const tempDir = path.join(process.cwd(), 'lib');

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const framePaths = []

    try {
        for (let i = 0; i < words.length; i++) {
            const currentText = words.slice(0, i + 1).join(" ")

            try {
                const res = await axios.get(
                    `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(currentText)}`, {
                        responseType: "arraybuffer"
                    }
                )

                if (!res || res.status !== 200) {
                    throw new Error(`Gagal membuat stiker (Status: ${res?.status})`)
                }

                const framePath = path.join(tempDir, `frame${i}.mp4`)
                fs.writeFileSync(framePath, res.data)
                framePaths.push(framePath)
            } catch (apiError) {
                console.error("Error API:", apiError.message)
                throw new Error("Gagal mengambil data dari API.")
            }
        }

        const fileListPath = path.join(tempDir, "filelist.txt")
        let fileListContent = framePaths.map(frame => `file '${frame}'\nduration 0.7\n`).join("")

        fileListContent += `file '${framePaths[framePaths.length - 1]}'\nduration 2\n`

        fs.writeFileSync(fileListPath, fileListContent)

        const outputVideoPath = path.join(tempDir, "output.mp4")
        const outputStickerPath = path.join(tempDir, "output.webp")

        execSync(
            `ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset ultrafast -pix_fmt yuv420p ${outputVideoPath}`
        )

        execSync(
            `ffmpeg -y -i ${outputVideoPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -c:v libwebp -preset default -loop 0 -an -q:v 50 ${outputStickerPath}`
        )

        let sticker = fs.readFileSync(outputStickerPath)

        await conn.sendMessage(m.chat, {
            sticker
        }, {
            quoted: m
        })

        conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key,
            }
        })

    } catch (e) {
        console.error("Error:", e.message)
        m.reply(`Terjadi kesalahan: ${e.message}`)
    }
}

handler.help = ['bratgif']
handler.tags = ['sticker']
handler.command = ['bratgif']
handler.limit = true

export default handler