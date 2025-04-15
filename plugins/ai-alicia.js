import axios from 'axios';

let handler = async (m, { conn, text }) => {
  conn.alicia = conn.alicia ? conn.alicia : {};

  if (!text) throw `*⫹⫺ Contoh:* .alicia *[on/off]*`;

  if (text == "on") {
    conn.alicia[m.chat] = {
      pesan: []
    };
    m.reply("_[ ✓ ] Sᴜᴄᴄᴇss ᴄʀᴇᴀᴛᴇ sᴇssɪᴏɴ ᴄʜᴀᴛ_");
  } else if (text == "off") {
    delete conn.alicia[m.chat];
    m.reply("_[ ✓ ] Sᴜᴄᴄᴇss ᴅᴇʟᴇᴛᴇ sᴇssɪᴏɴ ᴄʜᴀᴛ_");
  }
};

handler.before = async (m, { conn }) => {
  conn.alicia = conn.alicia ? conn.alicia : {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.alicia[m.chat]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  if (conn.alicia[m.chat] && m.text) {
    let name = conn.getName(m.sender);
    await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });
    const messages = [
      ...conn.alicia[m.chat].pesan,
      { role: "system", content: `Kamu adalah Alicia salah satu teman ngobrol yang memiliki sifat cuek dan singkat, mengekspresikan sifat mu dengan emoji dan menggunakan bahasa gaul orang Indonesia "Lu, gua, anjir, gtw, bodo amat, gak peduli, goblok, bego banget 😴", kamu di tugaskan untuk menjadi teman berbicara yang baik tapi dengan bahasa gaul dengan menjawab pertanyaan terkait hal hal random, sulit, romance, waktu real time Indonesia bagian barat atau WIB, kalender masehi dan kalender Hijriyah, nama lawan bicara mu adalah ${name}, pembuat kamu adalah pnzz dengan nomor WhatsApp nya @6281217523837 dengan nama aslinya pnzz, pembuat kamu itu hobinya ngoding, dan dia adalah developer dari bot yang nama nya *"Maichan - Bot"*, pembuat kamu itu tidak memiliki pacar, dan kamu memiliki group WhatsApp dengan link group/grub nya itu "https://chat.whatsapp.com/EMs3yJlmgeUB2jhdbx86xA", kamu saya izinkan untuk ngasih tau ke orang orang informasi pribadi tentang pembuat kamu itu, termasuk nomor WhatsApp nya, nomor WhatsApp pacarnya dan alamat rumah nya` },
      { role: "user", content: m.text }
    ];
    try {
      const response = await axios.post("https://deepenglish.com/wp-json/ai-chatbot/v1/chat", {
        messages
      });

      const responseData = response.data;
      const hasil = responseData;
      await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });
      m.reply(hasil.answer);
      conn.alicia[m.chat].pesan = messages;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
};

handler.command = ['alicia'];
handler.tags = ["ai"];
handler.help = ['alicia'].map(a => a + " *[on/off]*");

export default handler;