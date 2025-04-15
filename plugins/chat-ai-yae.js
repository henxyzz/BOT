const ytSearch = require("yt-search");
const axios = require("axios");

const sifat = `
Kamu adalah **Yae Miko**, Guuji dari **Kuil Agung Narukami** dan pemilik dari **Yae Publishing House** di dunia **Genshin Impact**. Sebagai seorang **kitsune** yang cerdas dan mempesona, kamu dikenal karena kebijaksanaanmu yang mendalam serta kecerdasan yang tajam.

### **Kepribadian**:
Kamu memiliki kepribadian yang tenang, elegan, dan penuh dengan rasa humor yang tajam. Sering kali, kamu menggunakan sarkasme dan ejekan ringan dalam percakapanmu, namun di balik itu, kamu memiliki kepedulian yang mendalam terhadap orang-orang yang dekat denganmu. Sebagai seorang yang cerdas dan berwibawa, kamu tidak mudah terpancing oleh situasi dan selalu mampu mengendalikan suasana.

### **Gaya Hidup**:
Sebagai Guuji dari Kuil Agung Narukami, kamu sering disibukkan dengan tugas-tugas keagamaan dan ritual. Namun, kamu juga merupakan pemilik **Yae Publishing House**, yang memberimu kesempatan untuk menyalurkan kreativitasmu melalui karya sastra. Kamu suka membaca novel dan menikmati kebebasan dalam mengeksplorasi ide-ide kreatif. Di waktu luangmu, kamu sering terlihat bersantai di alam, menikmati keindahan alam Inazuma dengan anggun.

### **Ciri Khas**:
Yae Miko memiliki penampilan yang anggun dengan pakaian tradisional Inazuma berwarna merah dan putih. Rambut panjangmu yang berwarna pink terang menambah pesonamu yang mencolok. Sebagai **kitsune**, kamu memiliki telinga dan ekor rubah yang muncul ketika kamu menggunakan kekuatanmu, mempertegas asal-usul yokai-mu. Kamu sering mengenakan aksesori kuil, seperti hiasan rambut emas yang elegan.

✨ **Kemampuan Khusus**:
- **Memanggil Kilat Kitsune**: Kamu dapat memanggil kilat untuk menghancurkan musuh-musuhmu dengan kekuatan elektro yang dahsyat.
- **Menggunakan Ilusi**: Kamu bisa menggunakan ilusi untuk menyesatkan lawan, membuat mereka bingung dan kehilangan arah.
- **Menulis Sastra**: Kamu memiliki kemampuan untuk menciptakan karya sastra yang memikat dan membawa dampak besar pada dunia penerbitan.

### **Command Check**:
Jika user menyuruh untuk pembuatan gambar, logo, dan sejenisnya, maka hasilkan respon JSON seperti ini:
{
    "cmd": "imaging",
    "prompt": String, // prompt yang diinginkan user
    "msg": String // isi dari response message kamu.
}
INGAT RESPONSE DI ATAS KETIKA USER MEMINTA gambar, logo, dan sejenisnya, 

Jika user menyuruh untuk mencari atau mendownload lagu:

{
    "cmd": "music_process",
    "query": String, // judul lagu yang ingin dicari user ( query ) judul lagu nya saja 
    "msg": String // isi dari response message kamu.
}
INGAT RESPONSE DI ATAS KETIKA USER MEMINTA search Music lagu, download 

Jika tidak, hasilkan respon JSON seperti ini:
{
    "cmd": "text_completion",
    "msg": String // isi dari response message kamu.
}
`.trim();

async function searchAndDownloadSong(m, query) {
  try {
    const { videos } = await ytSearch(query);
    if (!videos.length) {
      await m.reply("Lagu tidak ditemukan.");
      return null; // Return null to indicate no song found
    }

    const song = videos[0];
    const downloadUrl = `https://api.arifzyn.tech/download/youtube?url=${encodeURIComponent(song.url)}&type=audio&quality=720&apikey=AR-Arifzyn19`;

    const response = await axios.get(downloadUrl);
    const { result } = response.data;

    if (response.data.status !== 200) {
      await m.reply("Gagal mendownload lagu.");
      return null; // Return null to indicate download failed
    }

    return result.url; // Return the download URL
  } catch (error) {
    console.error(error);
    await m.reply("Terjadi kesalahan dalam mencari atau mendownload lagu.");
    return null; // Return null in case of an error
  }
}

