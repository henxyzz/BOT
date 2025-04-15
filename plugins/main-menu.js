import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import fetch from 'node-fetch'
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;
let handler = async (m, { conn }) => {
    const pp = await conn.profilePictureUrl(m.sender, 'image').catch(() => "https://files.catbox.moe/eb8z4j.jpg");
    const { age, money, limit, level, registered, premium } = global.db.data.users[m.sender] || {};
    const totalFeatures = Object.values(global.plugins).filter(v => v.help && v.tags).length;
    const userAge = age > 0 ? age : 'BELUM DAFTAR ࿐';
    const totalRegistered = Object.keys(global.db.data.users || {}).length;
    const userData = global.db.data.users[m.sender] || {};
    const userStatus = m.sender.split('@')[0] === global.config.owner
      ? 'Developer'
      : (userData.premiumTime > 0 ? 'Premium User' : 'Free User');
    const premiumStatus = userData.premiumTime > 0 ? 'Yes' : 'No';
    const isPublic = true;
    const name = registered ? userData.name : conn.getName(m.sender);
    const blockList = await conn.fetchBlocklist();
    const totalBlocked = blockList.length || 0;
    const bannedUsers = Object.entries(global.db.data.users || {}).filter(([_, user]) => user.banned).length;
    const activeUsers = Object.keys(global.db.data.users || {}).filter(v => global.db.data.users[v]?.commandTotal !== undefined);
    const commandToday = activeUsers.reduce((sum, user) => sum + (global.db.data.users[user]?.command || 0), 0);
    const ratings = Object.values(global.db.data.bots.rating || {}).map(v => v.rate || 0);
    const averageRating = ratings.length > 0 ? (ratings.reduce((sum, rate) => sum + rate, 0) / ratings.length).toFixed(2) : 0;
    
let menu =  `Hai Kak ${name}, Saya Nakano MD yang bisa membantu kalian, saya memiliki fitur AI, Downloader, dan lainnya. Bot ini masih dalam masa pengembangan yaa.
    
┌  • Bot - Info
│タ Name : Nakano MD
│タ Mode : ${isPublic ? "Public" : "Self"}
│タ User Banned : ${bannedUsers} banned
│タ User Blocked : ${totalBlocked} block
│タ Total Premium : ${Object.values(global.db.data.users || {}).filter(u => u.premiumTime > 0).length}
│タ Command Today : ${commandToday}
│タ Rating Bot : ${averageRating}/5.00 (${ratings.length} Users)
└──······`
await loading(m, conn)
await conn.textOptions(m.chat, menu, false, [[`.menulist`, "Menulist"], [`.ping`, "Ping"]], m, {
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    mediaType: 1,
                    title: '~` Nakano - 2025',
                    body: null,
                    thumbnail: (await conn.getFile('https://files.catbox.moe/eb8z4j.jpg')).data,
                    renderLargerThumbnail: true,
                    mediaUrl: null,
                    sourceUrl: null
                }
            }
        })
}

handler.command = /^(menu|help)$/i;
handler.register = true
export default handler;

function ucapan() {
    const time = moment.tz("jakarta/lampung").format("HH")
    let res = "Selamat Dini Hari ☀️"
    if (time >= 4) {
        res = "Selamat Pagi 🌄"
    }
    if (time >= 10) {
        res = "Selamat Siang ☀️"
    }
    if (time >= 15) {
        res = "Selamat Sore 🌇"
    }
    if (time >= 18) {
        res = "Selamat Malam 🌙"
    }
    return res
}