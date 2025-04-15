import axios from 'axios';

const handler = async (m, { conn, text }) => {
    if (!text) throw 'Contoh: .gptz Pesan yang ingin Anda sampaikan kepada asisten AI';

    m.reply('⏳ Sedang diproses...'); 
    const messages = encodeURIComponent(text);

    try {
        const response = await getgptzw7Response(messages);
        m.reply(decodeURIComponent(response.data.html));
    } catch (error) {
        console.error('Error:', error);
        m.reply('❌ Terjadi kesalahan, coba lagi nanti.');
    }
};

handler.help = ['gptz'];
handler.tags = ['ai'];
handler.command = ['gptz'];

export default handler;

function generateRandomIP() {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

async function getgptzw7Response(content) {
    const url = 'http://5awm.gpt.zw7.lol/chat.php';

    const data = {
        id: '3.5',
        web: '1',
        key: '',
        role: '',
        title: [
            { role: 'user', content: content },
            { role: 'assistant', content: 'You are a helpful assistant.' }
        ],
        text: content,
        stream: '0'
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; M2004J19C Build/RP1A.200720.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.129 Mobile Safari/537.36 WhatsApp/1.2.3',
                'Referer': 'http://5awm.gpt.zw7.lol/',
                'X-Forwarded-For': generateRandomIP(),
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}