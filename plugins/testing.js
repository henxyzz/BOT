let { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default
let handler = async (m, { conn }) => {
conn.sendMessage(m.chat, {
audio: { url: "https://files.catbox.moe/dc79p5.opus" }, mimetype:'audio/mpeg', ptt: false,
contextInfo: {
externalAdReply: {
containsAutoReply: true,
mediaType: 1,
mediaUrl: '',
renderLargerThumbnail: true,
showAdAttribution: true,
sourceUrl: '',
thumbnailUrl: 'https://files.catbox.moe/29pquw.jpg',
title: `Waktu Azan Telah Tiba`,
body: `Silahkan Sholat`,
},
forwardingScore: 999,
isForwarded: true,
mentionedJid: [m.sender],
businessMessageForwardInfo: {
businessOwnerJid: "0"
},
forwardedNewsletterMessageInfo: {
newsletterJid: '0',
serverMessageId: null,
newsletterName: `#! Notifiations`
}
}
}, {})
let prep = generateWAMessageFromContent(m.chat, { orderMessage: { 
itemCount: -10062007, status: 500,
surface: 999,
message: '*Azan sudah berkumandang, silahkan berwudhu dan sholat*',
description: '^^',
orderTitle: 'Haii Kak',
token: '9',
curreyCode: 'IDR',
totalCurrencyCode: '>〰<',
totalAmount1000: '1000000',
sellerJid: '6285736178354@s.whatsapp.net',
thumbnail: { url: "https://i.supa.codes/N7ETH" }
}}, {contextInfo: null, quoted: m})
conn.relayWAMessage(prep)
};

handler.help = ['help']
handler.command = /^(testing)$/i;
handler.tags = ['tag'];

export default handler;