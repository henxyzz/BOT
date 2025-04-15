/*
Jangan Hapus Wm Bang 

*PUBG Search Weapon  Plugins Esm*

Mungkin Ada bug Silahkan Di Perbaiki Jika Kurang Rapi Atau Bagaimana 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i
*/

import axios from 'axios';
import cheerio from 'cheerio';
import similarity from 'similarity';
import didYouMean from 'didyoumean';

async function PubgWeaponData() {
    const url = 'https://liquipedia.net/pubgmobile/Portal:Weapons';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const weapons = [];

    $('h2').each((index, element) => {
        const category = $(element).find('span.mw-headline').text();
        $(element).next('div').find('.template-box').each((i, el) => {
            const weapon = {};
            weapon.category = category;
            weapon.name = $(el).find('.infobox-header a').text();
            const imagePath = $(el).find('.infobox-image img').attr('src');
            weapon.image = imagePath ? `https://liquipedia.net${imagePath}` : '';
            weapon.type = $(el).find('.infobox-cell-2.infobox-description').eq(0).next().text() || '';
            weapon.ammoType = $(el).find('.infobox-cell-2.infobox-description').eq(1).next().text() || '';
            weapon.baseDamage = $(el).find('.infobox-cell-2.infobox-description').eq(2).next().text() || '';
            weapon.magazineSize = $(el).find('.infobox-cell-2.infobox-description').eq(3).next().text() || '';
            weapon.reloadTime = $(el).find('.infobox-cell-2.infobox-description').eq(4).next().text() || '';
            weapon.fireRate = $(el).find('.infobox-cell-2.infobox-description').eq(5).next().text() || '';
            weapon.firingMode = $(el).find('.infobox-cell-2.infobox-description').eq(6).next().html()?.replace(/<br\s*\/?>/g, ' ').trim() || '';

            weapons.push(weapon);
        });
    });

    return weapons;
}

async function searchPubgWeapon(weaponName) {
    const weapons = await PubgWeaponData();
    const foundWeapons = weapons.filter(weapon => weapon.name.toLowerCase().includes(weaponName.toLowerCase()));

    if (foundWeapons.length > 0) {
        return foundWeapons;
    } else {
        const suggestions = weapons.map(weapon => weapon.name);
        const closestMatch = didYouMean(weaponName, suggestions);

        return {
            message: 'Tidak ditemukan senjatanya bro',
            suggestion: closestMatch || null
        };
    }
}

let handler = async (m, { text, conn }) => {
    if (!text) return m.reply('Masukkan nama senjata yang ingin dicari!');

    let result = await searchPubgWeapon(text);
    if (Array.isArray(result) && result.length > 0) {
        for (let weapon of result) {
            let message = `*Weapon Name:* ${weapon.name}\n`;
            
            message += `*Category:* ${weapon.category}\n`;
            
            message += `*Type:* ${weapon.type}\n`;
            message += `*Jenis Ammo:* ${weapon.ammoType}\n`;
            
            message += `*Base Damage:* ${weapon.baseDamage}\n`;
            
            message += `*Magazine:* ${weapon.magazineSize}\n`;
            
            message += `*Reload Time:* ${weapon.reloadTime}\n`;
            
            message += `*Fire Rate:* ${weapon.fireRate}\n`;
            
            message += `*Firing Mode:* ${weapon.firingMode}\n\n`;
            if (weapon.image) {
                await conn.sendMessage(m.chat, { image: { url: weapon.image }, caption: message }, { quoted: m });
            } else {
                m.reply(message);
            }
        }
    } else {
        let msg = result.message;
        if (result.suggestion) msg += `\nMungkin maksudmu: *${result.suggestion}*?`;
        m.reply(msg);
    }
};

handler.help = ['pubgweapon'];
handler.tags = ['search']
handler.command = ['pubgweapon'];
handler.limit = false;

export default handler;