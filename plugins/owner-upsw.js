const mimeAudio = 'audio/mpeg';
const mimeVideo = 'video/mp4';
const mimeImage = 'image/jpeg';
import config from '@adiwajshing/baileys';
import fetch from 'node-fetch';
import FormData from 'form-data';
import {
    fileTypeFromBuffer
} from 'file-type';

const fetchParticipants = async (...jids) => {
  let results = [];
  for (const jid of jids) {
    let { participants } = await conn.groupMetadata(jid);
    participants = participants.map(({ id }) => id);
    results = results.concat(participants);
  }
  return results;
};

async function jembod(jids, content) {
  let colors = ['#7ACAA7', '#6E257E', '#5796FF', '#7E90A4', '#736769', '#57C9FF', '#25C3DC', '#FF7B6C', '#55C265', '#FF898B', '#8C6991', '#C69FCC', '#B8B226', '#EFB32F', '#AD8774', '#792139', '#C1A03F', '#8FA842', '#A52C71', '#8394CA', '#243640'];
  let fonts = [0, 1, 2, 6, 7, 8, 9, 10];
  
  const msg = await config.generateWAMessage(config.STORIES_JID, content, {
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    textArgb: 0xffffffff,
    font: fonts[Math.floor(Math.random() * colors.length)],  
    upload: conn.waUploadToServer
  });

  let statusJidList = [];
  for(const _jid of jids) {
    if(_jid.endsWith("@g.us")) {
      for(const jid of await fetchParticipants(_jid)) {
        statusJidList.push(jid);
      }
    } else {
      statusJidList.push(_jid);
    }
  }
  statusJidList = [
    ...new Set(
      statusJidList
    )
  ];

  await conn.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id,
    statusJidList,
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: jids.map((jid) => ({
              tag: "to",
              attrs: {
                jid
              },
              content: undefined
            }))
          }
        ]
      }
    ]
  });

  for(const jid of jids) {
    let type = (
      jid.endsWith("@g.us") ? "groupStatusMentionMessage" :
      "statusMentionMessage"
    );
    await conn.relayMessage(jid, {
      [type]: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    }, {
      additionalNodes: [
        {
          tag: "meta",
          attrs: {
            is_status_mention: "true"
          },
          content: undefined
        }
      ]
    });
  }
  return msg;
}

let handler = async (m, { conn, text }) => {
        if (!m.quoted) {
            throw "> 📸 *Balas dengan gambar, video, audio, atau pesan untuk mengirimkan ke status.*";
        }

        const mtype = m.quoted.type;
        let type;
        if (mtype === 'audioMessage') {
            type = 'Voice Note';
        } else if (mtype === 'videoMessage') {
            type = 'Video';
        } else if (mtype === 'imageMessage') {
            type = 'Image';
        } else if (mtype === 'conversation') {
            type = 'Text';
        } else {
            throw "> ❌ *Media type tidak valid!*";
        }

        const doc = {};
        if (mtype !== 'conversation') {
            const buffer = await m.quoted.download();
            const bkp = await catbox(buffer);
            if (type === 'Voice Note') {
                doc.mimetype = mimeAudio;
                doc.ptt = true;
                doc.audio = {
                    url: bkp
                };
            } else if (type === 'Video') {
                doc.mimetype = mimeVideo;
                doc.caption = m.quoted.body;
                doc.video = {
                    url: bkp
                };
            } else if (type === 'Image') {
                doc.mimetype = mimeImage;
                doc.caption = m.quoted.body;
                doc.image = {
                    url: bkp
                };
            }
        } else {
            doc.text = m.quoted.body;
        }

        if (text && text.endsWith("@g.us")) {
            let gc;
            try {
                gc = await conn.groupMetadata(text);
            } catch (e) {
                throw "> ❌ *ID grup tidak valid!*";
            }

            const groupName = gc.subject;
            const participantCount = gc.participants.length;

            return await jembod([text], doc)
                .then(() => {
                    m.reply(`> ✅ *Sukses upload ${type} di grup "${groupName}" dengan ${participantCount} peserta!*`)
                })
                .catch((e) => {
                    m.reply(`> ❌ *Gagal upload ${type} di grup "${groupName}".*\n\n${e.message || e}`)
                });
        }

        let colors = ['#7ACAA7', '#6E257E', '#5796FF', '#7E90A4', '#736769', '#57C9FF', '#25C3DC', '#FF7B6C', '#55C265', '#FF898B', '#8C6991', '#C69FCC', '#B8B226', '#EFB32F', '#AD8774', '#792139', '#C1A03F', '#8FA842', '#A52C71', '#8394CA', '#243640'];
        let fonts = [0, 1, 2, 6, 7, 8, 9, 10];

        await conn.sendMessage("status@broadcast", doc, {
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                textArgb: 0xffffffff,
                font: fonts[Math.floor(Math.random() * colors.length)],
                statusJidList: Object.keys(store.contacts),
            })
            .then(() => {
                m.reply(`> ✅ *Sukses upload ${type} ke status dengan ${Object.keys(store.contacts).length} peserta!*`)
            })
            .catch((e) => {
                m.reply(`> ❌ *Gagal upload ${type} ke status!*\n\n${e.message || e}`)
            });
};

handler.command = ["upsw"];
handler.help = ["upsw (reply)"];
handler.tags = ["owner"];
handler.owner = true;

export default handler;

async function generateVoice(Locale = "id-ID", Voice = "id-ID-ArdiNeural", Query) {
    const formData = new FormData();
    formData.append("locale", Locale);
    formData.append("content", `<voice name="${Voice}">${Query}</voice>`);
    formData.append("ip", '46.161.194.33');

    const response = await fetch('https://app.micmonster.com/restapi/create', {
        method: 'POST',
        body: formData
    });
    return Buffer.from(('data:audio/mpeg;base64,' + await response.text()).split(',')[1], 'base64');
}

async function catbox(buffer) {
    let {
        ext
    } = await fileTypeFromBuffer(buffer);
    let bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, "file." + ext);
    bodyForm.append("reqtype", "fileupload");

    let res = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: bodyForm,
    });

    let data = await res.text();
    return data;
}