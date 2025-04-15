// Powered By ShyoCanPikawcu
/*
      *Plugins :*

      *owner backupsc/update sc*

wa.me/6282176642989
Cr : https://whatsapp.com/channel/0029VavBc6uHAdNdbgCgOK0k

ini wm gw cok jan di hapus
*/

import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
let exec = promisify(_exec).bind(cp);

let handler = async (m, { 
 conn,
 isOwner,
 command,
participants,
  text 
  }) => {
  
  if (global.conn.user.jid != conn.user.jid) return;
  conn.sendMessage(m.chat, {react: {text: '🔓', key: m.key}})
  const teks = text ? text : ''
  const compressedFilePath = `nakanomd_v1.0.0${teks}.zip`
  if (!fs.existsSync(compressedFilePath)) {
    try {
      await exec(`zip -r Maichan Ai${teks}.zip Dockerfile LICENSE Procfile config.js database.json docker-compose.yml handler.js index.js json lib main.js media package-lock.json package.json plugins run.js server.js speed.py src test.js tmp views`);
      conn.sendMessage(m.chat, {react: {text: '🔒', key: m.key}})
      await conn.delay(1000)
      conn.sendMessage(m.chat, {react: {text: '🔐', key: m.key}})
     
    } catch (e) {
      conn.sendMessage(m.chat, {react: {text: '❎', key: m.key}})
      return; 
    }
  } else {
    m.reply(`Maichan Ai${teks}.zip already exists, skipping creation..._`);
  }

  // Check again if the file exists after compression attempt
  if (fs.existsSync(compressedFilePath)) {
    const compressedData = fs.readFileSync(compressedFilePath);
    await conn.sendMessage(
      m.chat,
      {
        document: compressedData,
        mimetype: 'application/zip',
        fileName: `Maichan Ai${teks}.zip`,
        caption: 'The backup file will be deleted ❗',
      },
      {
        quoted: m,
      mentions: participants.map(v => v.id)
      }
    );
  } else {
    m.reply('File not found. Compression may have failed.');
  }
  await fs.unlinkSync(compressedFilePath)
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = /^(update)$/i;
handler.rowner = true;

export default handler;