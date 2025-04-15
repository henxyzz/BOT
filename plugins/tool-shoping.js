let handler = async (m, { conn }) => {
  await conn.sendMessage(
    m.chat,
    {
      product: {
        productImage: { url: "https://files.catbox.moe/ad3lyz.jpg" }, // Gantilah dengan link gambar yang valid
        productImageCount: 1,
        title: "🎉 **Produk Terbaru!** 🎉", // Judul produk yang lebih menarik
        description: "💥 Temukan keunggulan produk ini dan nikmati harga terbaik hanya di sini!", // Deskripsi produk yang lebih menggugah minat
        priceAmount1000: 20000000, // Harga 20 juta (dalam satuan IDR)
        currencyCode: "IDR", // Mata uang
        retailerId: "100000", 
        url: "URL_PRODUK", // Link produk yang bisa diklik
      },
      businessOwnerJid: m.sender, // Mengirim pesan ke pengirim
      caption: "✨ Jangan lewatkan kesempatan untuk memiliki produk eksklusif ini! Klik link untuk beli sekarang! ✨", // Keterangan menarik
      title: "🛍️ **Toko WMBot** 🛍️", // Judul produk toko
      footer: "🛒 Belanja dengan mudah dan cepat.", // Footer yang menggoda pembeli
      media: true, // Menyertakan media
      viewOnce: false, // Jangan batasi hanya sekali lihat agar pengguna bisa melihat lebih dari sekali
      shop: "WA", // Platform untuk transaksi
      id: "689739h2dgshG", // ID unik produk
    },
    {
      quoted: m, // Mengutip pesan yang diterima
    }
  );
};

handler.help = ['shoping'];
handler.tags = ['tools'];
handler.command = /^(nih)$/i;

export default handler;