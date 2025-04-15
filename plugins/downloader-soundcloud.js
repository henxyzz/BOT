/*
- [ *PLUGINS SOUNDCLOUD DL* ]
- Description: Download mp3 from url SoundCloud

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

import axios from "axios";
import * as cheerio from "cheerio";
import FormData from "form-data";

const BASE_URL = "https://soundcloudmp3.co";

const scdl = {
  process: async (url) => {
    try {
      const form = new FormData();
      form.append("url", url);

      const config = {
        headers: {
          ...form.getHeaders(),
        },
      };

      const { data: htmlPage } = await axios.post(`${BASE_URL}/result.php`, form, config);

      const $ = cheerio.load(htmlPage);

      const audioLinkRaw = $(".chbtn").attr("href");
      const audioLink = `${BASE_URL}${audioLinkRaw.replace(/title=([^&]+)/, (match, title) => {
          return `title=${title.replace(/\s+/g, "+")}`;
      })}`;

      const artworkLinkRaw = $(".chbtn2").attr("href");
      const artworkLink = `${BASE_URL}${artworkLinkRaw}`;

      const result = {
        title: $(".text-2xl").text().trim(),
        audioBase: $("audio source").attr("src"),
        image: artworkLink,
        download: audioLink,
      };

      return result;
    } catch (error) {
      throw new Error(`Gagal dapetin data: ${error.message}`);
    }
  },
};

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Masukan URL Soundcloud\nContoh: *${usedPrefix + command}* https://m.soundcloud.com/droserose/lets-meet`);

  m.reply("⌛SEBANTAR YA CINTAKU SAYANGKU");

  const isLink = (url) => url.includes("soundcloud");
  if (!isLink(text)) throw "Ups, masukan URL Soundcloud yang valid";

  try {
    const hasil = await scdl.process(text);
    await conn.sendMessage(m.chat, { audio: { url: hasil.download }, mimetype: "audio/mpeg" }, { quoted: m });    
  } catch (e) {
    m.reply(`Error: ${e}`);
  }
};

handler.help = ["soundcloud <url>"];
handler.tags = ["downloader"];
handler.command = /^(scdl|soundcloud)$/i;

handler.limit = true;
handler.register = true;

export default handler;