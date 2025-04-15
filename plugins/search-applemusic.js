/*
Jangan Hapus Wm Bang 

*Apple Music Plugins Esm*

Buat Cari Lagu 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P/191

*/

import axios from "axios";
import cheerio from "cheerio";

class AppleMusic {
    async search(q) {
        try {
            let { data } = await axios.get(`https://music.apple.com/id/search?term=${encodeURIComponent(q)}`);
            let $ = cheerio.load(data);
            let result = [];

            $(".shelf-grid__body ul li .track-lockup").each((_, el) => {
                let title = $(el).find(".track-lockup__content li").eq(0).find("a").text().trim();
                let album = $(el).find(".track-lockup__content li").eq(0).find("a").attr("href");
                let crop = album.split("/").pop();
                let song = album.replace(crop, "").replace("/album/", "/song/") + album.split("i=")[1];
                let image = $(el).find(".svelte-3e3mdo source").eq(1).attr("srcset").split(",")[1].split(" ")[0].trim();
                let artist = {
                    name: $(el).find(".track-lockup__content li").eq(1).find("a").text().trim(),
                    url: $(el).find(".track-lockup__content li").eq(1).find("a").attr("href"),
                };
                result.push({ title, image, song, artist });
            });

            return result;
        } catch (error) {
            throw new Error("Gagal mengambil data dari Apple Music.");
        }
    }

    async download(url) {
        try {
            let { data } = await axios.get(url);
            let $ = cheerio.load(data);
            let json = JSON.parse($("script").eq(0).text());
            delete json.audio["@type"];
            delete json.audio.audio;
            delete json.audio.inAlbum["@type"];
            delete json.audio.inAlbum.byArtist;
            json.audio.artist = json.audio.byArtist[0];
            delete json.audio.artist["@type"];
            delete json.audio.byArtist;

            let { data: searchData } = await axios.get("https://aaplmusicdownloader.com/api/composer/ytsearch/mytsearch.php", {
                params: {
                    name: json.audio.name,
                    artist: json.audio.artist.name,
                    album: json.audio.inAlbum.name,
                    link: json.audio.url,
                },
            });

            if (!searchData.videoid) throw new Error("Gagal mendapatkan video ID.");
            let { data: downloadData } = await axios.get("https://aaplmusicdownloader.com/api/ytdl.php?q=" + searchData.videoid);
            
            return { metadata: json.audio, download: downloadData.dlink };
        } catch (error) {
            throw new Error("Gagal mengunduh musik.");
        }
    }
}

const appleMusic = new AppleMusic();

let handler = async (m, { conn, args }) => {
    if (!args.length) return m.reply("Mau cari lagu apa?");

    let query = args.join(" ");
    let results = await appleMusic.search(query);

    if (!results.length) return m.reply("Ga nemu lagu yang cocok.");

    let { title, image, song, artist } = results[0];
    
    let caption = `🎵 *Judul:* ${title}\n🎤 *Artis:* ${artist.name}\n🔗 *Link:* ${song}`;

    await conn.sendMessage(m.chat, { image: { url: image }, caption }, { quoted: m });

    try {
        let downloadData = await appleMusic.download(song);
        if (!downloadData.download) return m.reply("Gagal mengunduh lagu.");

        await conn.sendMessage(m.chat, { 
            audio: { url: downloadData.download }, 
            mimetype: 'audio/mp4' 
        }, { quoted: m });
    } catch (error) {
        m.reply("Maaf, gagal mengunduh lagu.");
    }
};

handler.help = ["applemusic"];
handler.tags = ['search']
handler.command = ["applemusic"];

export default handler;