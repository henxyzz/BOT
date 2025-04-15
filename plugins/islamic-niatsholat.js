/*
- [ *PLUGINS NIAT SHOLAT* ]
- Description: Plugins niat sholat ( 5 waktu )

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const niatSholatData = [
    {
      index: '1',
      niat: 'Niat Sholat Subuh',
      arabic:
        'اُصَلِّى فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى',
      latin:
        "Ushalli fardhosh shubhi rok'ataini mustaqbilal qiblati adaa-an lillaahi ta'aala",
      translation_id:
        "Aku berniat shalat fardhu Shubuh dua raka'at menghadap kiblat karena Allah Ta'ala",
    },
    {
      index: '2',
      niat: 'Niat Sholat Dzuhur',
      arabic:
        'اُصَلِّى فَرْضَ الظُّهْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى',
      latin:
        "Ushalli fardhodl dhuhri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala",
      translation_id:
        "Aku berniat shalat fardhu Dzuhur empat raka'at menghadap kiblat karena Allah Ta'ala",
    },
    {
      index: '3',
      niat: 'Niat Sholat Ashar',
      arabic:
        'اُصَلِّى فَرْضَ الْعَصْرِاَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى',
      latin:
        "Ushalli fardhol 'ashri arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala",
      translation_id:
        "Aku berniat shalat fardhu 'Ashar empat raka'at menghadap kiblat karena Allah Ta'ala",
    },
    {
      index: '4',
      niat: 'Niat Sholat Maghrib',
      arabic:
        'اُصَلِّى فَرْضَ الْمَغْرِبِ ثَلاَثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى',
      latin:
        "Ushalli fardhol maghribi tsalaata raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala",
      translation_id:
        "Aku berniat shalat fardhu Maghrib tiga raka'at menghadap kiblat karena Allah Ta'ala",
    },
    {
      index: '5',
      niat: 'Niat Sholat Isya',
      arabic:
        'اُصَلِّى فَرْضَ الْعِشَاءِ اَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ اَدَاءً ِللهِ تَعَالَى',
      latin:
        "Ushalli fardhol 'isyaa-i arba'a raka'aatim mustaqbilal qiblati adaa-an lillaahi ta'aala",
      translation_id:
        "Aku berniat shalat fardhu Isya empat raka'at menghadap kiblat karena Allah Ta'ala",
    },
  ];

  const anjuran = `*Niat Sholat*\n\nSuatu ibadah akan diterima bila memenuhi dua hal, yaitu niat dan contoh dari rasulullah saw: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ ...[رواه البخاري ومسلم]ر\n\nَArtinya: "Sesungguhnya (sahnya) amal itu tergantung kepada niat ... [Hadits Riwayat al-Bukhari dan Muslim]".`;

  if (!args[0]) {
    let message = anjuran + '\n\n*Silakan pilih niat sholat yang ingin ditampilkan:*\n\n';
    niatSholatData.forEach((data) => {
      message += `> ${data.index}. ${data.niat}\n`;
    });
    message += `\nContoh: *${usedPrefix + command} 1*`;

    return conn.sendMessage(m.chat, { text: message.trim() }, { quoted: m });
  }
  
  m.reply("sebentar ya anak sholeh")

  const selectedIndex = parseInt(args[0]);
  const selectedData = niatSholatData.find(
    (data) => data.index === selectedIndex.toString()
  );

  if (selectedData) {
    let message = `*${selectedData.niat}*\n\n`;
    message += `*${selectedData.arabic}*\n\n`;
    message += `_${selectedData.latin}_\n\n`;
    message += `Artinya: "${selectedData.translation_id}"`;

    conn.sendMessage(m.chat, { text: message.trim() }, { quoted: m });
  } else {
    conn.sendMessage(m.chat, { text: 'Nomor niat sholat tidak valid. Silakan pilih nomor antara 1-5.' }, { quoted: m });
  }
};

handler.help = ['niatsholat [nomor]'];
handler.tags = ['islamic'];
handler.command = /^(niatsh[o]lat)$/i;

handler.register = false;

export default handler;