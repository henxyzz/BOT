/*
Jangan Hapus Wm Bang 

*Play  Plugins Esm*

Banyak Yang Minta Anjir 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

.
*/

import yts from 'yt-search';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Mana query nya?\n\nContoh: ${usedPrefix + command} blue yung kau`);
    
    m.reply('Tunggu bentar ya, lagi nyari...');
    
    try {
        const searchResults = await yts(text);
        if (!searchResults.videos.length) {
            return m.reply('Hmm, gak ketemu video nya nih. Coba kata kunci lain deh!');
        }

        const video = searchResults.videos[0]; 
        const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
        const apiUrl = `https://ytdl-api.caliphdev.com/download/audio?url=${videoUrl}`;
        
        const { data } = await axios.get(apiUrl);
        if (!data.status) {
            return m.reply('Waduh, gagal download audio nya. Coba lagi nanti ya!');
        }

        const title = data.videoDetails.title;
        const duration = data.videoDetails.lengthSeconds;
        const downloadUrl = data.downloadUrl;
        const thumbnail = video.thumbnail;
        
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        await conn.sendMessage(
            m.chat, 
            { 
                image: {
                    url: thumbnail
                },
                caption: `*°${title}*\n\n⏱️ Durasi: ${formattedDuration}\n🔗 Link: ${videoUrl}\n\n_Audio lagi dikirim, tunggu bentar..._`
            }
        );
        
        await conn.sendMessage(
            m.chat, 
            {
                audio: {
                    url: downloadUrl
                },
                mimetype: 'audio/mp4',
                fileName: `${title}.mp3`
            }
        );
        
    } catch (error) {
        console.error('Error:', error);
        m.reply('Yah error nih, coba lagi nanti ya!');
    }
};

handler.help = ['play'];
handler.tags = ['search'];
handler.command = ['play'];

export default handler;