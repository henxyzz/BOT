var handler = async (m, {
    conn,
    usedPrefix: _p
}) => {
    const text = m.text.toLowerCase();

    if (text === 'p' || text === 'pe' || text === 'woy' || text === 'cuk' || text === 'coy' || text === 'cuy' || text === 'cok' || text === 'woi' || text === 'mek' || text === 'tol') {
        let info = `Harap yang sopan dalam memanggil orang, minimal mengatakan "Assalamu'alaikum warrahmatullahi Wabarakatuh" atau kalian bisa panggil Namanya. Tidak sopan itu, Jika *anda lebih tua* anda mengerti yang namanya etika.\n\n`;

        let greetings = {
            'islam': 'Assalamualaikum',
            'kristen': 'Shalom',
            'hindu': 'Swastyastu',
            'buddha': 'Sotthi Jitu',
            'konghucu': 'Wei De Dong Tian',
        };

        greetings['Atheis/Gapunya Agama/Orang Gila'] = text;

        // buat greetings info
        let greetingsInfo = Object.keys(greetings)
            .map((key) => `${key}: ${greetings[key]}`)
            .join('\n');

        let caption = `${info}${greetingsInfo}`;

        await conn.reply(m.chat, caption, m);
        await conn.sendMessage(m.chat, {
            react: {
                text: '😡',
                key: m.key,
            },
        });
        return; // Skip deh
    }

    /*let info = `Iyaaa? Ada apa? Anda mencari *Owner* saya ? Untuk saat ini, orangnya belum membuka chat anda, harap tunggu sebentar yah, pesan tetap dikirimkan kok ke penerima. Terimakasih, Semoga harimu Menyenangkan.😇\n *Silahkan Langsung Chat Owner Jika Itu Penting!*`;
    await conn.reply(m.chat, info, m);
    await conn.sendMessage(m.chat, {
        react: {
            text: '😇',
            key: m.key,
        },
    });*/
};

// UNTUK handler.customPrefix TAMBAHIN YANG KALIAN MAU YA DAN JANGAN LUPA JUGA DIGANTI PADA BAGIAN if text
handler.customPrefix = /^(cantik|kakak|om|bang|om shyo|woy|cuk|cok|coy|woi|cuy|bapak|pak|ibu|bu|mimin|min|admin|tol)$/i;
handler.command = new RegExp();

export default handler;