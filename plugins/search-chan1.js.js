let handler = async (m, { conn, client, text, reply }) => {
  if (!text) return m.reply('Masukkan kata kunci pencarian!');

  let url = `https://velyn.vercel.app/api/search/an1?query=${encodeURIComponent(text)}`;
  let res = await fetch(url);
  let json = await res.json();

  if (!json.status || !json.data.length) return m.reply('Tidak ditemukan.');

  // Menambahkan emoji "🔎" di setiap hasil pencarian
  let hasil = json.data
    .filter(x => x.title !== 'N/A')
    .map(x => `🔎 *${x.title}*\nDeveloper: ${x.dev}\nRating: ${x.rating}\n[Link](${x.link})`)
    .join('\n\n');

  // Mengirim pesan teks menggunakan client.sendMessage
  client.sendMessage(m.chat, { text: hasil }, { quoted: m });
};

handler.tags = ['search'];
handler.help = ["searchan1 <query>"];
handler.command = ["searchan1"];

export default handler;