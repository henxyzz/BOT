/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Twitter Dl
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l

scrape by : sxyz
*/
import axios from "axios";
import BodySender from "form-data";
import * as cheerio from "cheerio";

const BASE_URL = "https://savetwitter.net";
const AJAX_URL = "/api/ajaxSearch";

let handler = async (m, {
    conn,
    text
}) => {
    if (!text) return await m.reply("url?");

    try {
        let media = await savetwitter(text);
        if (media.error) return await m.reply("hasil takda!");

        for (let item of media) {
            await conn.sendMessage(m.chat, {
                [item.type]: {
                    url: item.download
                },
                caption: `Download ${item.type} kualitas ${item.quality || 'mayan'}`
            });
        }
    } catch (e) {
        await m.reply("ada error saat unduh media.");
    }
};

async function savetwitter(url) {
    let d = new BodySender();
    d.append("q", url);
    d.append("lang", "en");
    d.append("cftoken", "");
    let headers = {
        ...d.getHeaders()
    };
    let {
        data: html
    } = await axios.post(BASE_URL + AJAX_URL, d, {
        headers
    });

    const $ = cheerio.load(html.data);
    if ($(".photo-list").length) {
        const images = [];
        $(".photo-list .download-items__thumb img").each((i, el) => {
            images.push({
                type: "image",
                thumb: $(el).attr("src"),
                download: $(el).closest(".download-items").find("a").attr("href")
            });
        });
        return images;
    }

    if ($(".tw-video").length) {
        const videos = [];
        $(".tw-video .tw-right .dl-action a").each((i, el) => {
            videos.push({
                type: "video",
                quality: $(el).text().trim().replace("Download MP4", "").trim(),
                download: $(el).attr("href")
            });
        });
        return videos;
    }

    return {
        error: "Takda Media"
    };
}

handler.help = ['twdl url'];
handler.tags = ['downloader'];
handler.command = /^twdl$/i;

export default handler;