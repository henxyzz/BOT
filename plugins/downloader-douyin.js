/*
Jangan Hapus Wm Bang 

*Douyin Download  Plugins Esm*


*[Sumber]*
https://whatsapp.com/channel/0029VavBc6uHAdNdbgCgOK0k

*[Sumber Scrape]*

https://whatsapp.com/channel/0029Va8b0s8G3R3jDBfpja0a/194
*/

import axios from "axios";

async function douyin(url) {
	const api = "https://lovetik.app/api/ajaxSearch";
	const payload = { q: url, lang: "en" };

	try {
		const { data } = await axios.post(api, payload, {
			headers: {
				accept: "*/*",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				origin: "https://lovetik.app",
				priority: "u=1, i",
				referer: "https://lovetik.app/en",
				"sec-ch-ua":
					'"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"user-agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0",
				"x-requested-with": "XMLHttpRequest",
			},
			transformRequest: [
				(data) =>
					Object.keys(data)
						.map(
							(key) =>
								`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
						)
						.join("&"),
			],
		});

		const extractData = data.data;
		const downloadUrls =
			extractData.match(
				/https:\/\/(dl\.snapcdn\.app|v\d+-cold\.douyinvod\.com)\/get\?token=[^"]+/g,
			) || [];

		return {
			downloadUrls,
		};
	} catch {
		return { error: "Gagal mengambil video, coba lagi nanti." };
	}
}

let handler = async (m, { conn, args }) => {
	if (!args[0]) return m.reply("Mana link videonya?");
	m.reply("Tunggu sebentar...");
	let result = await douyin(args[0]);
	if (result.error) return m.reply(result.error);
	let { downloadUrls } = result;
	if (!downloadUrls.length) return m.reply("Gagal mengambil video.");

	await conn.sendMessage(
		m.chat,
		{
			video: { url: downloadUrls[0] },
		},
	);
};

handler.help = ["douyin"];
handler.tags = ['downloader']
handler.command = ["douyin", "tiktokcn"];

export default handler;