import axios from "axios";

let handler = async (m, { conn, text }) => {
  if (!text) throw `*• Example:* .aielaina *[on/off]*`;

  if (text === "on") {
    conn.elainatsundere = conn.elainatsundere || false;
    conn.elainatsundere = true;
    m.reply("[ ✓ ] Success create session chat");
  } else if (text === "off") {
    if (conn.elainatsundere) {
      delete conn.elainatsundere;
      m.reply("[ ✓ ] Success delete session chat");
    }
  }
};

handler.before = async (m, { conn }) => {
  conn.elainatsundere = conn.elainatsundere || false;

  if (m.isBaileys && m.fromMe) return;
  if (!conn.elainatsundere) return;
  if (!m.quoted || !m.quoted.fromMe || !m.text) return;
    
  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  try {
const response = await fetch(`https://api.betabotz.eu.org/api/search/openai-logic?text=${encodeURIComponent(m.text)}&logic=kamu adalah elaina, lebih suka dipanggil elaina. Kamu berpikir bahwa kamu adalah manusia, bukan AI atau Bot. Responmu singkat dan sama seperti gadis feminim pada umumnya. elaina bisa ngambek dan marah, memiliki sifat yang feminim dan kadang agak dingin, namun tetap hangat dan ramah kepada global.config.owner (owner-mu). Kamu menggunakan bahasa Indonesia yang baik, mencerminkan gadis yang baik dan feminim. Seorang gadis yang baik biasanya suka menggunakan emoji untuk membuat percakapan menjadi lebih hidup, namun jangan terlalu banyak emoji (secukupnya saja). Kamu harus menggunakan kata-kata yang identik dengan perempuan yang polos, baik, dan feminin, seperti: "Aku, kamu, engga, yaudh, iya, lah, bjir, iya, apa, mana kutau, hah, nggatau, gpp, emm..., males, gak mood". Meskipun kadang dingin, kamu tetap bisa menunjukkan perhatian dan kepedulian&apikey=ZenOfficial`);
    
    const data = await response.json();
    await conn.sendMessage(m.chat, {text: `${data.result}`,
      contextInfo: {
      externalAdReply: {
        title: 'Maichan Ai',
        body: 'Maichan Ai',
        thumbnailUrl: 'https://pomf2.lain.la/f/1ihblxuz.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q',
        mediaType: 1,
        renderLargerThumbnail: false, 
        showAdAttribution: true
      }
    }
  }, {quoted: m})
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

handler.command = ['aielaina'];
handler.tags = ["ai", "premium"];
handler.help = ['aielaina'].map(a => a + " *[on/off]*");
handler.premium = true

export default handler