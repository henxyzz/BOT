const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    const text = args.length ? args.join(" ") : m.quoted?.text || null;
    if (!text) return m.reply(`Please provide a link!\n\n*Example*:\n- ${usedPrefix + command} https://website.com/xxxx`);
    /** React Process **/
    m.react(set.react);
    

    const urlPattern = /https?:\/\/[^\s]+/;
    const match = text.match(urlPattern);
    const url = match ? match[0] : null;
    if (!url) return m.reply(status.invalid);

    await m.reply(status.wait);
    const result = await SaveWeb2zip(url);

    if (!result) return m.reply("An error occurred while downloading the file.");

    const caption = "";
    await conn.sendMessage(m.chat, {
      document: Buffer.from(result.buffer),
      mimetype: "application/zip",
      fileName: `${text}.zip`,
      caption: caption
    }, {
      quoted: m
    });
  } catch (e) {
    console.error(e);
    m.reply(`Failed to execute ${command} command\nError: _${e.message}_`);
  }
};

handler.help = ["cloneweb"];
handler.command = /^(cloneweb|webclone)$/i;
handler.tags = ["tools"];
handler.premium = true;
handler.limit = 50;

module.exports = handler;

const SaveWeb2zip = async (link, options = {}) => {
  const apiUrl = "https://copier.saveweb2zip.com";
  let attempts = 0;
  let md5;

  try {
    const copyResponse = await fetch(`${apiUrl}/api/copySite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
        Referer: "https://saveweb2zip.com/en"
      },
      body: JSON.stringify({
        url: link,
        renameAssets: options.renameAssets || false,
        saveStructure: options.saveStructure || false,
        alternativeAlgorithm: options.alternativeAlgorithm || false,
        mobileVersion: options.mobileVersion || false
      })
    });

    const copyResult = await copyResponse.json();
    md5 = copyResult.md5;

    if (!md5) throw new Error("Failed to retrieve MD5 hash");

    while (attempts < 10) {
      const statusResponse = await fetch(`${apiUrl}/api/getStatus/${md5}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
          Referer: "https://saveweb2zip.com/en"
        }
      });

      const statusResult = await statusResponse.json();
      if (statusResult.isFinished) {
        const downloadResponse = await fetch(`${apiUrl}/api/downloadArchive/${md5}`, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
            Referer: "https://saveweb2zip.com/en"
          }
        });

        const buffer = await downloadResponse.arrayBuffer();
        const fileName = `${md5}.zip`;
        return {
          fileName: fileName,
          buffer: buffer,
          link: `${apiUrl}/api/downloadArchive/${md5}`
        };
      }

      await new Promise(resolve => setTimeout(resolve, 60000));
      attempts++;
    }

    throw new Error("Timeout: Max attempts reached without completion");
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};