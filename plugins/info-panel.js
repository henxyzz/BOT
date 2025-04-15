let handler = async (m, { setReply }) => {
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001) 

let pnel = `
♡ ∩_∩ 
  („• ֊ •„)♡
|￣U U￣￣￣￣￣￣￣￣￣|
| ⍴ᥲkᥱ𝗍 ⍴ᥲᥒᥱᥣ ძіkᥲᥲ᥆𝖿𝖿ᥴ
￣￣￣￣￣￣￣￣￣￣￣￣
📁 *1GB* ⤿ 1k
📁 *2GB* ⤿ 2k
📁 *3GB* ⤿ 3k
📁 *4GB* ⤿ 4k
📁 *5GB* ⤿ 5k
📁 *6GB* ⤿ 6k
📁 *7GB* ⤿ 7k
📁 *8GB* ⤿ 8k
📁 *Unlimited* ⤿ 10k!

🤖 *JadiBot*
Akses bot selama 15 hari. 
💰 *Rp5.000*
${readmore}
${gris}♯ кєυитυиgαи ♯${gris}

*⩽⩾* ɢᴀ ʙᴏʀᴏs ᴋᴜᴏᴛᴀ
*⩽⩾* sᴄʀɪᴘᴛ ᴀɴᴅᴀ ᴛᴇʀᴊᴀɢᴀ ᴀᴍᴀɴ
*⩽⩾* sᴇʀᴠᴇʀ ᴍᴀsɪʜ ᴀᴋᴛɪғ ᴍᴇsᴋɪ ᴀɴᴅᴀ ᴋᴇʟᴜᴀʀ ᴅᴀʀɪ sɪᴛᴜs
*⩽⩾* ᴊɪᴋᴀ sɪᴛᴜs ᴍᴀᴛɪ ᴛᴏᴛᴀʟ,sᴇʜɪɴɢɢᴀ ᴛɪᴅᴀᴋ sᴇᴍᴘᴀᴛ ᴅɪ ᴏᴘᴛɪᴍᴀʟᴋᴀɴ,ʜᴜʙᴜɴɢɪ ᴀᴅᴍɪɴ ᴅᴇɴɢᴀɴ ᴊᴀᴍɪɴᴀɴ ᴜᴀɴɢ ᴀɴᴅᴀ ᴋᴀᴍɪ ᴋᴇᴍʙᴀʟɪᴋᴀɴ ᴋᴇᴍʙᴀʟɪ

`


setReply(pnel)
}

handler.command = /^(panel)$/i;
handler.tags = ['info'];
handler.help = ['panel'];

export default handler;