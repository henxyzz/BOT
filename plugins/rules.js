let handler = async (m, { setReply,sendThumb }) => {
  let teks = `
    ${gris1}Syarat dan Ketentuan menggunakan *${global.botName}*

1. Nama dan nomer user ${global.botName} akan Kami simpan di dalam server selama bot aktif.

2. Data akan di hapus ketika bot Offline atau di hapus oleh Owner Bot.

3. Kami tidak menyimpan gambar, video, file, audio, dan dokumen yang kamu kirim ke ${global.botName}.

4. Kami tidak akan pernah meminta users untuk memberikan informasi pribadi.

5. Jika menemukan Bug/Error silahkan langsung lapor ke Owner atau Developer atau bisa juga memakai fitur _*laporerror*_.

6. Beberapa fitur mungkin ada yang error, jadi tunggu sampai developer memperbaiki fitur tersebut.

8. Bot ini sudah di lengkapi dengan fitur _*Auto laporerror*_ jika terjadi error maka bot akan auto report ke developer, terkecuali error yang menyebabkan bot mati, maka user harus lapor ke developer.

7. Bot ini juga sudah di lengkapi dengan Fitur Anti Spam jika kamu terdeteksi melakukan spam, maka Bot tidak akan menanggapi kamu selama 20 detik.

9. User dilarang keras menelpon bot! jika melanggar maka kamu akan terkena banned, block dan dikirim bug.

10. Bot tidak akan menanggapi user yang meminta untuk di save nomernya.${gris1}
  `;

  // Mengirimkan pesan dengan aturan dan ketentuan
  sendThumb('https://pomf2.lain.la/f/4kynvgsd.jpg',teks);
};

handler.help = ['rules']; // Perintah yang digunakan oleh pengguna
handler.tags = ['info']; // Kategori plugin
handler.command = /^rules$/i; // Regex untuk mencocokkan perintah

module.exports = handler;