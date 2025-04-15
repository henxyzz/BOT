let baileys from "@adiwajshing/baileys"
let {
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore,
  jidNormalizedUser ,
  makeCacheableSignalKeyStore,
  PHONENUMBER_MCC,
} = baileys;
let { Boom } from "@hapi/boom"
let NodeCache from "node-cache"
let Pino from "pino"
let simple from "../lib/simple"
let fs from "fs"
import crypto from 'crypto'// Tambahkan ini

if (global.conns instanceof Array) console.log();
else global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command, isOwner, text }) => {
  let parent = args[0] && args[0] == 'plz' ? conn : await global.conn; // Ganti _conn dengan conn
  if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == conn.user.jid)) { // Perbaiki tanda kurung
    throw `📌 Perintah ini hanya dapat digunakan di bot utamal\n\n wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}botclone`;
  }
  
  let conns = global.conn;
  let user = global.db.data.users[m.sender];
  
  async function bbts() {
    let authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8);
    if (!fs.existsSync("./database/jadibot/" + authFolderB)) {
      fs.mkdirSync("./database/jadibot/" + authFolderB, { recursive: true });
    }
    args[0] ? fs.writeFileSync("./database/jadibot/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : "";

    let authFile = "database/jadibot/" + m.sender.split("@")[0];
    let isInit = !fs.existsSync(authFile);
    let { state, saveCreds } = await useMultiFileAuthState(authFile);
    let msgRetryCounterCache = new NodeCache();

    const config = {
      logger: Pino({ level: "fatal" }).child({ level: "fatal" }),
      printQRInTerminal: false,
      mobile: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          Pino({ level: "fatal" }).child({ level: "fatal" }),
        ),
      },
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined,
    };

    conn = simple.makeWASocket(config);
    let ev = conn.ev;

    if (!conn.authState.creds.registered) {
      setTimeout(async () => {
        let phoneNumber = m.sender.split("@")[0];
        let code = await conn.requestPairingCode(phoneNumber);
        let hasilcode = code?.match(/.{1,4}/g)?.join("-") || code;
        let key = await conns.reply(
          m.chat,`\`[ CARA MENJADI BOT ]\`

1. Klik titik tiga : di pojok kanan atas
2. Ketuk perangkat tertaut
3. Ketuk tautkan perangkat
4. Ketuk tautkan dengan nomer telepon saja
5. masukan pairing nya 
6. tunggu proses selesai
7. lalu jadi dan langsung bisa di gunakan`,m,);
        await conns.reply(m.chat, hasilcode, key);
      }, 3000);
    }

    async function connectionUpdate(update) {
      const { connection, lastDisconnect } = update;
      console.log(update);
      if (connection == "connecting") {
        console.log(connection);
      } else if (connection == "open") {
        conns.reply(nomorbot + "@s.whatsapp.net", `*[ NOTIFICATION CONNECTION ]*\n> kini saya telah menjadi bot clone dari ${global.namebot}\nbot clone tidak dapat mengakses fitur owner`,m) 
conns.reply(nomorown + "@s.whatsapp.net",  `*[ NOTIFICATION CONNECTION ]*\n>  hai owner user jadibot hari ini adalah : @${m.sender.split("@")[0]}`, m) 
        global.conns.push(conn);
      }
      if (
        lastDisconnect &&
        lastDisconnect.error &&
        lastDisconnect.error.output &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
      ) {
        console.log(reloadHandler(true));
      }
    }

    const reloadHandler = function (restatConn) {
      let Handler = require("../handler");
      let handler = require("../handler");
      if (Object.keys(Handler || {}).length) handler = Handler;
      if (restatConn) {
        try {
          conn.ws.close();
        } catch {}
        conn = {
          ...conn,
          ...simple.makeWASocket(config),
        };
      }
      if (!isInit) {
        conn.ev.off("messages.upsert", conn.handler);
        conn.ev.off("group-participants.update", conn.onParticipantsUpdate);
        conn.ev.off("connection.update", conn.connectionUpdate);
        conn.ev.off("creds.update", conn.credsUpdate);
      }

      conn.welcome = "Hai, @user!\nSelamat datang di grup *@subject*\n\n@desc";
      conn.bye = "Selamat tinggal @user!";
      conn.spromote = "@user sekarang admin!";
      conn.sdemote = "@user sekarang bukan admin!";
      conn.handler = handler.handler.bind(conn);
      conn.onParticipantsUpdate = handler.participantsUpdate.bind(conn);
      conn.connectionUpdate = connectionUpdate.bind(conn);
      conn.credsUpdate = saveCreds.bind(conn);

      conn.ev.on("messages.upsert", conn.handler);
      conn.ev.on("group-participants.update", conn.onParticipantsUpdate);
      conn.ev.on("connection.update", conn.connectionUpdate);
      conn.ev.on("creds.update", conn.credsUpdate);
      isInit = false;
      return true;
    };

    reloadHandler();
  }

  bbts();
};

handler.help = ["jadibot"].map((a) => a + " *[CLONE YORUKA]*");
handler.tags = ["jadibot"];
handler.command = /^jadibot$/i;
handler.premium = true;
handler.limit = true;
handler.private = false;

export default handler