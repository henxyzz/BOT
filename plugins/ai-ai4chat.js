/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Ai4Chat
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
 
 using website : https://www.ai4chat.co/pages/youtube-comment-generator
*/
import axios from 'axios';
let handler = async (m, {
    text
}) => {
    if (!text) {
        return m.reply('Mau tnya apa sayang?');
    }
    const shyo = 'DikaOffc' // nama ai

    let anu = `https://yw85opafq6.execute-api.us-east-1.amazonaws.com/default/boss_mode_15aug?text=nama kamu adalah ${shyo} code, kamu berbahasa yang ramah dan berbahasa Indonesia yang santun dan islmia, mengikuti kata ${encodeURIComponent(text)}&country=Asia&user_id=M08wTiyb56`;

    try {
        let res = await axios.get(anu, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://www.ai4chat.co/pages/youtube-comment-generator'
            }
        });

        if (res.data) {
            let generatedComment = res.data.comment || res.data;
            await m.reply(`"${generatedComment}"\n\n> © ${shyo}`);
        } else {
            await m.reply(`Gagal! bot ${shyo} tak merespon`);
        }
    } catch (error) {
        console.error(error);
        await m.reply(`Ainya ${shyo} error`);
    }
};

handler.help = ['ai4chat'];
handler.tags = ['ai'];
handler.command = /^ai4chat$/i;
handler.limit = true;

export default handler;