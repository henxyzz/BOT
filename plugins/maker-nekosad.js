import fetch from 'node-fetch'
let handler = async (m, { conn, args }) => {
let response = args.join(' ').split('|')
  if (!args[0]) throw 'Teksnya?'
  let res = `https://oni-chan.my.id/api/canvas/nekosad?text1=${response[0]}&text2=${response[1]}&apikey=`
  conn.sendFile(m.chat, res, 'thumbnail.jpg', `Nih Kak`, m, false)
}
handler.help = ['nekosad']
handler.tags = ['textpro']
handler.command = /^(nekosad)$/i
handler.register = false

handler.limit = true

export default handler