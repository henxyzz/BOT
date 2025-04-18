let handler = async (m, { hanz, usedPrefix, args, command }) => {
  hanz.war = hanz.war ? hanz.war : {};
  hanz.war2 = hanz.war2 ? hanz.war2 : {};

  if (!args[0] || args[0] == "help")
    return m.reply(`*❏  W A R - Z O N E*

[1] War Zone adalah game perang dengan sistem _turn attack_ atau menyerang secara bergiliran
[2] Permainan dapat dimulai dengan 1v1 sampai dengan 5v5
[3] Modal perang adalah harta rampasan perang jika tim kamu menang
[4] Setiap pemain akan mendapatkan 5000 HP (Health Point)
[5] Keberhasilan menyerang tergantung level kamu dengan level musuh yang akan diserang
[6] Kesempatan menyerang adalah 40 detik, lebih dari itu dianggap AFK (pengurangan 2500 HP)
[7] Sebuah tim akan menang jika tim lawan kalah semua (HP <= 0) dan mendapatkan harta rampasan perang

*❏  C O M M A N D S*
*${usedPrefix + command} join A/B* = join game
*${usedPrefix + command} left* = left game
*${usedPrefix + command} money 10xx* = uang taruhan
*${usedPrefix + command} player* = player game
*${usedPrefix + command} start* = start game`);

  if (args[0] == "money") {
    if (!(m.chat in hanz.war))
      return m.reply(`*Silahkan buat room terlebih dahulu (Ketik .war join)*`);
    if (m.sender == hanz.war[m.chat][0].user) {
      if (args[1] != "undefined" && !isNaN(args[1])) {
        args[1] = parseInt(args[1]);
        if (args[1] < 1000) return m.reply("*Minimal Rp. 1.000*");
        hanz.war2[m.chat].money = args[1];
        return m.reply(
          "*Berhasil menetapkan modal perang sebesar Rp. " +
            Number(args[1]).toLocaleString() +
            "*"
        );
      } else {
        return m.reply(
          "*Masukkan modal taruhan perang berupa angka (Tidak boleh menggunakan titik)*\n\n.war money 100000"
        );
      }
    } else {
      return hanz.reply(
        m.chat,
        `*Hanya @${
          hanz.war[m.chat][0].user.split("@")[0]
        } sebagai pembuat room yang bisa mengganti modal awal perang*`,
        m,
        { contextInfo: { mentionedJid: [hanz.war[m.chat][0].user] } }
      );
    }
  }

  // JOIN
  if (args[0] == "join") {
    if (global.db.data.users[m.sender].money < 1000)
      return m.reply("*Uang kamu minimal Rp. 1000 untuk bermain game ini.*");
    // FIRST PLAYER
    if (!(m.chat in hanz.war)) {
      hanz.war2[m.chat] = { war: false, turn: 0, time: 0, money: 0 };
      hanz.war[m.chat] = [];
      let exp = global.db.data.users[m.sender].exp;
      hanz.war[m.chat][0] = {
        user: m.sender,
        hp: 5000,
        lvl: global.db.data.users[m.sender].level,
        turn: false,
      };
      for (let i = 1; i < 10; i++) {
        hanz.war[m.chat][i] = { user: "", hp: 0, lvl: 0, turn: false };
      }
      return m.reply(
        `*Berhasil masuk ke dalam game sebagai Team A*\n\n*.war join a/b* = join game\n*.war start* = mulai game`
      );
    } else {
      // NOT FIRST PLAYER
      // IF FULL
      if (hanz.war2[m.chat].war) {
        return m.reply(`*Permainan sudah dimulai, tidak bisa join.*`);
      }
      // IF YOU ALREADY JOIN THE GAME
      for (let i = 0; i < hanz.war[m.chat].length; i++) {
        if (m.sender == hanz.war[m.chat][i].user) {
          let total = 0;
          for (let i = 0; i < 10; i++) {
            if (hanz.war[m.chat][i].user == "") {
              total += 1;
            }
          }
          return m.reply(
            `*Anda sudah masuk ke dalam game*\n\n*.war join a/b* = join game\n*.war start* = mulai game`
          );
        }
      }

      // JOIN MILIH TIM
      if (args[1]) {
        if (args[1].toLowerCase() == "a") {
          if (hanz.war2[m.chat].money == 0)
            return hanz.reply(
              m.chat,
              `*Tolong @${
                hanz.war[m.chat][0].user.split("@")[0]
              } tetapkan modal awal perang (minimal Rp. 1.000.000)*\n\n.war money 1000000`,
              m,
              { contextInfo: { mentionedJid: [hanz.war[m.chat][0].user] } }
            );
          return m.reply("a");
          if (global.db.data.users[m.sender].money < hanz.war2[m.chat].money)
            return m.reply(
              `*Uang kamu minimal Rp. ${hanz.war2[
                m.chat
              ].money.toLocaleString()} untuk bermain game ini.*`
            );
          for (let i = 1; i < 5; i++) {
            if (hanz.war[m.chat][i].user == "") {
              let exp = global.db.data.users[m.sender].exp;
              hanz.war[m.chat][i] = {
                user: m.sender,
                hp: 5000,
                lvl: global.db.data.users[m.sender].level,
                turn: false,
              };
              let total = 0;
              for (let i = 0; i < 10; i++) {
                if (hanz.war[m.chat][i].user == "") {
                  total += 1;
                }
              }
              return m.reply(
                `*Berhasil masuk ke dalam game sebagai Team A*\n\n*.war join a/b* = join game\n*.war start* = mulai game`
              );
            }
          }
        } else if (args[1].toLowerCase() == "b") {
          if (hanz.war2[m.chat].money == 0)
            return hanz.reply(
              m.chat,
              `*Tolong @${
                hanz.war[m.chat][0].user.split("@")[0]
              } tetapkan modal awal perang (minimal Rp. 1000000)*\n\n.war money 1000000`,
              m,
              { contextInfo: { mentionedJid: [hanz.war[m.chat][0].user] } }
            );
          if (global.db.data.users[m.sender].money < hanz.war2[m.chat].money)
            return m.reply(
              `*Uang kamu minimal Rp. ${hanz.war2[
                m.chat
              ].money.toLocaleString()} untuk bermain game ini.*`
            );
          for (let i = 5; i < 10; i++) {
            if (hanz.war[m.chat][i].user == "") {
              let exp = global.db.data.users[m.sender].exp;
              hanz.war[m.chat][i] = {
                user: m.sender,
                hp: 5000,
                lvl: global.db.data.users[m.sender].level,
                turn: false,
              };
              let total = 0;
              for (let i = 0; i < 10; i++) {
                if (hanz.war[m.chat][i].user == "") {
                  total += 1;
                }
              }
              return m.reply(
                `*Berhasil masuk ke dalam game sebagai Team B*\n\n*.war join a/b* = join game\n*.war start* = mulai game`
              );
            }
          }
        } else {
          return m.reply(
            `*Pilih salah satu tim A atau B*\n\n.war join A\n.war join B`
          );
        }
      } else {
        // JOIN SESUAI URUTAN
        return m.reply(
          `*Pilih salah satu tim A atau B*\n\n.war join A\n.war join B`
        );
      }

      // CHECK IF ROOM FULL
      for (let i = 0; i < hanz.war[m.chat].length; i++) {
        let total = 0;
        if (hanz.war[m.chat][i].user != "") {
          total += 1;
        }
        if (total == 10) hanz.war2[m.chat].war = true;
      }
    }
  }

  // LEFT GAME
  if (args[0] == "left") {
    // IF GAME START
    if (hanz.war2[m.chat].war) {
      m.reply(`*Perang sudah dimulai, anda tidak bisa keluar*`);
    } else {
      // IF NOT
      for (let i = 0; i < 10; i++) {
        if (m.sender == hanz.war[m.chat][i].user) {
          return m.reply(`*Berhasil keluar dari game*`);
        }
      }
      return m.reply(`*Kamu tidak sedang berada di dalam game*`);
    }
  }

  // CEK PLAYER
  if (args[0] == "player") {
    if (!(m.chat in hanz.war))
      return m.reply(`*Tidak ada pemain yang join room War Zone*`);
    var teamA = [];
    var teamB = [];
    var teamAB = [];
    for (let i = 0; i < hanz.war[m.chat].length; i++) {
      if (i < 5) {
        if (hanz.war[m.chat][i].user != "")
          teamA.push(hanz.war[m.chat][i].user);
      } else {
        if (hanz.war[m.chat][i].user != "")
          teamB.push(hanz.war[m.chat][i].user);
      }
      teamAB.push(hanz.war[m.chat][i].user);
    }
    // return m.reply(teamA[0])
    hanz.reply(
      m.chat,
      `${
        hanz.war2[m.chat].war
          ? "*Giliran : " +
            "@" +
            hanz.war[m.chat][hanz.war2[m.chat].turn].user.split("@")[0] +
            "*\n*Taruhan : Rp. " +
            Number(hanz.war2[m.chat].money).toLocaleString() +
            "*\n\n"
          : "*Taruhan : Rp. " +
            Number(hanz.war2[m.chat].money).toLocaleString() +
            "*\n\n"
      }*TEAM A :*\n` +
        teamA.map(
          (v, i) =>
            `${hanz.war[m.chat][i].hp > 0 ? "❤️ " : "☠️ "}@${
              v.split("@")[0]
            } (Lv.${hanz.war[m.chat][i].lvl} HP: ${hanz.war[m.chat][i].hp})`
        ).join`\n` +
        "\n\n*TEAM B :*\n" +
        teamB.map(
          (v, i) =>
            `${hanz.war[m.chat][i + 5].hp > 0 ? "❤️ " : "☠️ "}@${
              v.split("@")[0]
            } (Lv.${hanz.war[m.chat][i + 5].lvl} HP: ${
              hanz.war[m.chat][i + 5].hp
            })`
        ).join`\n`,
      m,
      {
        contextInfo: {
          mentionedJid: teamAB,
        },
      }
    );
  }

  // START GAME
  if (args[0] == "start") {
    if (hanz.war2[m.chat] && hanz.war2[m.chat].war)
      return m.reply(`*Perang sudah dimulai, tidak bisa join.*`);
    teamA = 0;
    teamB = 0;
    for (let i = 0; i < 10; i++) {
      if (i < 5) {
        if (hanz.war[m.chat] && hanz.war[m.chat][i].user != "") teamA += 1;
      } else {
        if (hanz.war[m.chat] && hanz.war[m.chat][i].user != "") teamB += 1;
      }
    }

    if (teamA == teamB && teamA > 0) {
      hanz.war2[m.chat].war = true;
      for (let i = 0; i < 5; i++) {
        if (hanz.war[m.chat][i].user != "") {
          let user = hanz.war[m.chat][i].user;
          return hanz.reply(
            m.chat,
            `*Permainan berhasil dimulai*\n*Silahkan @${
              user.split("@")[0]
            } untuk menyerang musuh*\n\n.war player = statistik pemain\n.attack @tag = serang lawan`,
            m,
            { contextInfo: { mentionedJid: [user] } }
          );
        }
      }
    } else {
      if (teamA > teamB) {
        m.reply(
          `*Team B kurang ${teamA - teamB} orang lagi agar permainan adil.*`
        );
      } else {
        m.reply(
          `*Team A kurang ${teamB - teamA} orang lagi agar permainan adil.*`
        );
      }
    }
  } else {
    throw "Join Dulu";
  }
};
handler.help = ["war"];
handler.tags = ["game"];
handler.command = /^(war)$/i;
handler.noCmdStore = true
handler.onlyGroup = true;
export default handler;