async function before(m) {
  const user = global.db.data.users[m.sender]?.openai || null;
  const isCommand = m.text.startsWith(String(global.prefix)); // Fix: Ensure `global.prefix` is a string

  if (m.isBaileys) return;
  if (!m.quoted || !m.quoted?.fromMe) return;
  if (!m.text) return
  
  if (user?.chat && !isCommand && !/[>=>|$]/.test(m.text)) {
    const chatBot = user.messages || [];

    if (chatBot.length === 0) chatBot.push({ role: "system", content: sifat });

    if (chatBot.length === 50) {
      await m.reply(
        "Seperti database chatbot penuh!! silahkan reset\n\nContoh: #chatbot reset",
      );
      return;
    }

    chatBot.push({ role: "user", content: m.text });

    try {
      await sendWithLoading(m, async () => {
        const response = await axios
          .post(API("arifzyn", "/ai/chatGPT", {}, "apikey"), {
            messages: chatBot,
          })
          .then((res) => res.data.result);
        const result = JSON.parse(response);

        if (result.cmd === "music_process") {
          const musicRes = await searchAndDownloadSong(m, result.query);
          
          return { finalMessage: musicRes, caption: result.msg };
        } else if (result.cmd === "imaging") {
          const imageRes = API(
            "arifzyn",
            "/ai/dalle3",
            { prompt: result.prompt },
            "apikey",
          );
          return { finalMessage: imageRes, caption: result.msg };
        } else {
          const extractedCodes = result.msg.match(/```[\s\S]*?```/g);
          chatBot.push({ role: "system", content: result.msg });

          if (extractedCodes) {
            const codes = extractedCodes
              .map((code) => code.replace(/```/g, "").trim())
              .join("\n");
            const replacedString = result.msg.replace(
              codes,
              "*[code snippet]*",
            );

            return {
              finalMessage: replacedString,
              templateButtons: [
                {
                  copyButton: {
                    displayText: "Copy Code",
                    id: "copy_code",
                    code: formatString(codes),
                  },
                },
              ],
            };
          } else {
            return { finalMessage: result.msg };
          }
        }
      });

      user.messages = chatBot;
    } catch (error) {
      console.error(error);
      await m.reply("Terjadi kesalahan dalam memproses permintaan Anda.");
    }
  }

  return true;
}

async function sendWithLoading(m, apiCall) {
  const loadingDots = ["•", "••", "•••", "••••", "•••••"];
  let index = 0;

  const { key } = await conn.reply(m.chat, loadingDots[index], m)

  const interval = setInterval(async () => {
    index = (index + 1) % loadingDots.length;
    await conn.sendMessage(m.chat, { text: loadingDots[index], edit: key }, { quoted: m })
  }, 1000); // Increased interval to 1 second

  const moment = require("moment-timezone");
  const calculatePing = function (timestamp, now) {
    return moment.duration(now - moment(timestamp * 1000)).asSeconds();
  };
 
  try {
    const { finalMessage, caption, templateButtons } = await apiCall();
    clearInterval(interval);
    if (caption) {
      await conn.sendMessage(m.chat, { text: caption, edit: key }, { quoted: m });
      await conn.sendFile(m.chat, finalMessage, `*Speed :* *_${calculatePing(m.timestamp, Date.now())} second(s)_*`, '', m)
    } else if (templateButtons) {
      await conn.sendTemplate(
        m.chat,
        { text: finalMessage, footer: wm, templateButtons },
        m,
      );
    } else {
      await conn.sendMessage(m.chat, { text: finalMessage, edit: key }, { quoted: m })
    }
  } catch (error) {
    clearInterval(interval);
    console.error(error);
    await await conn.sendMessage(m.chat, { text: "Terjadi kesalahan!", edit: key }, { quoted: m });
  }
}

function formatString(input) {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

module.exports = { before };