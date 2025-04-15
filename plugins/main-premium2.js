const {
generateWAMessageFromContent,
generateWAMessageContent,
proto
} = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn }) => {
    const packages = [
        { type: '15HARI', price: 'Rp 5.000', urlTag: '15Hari', bonus: '' },
        { type: '30HARI', price: 'Rp 10.000', urlTag: '30Hari', bonus: '' },
        { type: '45HARI', price: 'Rp 12.000', urlTag: '45Hari', bonus: '' },
        { type: '60HARI', price: 'Rp 15.000', urlTag: '60Hari', bonus: '' },
        { type: 'PERMANENT', price: 'Rp 30.000', urlTag: 'PERMANENT', bonus: '' },
        { type: 'SPESIAL PAKET', price: 'Rp 50.000', urlTag: 'Spesial Paket', bonus: 'Bonus sewa permanent' },
    ];

    let button = packages.map(pkg => ({
        header: `*PREMIUM🌀 ${pkg.type}*`,
        text: `- Harga: ${pkg.price}\n- Deskripsi: Nikmati pengalaman Premium Akses dengan bot kami. Dapatkan akses All Fiture , fitur eksklusif, dan dukungan penuh 24 jam.`,
        footer: `Bonus: ${pkg.bonus || 'Tidak ada bonus'}\nKlik di bawah untuk sewa.`,
        url: 'https://files.catbox.moe/vzsu7d.jpg',
        web: [{
            text: 'Owner',
            url: `https://wa.me/6281217523837?text=Bang+Saya+Mau+Premium+Bot+Maichan+${pkg.urlTag}`
        }]
    }));

    await buttonSlide(m.chat, button, m, {
        footer: 'Hubungi Owner untuk info lebih lanjut',
        text: 'Owner DikaaOffc'
    });
}

handler.help = ['premium2'];
handler.tags = ['main'];
handler.command = /^(premium2)$/i;

export default handler;

async function buttonSlide(jid, buttons = [], quoted = m, options = {}) {
    async function createImage(url) {
        const { imageMessage } = await generateWAMessageContent(
            { image: { url } },
            { upload: conn.waUploadToServer }
        );
        return imageMessage;
    }

    let push = [];
    
    for (let btn of buttons) {
        let header = await createImage(btn.url);
        let buttonActions = [];

        if (btn.web) {
            buttonActions = buttonActions.concat(
                btn.web.map(item => ({
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: `${item.text}!`,
                        url: item.url,
                        merchant_url: item.url
                    })
                }))
            );
        }
        
        if (btn.copy) {
            buttonActions = buttonActions.concat(
                btn.copy.map(copyItem => ({
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: `${copyItem.text}`,
                        id: "123456789",
                        copy_code: `${copyItem.url}`
                    })
                }))
            );
        }
        
        if (btn.list) {
            buttonActions = buttonActions.concat(
                btn.list.map(copyItem => ({
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: `${copyItem.title}`,
                        sections: [{
                            title: `${copyItem.button.title}`,
                            highlight_label: `${copyItem.button.label}`,
                            rows: [...copyItem.button.list]
                        }]
                    })
                }))
            );
        }

        push.push({
            body: proto.Message.InteractiveMessage.Body.create({
                text: btn.text
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
                text: btn.footer
            }),
            header: proto.Message.InteractiveMessage.Header.create({
                title: btn.header,
                hasMediaAttachment: true,
                imageMessage: header
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: buttonActions
            })
        });
    }

    const msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: options.text
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: options.footer
                    }),
                    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
                        cards: push
                    })
                })
            }
        }
    }, { quoted, userJid: quoted.key.remoteJid });

    await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
    }