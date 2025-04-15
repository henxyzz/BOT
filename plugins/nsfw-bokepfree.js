/*
- [ *PLUGINS ANU FREE* ]
- Description: Ya begitulah.. 😹

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

let handler  = async (m, { conn }) => {
  m.reply("⌛BOKEP COLMEK TERKENCING KENCING AKAN DATANG")

  let info = `
*Surah An-Nur (24:30):*

قُلْ لِلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ۚ ذَٰلِكَ أَزْكَىٰ لَهُمْ ۗ إِنَّ اللَّهَ خَبِيرٌ بِمَا يَصْنَعُونَ

"Katakanlah kepada orang laki-laki yang beriman, 'Hendaklah mereka menahan pandangannya, dan memelihara kemaluannya; yang demikian itu adalah lebih suci bagi mereka. Sesungguhnya Allah Maha Mengetahui apa yang mereka perbuat.'"

*Surah An-Nur (24:31):*

وَقُلْ لِلْمُؤْمِنَاتِ يَغْضُضْنَ مِنْ أَبْصَارِهِنَّ وَيَحْفَظْنَ فُرُوجَهُنَّ

"Katakanlah kepada wanita yang beriman, 'Hendaklah mereka menahan pandangannya, dan memelihara kemaluannya.'"

Ayat-ayat ini memerintahkan kaum Muslimin dan Muslimat untuk menjaga pandangan mereka dari hal-hal yang haram dan memelihara kemaluan mereka dari perbuatan zina. Menonton film porno jelas melanggar perintah untuk menjaga pandangan.
`.trim()

  await m.reply(`File akan di kirim ke *Private Chat*\nDosa di tanggung sendiri yah!`)
  await conn.fakeReply(m.sender, info, '0@s.whatsapp.net', 'Tobat Bang', 'status@broadcast')
}

handler.help = ['bokepfree']
handler.tags = ['nsfw']
handler.command = ['bokepfree']

export default handler