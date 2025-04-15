import axios from "axios";
 
const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(
      `Masukkan link TikTok!\nContoh: ${usedPrefix + command} https://vt.tiktok.com/ZSMw1Mo6a/`
    );
  if (!/(tiktok|vt\.tiktok\.com)/i.test(text))
    return m.reply("URL tidak valid, pastikan itu adalah link TikTok.");
 
  m.reply("⏳ Mengambil video...");
 
  try {
    const res = await axios.get(
      `https://www.velyn.biz.id/api/downloader/tiktok?url=${encodeURIComponent(text)}`
    );
    if (!res.data.status)
      throw new Error(res.data.message || "Gagal mengambil video.");
 
    const { title, no_watermark, music } = res.data.data;
 
    if (!no_watermark) throw new Error("Video tidak ditemukan.");
 
    let caption = `🎬 *Judul:* ${title || "Tanpa Judul"}\n🔗 *Sumber:* TikTok`;
 
    await conn.sendMessage(
      m.chat,
      { video: { url: no_watermark }, caption },
      { quoted: m }
    );
 
    if (music) {
      await conn.sendMessage(
        m.chat,
        { audio: { url: music }, mimetype: "audio/mpeg", fileName: "tiktok_audio.mp3" },
        { quoted: m }
      );
    }
  } catch (e) {
    m.reply(`⚠️ Error: ${e.message}`);
  }
};
 
handler.command = /^(tiktok|tt)$/i;
handler.tags = ["downloader"];
handler.help = ["tiktok <url>"];
 
export default handler;