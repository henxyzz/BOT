/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • WGL / WGP (WHATSGROUP LINK, KURANG LEBIH NYARI LINK GC MUNGKIN, AKU KURANG NGERTI WEBNY:V) *PLUGIN*
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l

Scrape: https://whatsapp.com/channel/0029Vb2mOzL1Hsq0lIEHoR0N/210
*/
import axios from 'axios';
import * as cheerio from 'cheerio';
const WGL = {
    async search(q) {
        const {
            data
        } = await axios.get('https://whatsgrouplink.com/?s=' + q);
        const $ = cheerio.load(data);

        const items = [];

        $('article').each((index, element) => {
            const image = $(element).find('img').attr('src');
            const date = $(element).find('time').text().trim();
            const title = $(element).find('.entry-title-link').text().trim();
            const link = $(element).find('a').attr('href');
            items.push({
                image,
                date,
                title,
                link
            });
        });

        return items;
    },
    async detail(q) {
        const {
            data
        } = await axios.get(q);
        const $ = cheerio.load(data);

        const items = {};

        const str = $('.entry-content').html();

        let aha = str.split('<div style="margin-top: 0px; margin-bottom: 0px;" class="sharethis-inline-share-buttons"></div>')[1];
        items.desc = cheerio.load(aha.split('<h3')[0]).text().replace(/\n+/g, '\n').trim();
        let anu = ['rules', 'links', 'how', 'related'];
        $('.entry-content ul').each((i, e) => {
            let iye = [];
            $(e).find('li').each((j, d) => {
                if (i % 2 == 0) iye.push($(d).text())
                else {
                    let blox = {};
                    blox.title = $(d).text().split('–')[0].trim();
                    blox.link = $(d).find('a').attr('href');
                    iye.push(blox);
                }
            })
            items[anu[i]] = iye;
        })

        return items;
    }
}

let handler = async (m, {
    args,
    command,
    conn
}) => {
    let subcmd = args[0];

    if (!subcmd) return m.reply("Gunakan *wgp search kata kunci* atau *wgp detail URL*");

    if (subcmd === 'search') {
        let query = args.slice(1).join(" ");
        if (!query) return m.reply("Masukkan kata kunci untuk pencarian.");

        let hasil = await WGL.search(query);
        if (!hasil || hasil.length === 0) return m.reply("Gak nemu hasilnya.");

        let psan = "*🔍 Hasil Pencarian:*\n\n";
        hasil.forEach((item, index) => {
            psan += `*${index + 1}.* ${item.title}\n  ${item.link}\n\n`;
        });

        m.reply(psan);

    } else if (subcmd === 'detail') {
        let url = args[1];
        if (!url) return m.reply("Masukkan URL untuk detail grup.");

        let ditel = await WGL.detail(url);
        if (!ditel) return m.reply("Gagal mengambil detail grup.");

        let psan = `*🎬 Detail Grup:*\n\n`;
        psan += `*🔸 Deskripsi* : ${ditel.desc}\n\n`;

        ['rules', 'links', 'how', 'related'].forEach((section) => {
            if (ditel[section].length) {
                psan += `*🔸 ${section.charAt(0).toUpperCase() + section.slice(1)}* :\n`;
                ditel[section].forEach(item => {
                    psan += `- ${item.title || item}\n  ${item.link || ''}\n`;
                });
            }
        });

        m.reply(psan);

    } else {
        m.reply("Gunakan *wgp search kata kunci* atau *wgp detail URL*");
    }
};

handler.help = ['wgp search kata kunci', 'wgp detail URL'];
handler.tags = ['group'];
handler.command = /^wgp$/i;
handler.register = true
export default handler;