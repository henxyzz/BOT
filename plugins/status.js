import fs from 'fs';
import path from 'path';

// Lokasi file players.json
const playersFile = path.resolve(__dirname, 'players.json');

// Fungsi untuk membaca data pemain
const loadPlayers = () => {
    if (!fs.existsSync(playersFile)) return {};
    return JSON.parse(fs.readFileSync(playersFile, 'utf8'));
};

// Fungsi untuk menyimpan data pemain
const savePlayers = (data) => {
    fs.writeFileSync(playersFile, JSON.stringify(data, null, 2));
};

// Daftar titel berdasarkan level
const getTitle = (level) => {
    if (level >= 1000) return '👑 Dewa';
    if (level >= 100) return '🌟 Legenda';
    if (level >= 700) return '⚔️ Pahlawan';
    if (level >= 45) return '🏹 Pemburu';
    if (level >= 35) return '🔮 Penjelajah';
    if (level >= 15) return '🛡️ Pejuang';
    return '🌟 Pemula';
};

// Fungsi untuk menambahkan EXP dan level up otomatis
const addExp = (player, expGained) => {
    player.exp += expGained;
    let levelUp = 0;

    while (player.exp >= player.level * 100) {
        player.exp -= player.level * 100;
        player.level += 1;
        levelUp++;

        // Health bertambah dengan naiknya level
        player.maxHealth = 100 + player.level * 10; // Maksimum health = 100 + 10 per level
        player.health = player.maxHealth; // Isi ulang health setiap naik level
    }

    player.titel = getTitle(player.level);

    return levelUp;
};

// Menangani perintah status
let handler = async (m, { Ditss, command }) => {
    let players = loadPlayers();
    let userId = m.sender;
    let userTag = `@${m.pushName}`;

    // Jika pemain baru, tambahkan ke players.json
    if (!players[userId]) {
        players[userId] = {
            nama: userTag,
            id: userId,
            titel: '🌟 Pemula',
            level: 1,
            exp: 0,
            saldo: 1000, // Saldo awal
            health: 100, // Health awal
            maxHealth: 100, // Maksimum health awal
            pet: null,
            inv: {}
        };
        savePlayers(players);
        m.reply('🎉 *Selamat!* Akun RPG Anda telah dibuat!');
    }

    // Tambahkan EXP secara acak untuk simulasi aktivitas
    let expGained = Math.floor(Math.random() * 50) + 10; // Tambah 10-50 EXP
    let levelUp = addExp(players[userId], expGained);
    savePlayers(players);

    // Pesan jika pemain naik level
    let levelUpMsg = levelUp
        ? `🎉 *Level Up!* Kamu naik ${levelUp} level dan sekarang bertitel *${players[userId].titel}*. Healthmu dipulihkan ke maksimum!\n`
        : '';

    // Tampilkan status pemain
    let status = `
╭━━━━━━━━━━━━━━━━━━━╮
┃             ⚔️ *STATUS* ⚔️
┃━━━━━━━━━━━━━━━━━━━┃
┃  ✦ Nama: ${players[userId].nama}
┃  ✦ Titel: ${players[userId].titel}
┃  ✦ Level: ${players[userId].level}
┃  ✦ Exp: ${players[userId].exp} / ${players[userId].level * 100}
┃  ✦ Health: ${players[userId].health} / ${players[userId].maxHealth}
┃  ✦ Saldo: Rp ${players[userId].saldo.toLocaleString()}
┃━━━━━━━━━━━━━━━━━━━╯
${levelUpMsg}⚡ Kamu mendapatkan *${expGained} EXP* dari aktivitasmu!
    `;

    m.reply(status);
};

handler.command = ['status'];

export default handler;