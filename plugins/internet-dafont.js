import cheerio from 'cheerio';
import fetch from 'node-fetch';
import mime from 'mime-types';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan nama font\nContoh: *${usedPrefix + command}* lemon milk`); 

    await m.react("⌛")

    try {
        let res = await searchDafont(text);
        if (res.length === 0) return m.reply("Font tidak ditemukan, cari nama atau font lain");

        let item = await downloadDafont(res[0].link);
        let cap = `*${item.title}*\n\n> Author: ${item.author}\n> Theme: ${item.theme}\n> Total Download: ${formatNumber(item.totalDownloads)}\n\n*File yang tersedia*\n\n${item.filename.map((e, i) => ` ${i + 1}. ${e}`).join('\n')}\n\n*Note dari author*\n\n${item.note}`;
        let details = await getFileDetails(item.download);

	    await conn.sendMessage(m.chat, { image: { url: item.image }, caption: cap }, m)
	    await m.reply('Sedang mendownload file *zip* dari font tersebut...');
        await conn.sendFile(m.chat, item.download, item.title + details.fileFormat, null, m, true, {
            quoted: m,
            mimetype: details.mimeType
        });

    } catch (e)   
    {
        await m.reply(e);
    }
}

handler.help = ["dafont <nama>"];
handler.tags = ["internet"];
handler.command = /^(dafont)$/i;

export default handler;

async function searchDafont(q) {
  const response = await fetch(`https://www.dafont.com/search.php?q=${q}`);
  const html = await response.text();
  const $ = cheerio.load(html);

  const results = [];

  const regex = /<div class="lv1left dfbg">.*?<span class="highlight">(.*?)<\/span>.*?by <a href="(.*?)">(.*?)<\/a>.*?<\/div>.*?<div class="lv1right dfbg">.*?<a href="(.*?)">(.*?)<\/a>.*?>(.*?)<\/a>.*?<\/div>.*?<div class="lv2right">.*?<span class="light">(.*?)<\/span>.*?<\/div>.*?<div style="background-image:url\((.*?)\)" class="preview">.*?<a href="(.*?)">/g;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const [, title, authorLink, author, themeLink, theme, , totalDownloads, previewImage, link] = match;

    const result = {
      title: title.trim() || 'Tidak diketahui',
      authorLink: `https://www.dafont.com/${authorLink.trim()}` || 'Tidak diketahui',
      author: author.trim() || 'Tidak diketahui',
      themeLink: `https://www.dafont.com/${themeLink.trim()}` || 'Tidak diketahui',
      theme: theme.trim() || 'Tidak diketahui',
      totalDownloads: totalDownloads.trim().replace(/[^0-9]/g, '') || 'Tidak diketahui',
      previewImage: `https://www.dafont.com${previewImage.trim()}` || 'Tidak diketahui',
      link: `https://www.dafont.com/${link.trim()}` || 'Tidak diketahui',
    };

    results.push(result);
  }

  return results;
}

async function downloadDafont(link) {
  const response = await fetch(link);
  const html = await response.text();
  const $ = cheerio.load(html);

  const getValue = (selector) => $(selector).text().trim();
  const getFilenames = () => $('.filename').toArray().map(element => $(element).text().trim());
  const getImage = () => 'https://www.dafont.com' + $('.preview').css('background-image').replace(/^url\(["']?|['"]?\)$/g, '');
  const getDownloadLink = () => $('a.dl').attr('href') ? 'http:' + $('a.dl').attr('href') : '';

  return {
    title: getValue('.lv1left.dfbg strong'),
    author: getValue('.lv1left.dfbg a'),
    theme: getValue('.lv1right.dfbg a:last-child'),
    totalDownloads: getValue('.lv2right .light').replace(/\D/g, ''),
    filename: getFilenames(),
    image: getImage(),
    note: $('[style^="border-left"]').text().trim().replace("Note of the author", "").trim(),          
    download: getDownloadLink(),
  };
}

async function getFileDetails(url) {
  const response = await fetch(url);
  const contentType = response.headers.get('content-type');
  const mimeType = mime.contentType(contentType);
  const extension = mime.extension(contentType);

  return {
    url: url,
    mimeType: await mimeType,
    fileFormat: '.' + await extension
  };
}

function formatNumber(num) {
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  const numString = Math.abs(num).toString();
  const numDigits = numString.length;

  if (numDigits <= 3) {
    return numString;
  }

  const suffixIndex = Math.floor((numDigits - 1) / 3);
  let formattedNum = (num / Math.pow(1000, suffixIndex)).toFixed(1);
  
  if (formattedNum.endsWith('.0')) {
    formattedNum = formattedNum.slice(0, -2);
  }

  return formattedNum + suffixes[suffixIndex];
}