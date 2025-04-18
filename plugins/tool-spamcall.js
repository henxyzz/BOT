import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) {
    throw `Contoh Penggunaan\n${usedPrefix}spamcall 628xxxxxxxx`;
  }

  let nomor = text.replace(/[^0-9]/gi, '').slice(2);
  if (!nomor.startsWith('8')) {
    throw `Contoh Penggunaan\n${usedPrefix}spamcall 628xxxxxxxx`;
  }

  m.reply('_Tunggu permintaan anda sedang diproses..._');
  let anu = await fetch(`https://id.jagreward.com/member/verify-mobile/${nomor}`)
    .then((a) => a.json());

  let spcall = `*Nomor bot* : _${anu.phone_prefix}_\n\n_Bot berhasil menlpon anda!_`;
  conn.reply(m.chat, `${spcall}`.trim(), m);
  m.reply(anu);
};

handler.help = ['spamcall <nomor>'];
handler.tags = ['tools', 'premium'];
handler.command = /^(spamcall)$/i;
handler.premium = true;

export default handler;