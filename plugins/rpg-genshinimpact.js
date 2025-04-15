import { promises as fs } from 'fs';
import path from 'path';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;

const dataPath = path.join(process.cwd(), 'src', 'genshinimpact.json');

async function loadData() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        const defaultData = {};
        await saveData(defaultData);
        return defaultData;
    }
}

async function saveData(data) {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

function getCurrentDate(timezone) {
    const offset = timezone === 'WIB' ? 7 : 9;
    return new Date(new Date().toLocaleString('en-US', { timeZone: `Etc/GMT-${offset}` })).toISOString().split('T')[0];
}

function regenerateHP(user) {
    const now = Date.now();
    if (!user.rpg.lastRegen) user.rpg.lastRegen = now;
    const baseInterval = 10 * 60 * 1000;
    const regenReduction = Math.min(0.5, (user.rpg.level - 1) * 0.015);
    const regenInterval = baseInterval * (1 - regenReduction);
    const elapsed = now - user.rpg.lastRegen;
    const regenCycles = Math.floor(elapsed / regenInterval);
    if (regenCycles > 0 && user.rpg.hp < user.rpg.maxHp) {
        const regenAmount = Math.floor(user.rpg.maxHp * 0.05) * regenCycles;
        user.rpg.hp = Math.min(user.rpg.maxHp, user.rpg.hp + regenAmount);
        user.rpg.lastRegen = now - (elapsed % regenInterval);
    }
}

function getHPStatus(user) {
    const now = Date.now();
    const baseInterval = 10 * 60 * 1000;
    const regenReduction = Math.min(0.5, (user.rpg.level - 1) * 0.015);
    const regenInterval = baseInterval * (1 - regenReduction);
    const hpPercentage = (user.rpg.hp / user.rpg.maxHp) * 100;
    const remainingHP = user.rpg.maxHp - user.rpg.hp;
    const regenAmount = user.rpg.maxHp * 0.05;
    const cyclesToFull = Math.ceil(remainingHP / regenAmount);
    const timeToFull = cyclesToFull * (regenInterval / 60000);
    const elapsed = now - user.rpg.lastRegen;
    const nextRegenIn = (regenInterval - (elapsed % regenInterval)) / 60000;
    
    return {
        hpText: `${user.rpg.hp}/${user.rpg.maxHp} (${hpPercentage.toFixed(2)}%)`,
        regenText: user.rpg.hp >= user.rpg.maxHp 
            ? "Full HP!" 
            : `Next Regen: ${nextRegenIn.toFixed(2)} menit | Full in: ${timeToFull.toFixed(2)} menit`
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addRandomSkill(user) {
    if (user.rpg.skills.length >= 3) return; // Maksimal 3 skill
    const availableSkills = user.rpg.allSkills.filter(skill => !user.rpg.skills.includes(skill));
    if (availableSkills.length === 0) return; // Kalo udah gak ada skill baru
    const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    user.rpg.skills.push(randomSkill);
}

let handler = async (m, { conn, args, text }) => {
    let globalData = await loadData();
    let user = globalData[m.sender] || {};

    const defaultRPG = {
        hero: null,
        level: 1,
        xp: 0,
        gold: 100,
        hp: 100,
        maxHp: 100,
        atk: 10,
        def: 5,
        skills: [],
        allSkills: [],
        dungeonWins: 0,
        lastRegen: Date.now(),
        timezone: null,
        lastQuest: null,
        equippedWeapon: null,
        inventory: []
    };

    if (!user.rpg) {
        user.rpg = { ...defaultRPG };
    } else {
        user.rpg = { ...defaultRPG, ...user.rpg };
        if (user.rpg.equippedWeapon === undefined) user.rpg.equippedWeapon = null;
        if (user.rpg.inventory === undefined) user.rpg.inventory = [];
        if (user.rpg.allSkills === undefined) user.rpg.allSkills = [];
    }

    regenerateHP(user);
    globalData[m.sender] = user;
    await saveData(globalData);

    const skillProgression = {
        mage: [
            'fireball', 'iceblast', 'thunderstrike', 'meteor shower', 'frost nova',
            'chain lightning', 'arcane burst', 'blizzard', 'flame wave', 'storm call',
            'shadow bolt', 'lightning orb', 'ice shard', 'firestorm', 'thunder clap',
            'mana shield', 'teleport', 'gravity well', 'energy drain', 'elemental fury'
        ],
        fighter: [
            'slash', 'powerstrike', 'berserk', 'whirlwind', 'shield slam',
            'rage blow', 'dual strike', 'battle cry', 'piercing thrust', 'hammer smash',
            'counterattack', 'blinding slash', 'fury spin', 'iron fist', 'war stomp',
            'defensive stance', 'charge', 'vital strike', 'bloodlust', 'execution'
        ],
        marksman: [
            'headshot', 'rapidfire', 'snipe', 'arrow rain', 'explosive shot',
            'poison dart', 'multi-shot', 'piercing arrow', 'eagle eye', 'trap shot',
            'shadow arrow', 'barrage', 'wind shot', 'critical aim', 'frost arrow',
            'stealth shot', 'homing arrow', 'sniper stance', 'scatter shot', 'bullseye'
        ],
        tank: [
            'shieldbash', 'taunt', 'fortify', 'iron wall', 'ground smash',
            'bulwark', 'provoke', 'stone skin', 'bash combo', 'deflector',
            'war shield', 'staggering blow', 'endurance', 'shockwave', 'armor up',
            'reflect', 'hold the line', 'titan stance', 'earth guard', 'unbreakable'
        ]
    };

    const weapons = {
        mage: {
            rare: [
                { name: "Oak Staff", atk: 6, def: 1 },
                { name: "Moon Wand", atk: 8, def: 0 },
                { name: "Ember Rod", atk: 7, def: 2 }
            ],
            epic: [
                { name: "Crystal Wand", atk: 16, def: 4 },
                { name: "Storm Scepter", atk: 18, def: 3 },
                { name: "Frost Staff", atk: 15, def: 5 }
            ],
            legendary: [
                { name: "Star Scepter", atk: 32, def: 12 },
                { name: "Eclipse Staff", atk: 35, def: 10 },
                { name: "Aether Wand", atk: 30, def: 14 }
            ]
        },
        fighter: {
            rare: [
                { name: "Iron Sword", atk: 5, def: 2 },
                { name: "Steel Axe", atk: 7, def: 1 },
                { name: "Bronze Mace", atk: 6, def: 3 }
            ],
            epic: [
                { name: "Dragon Blade", atk: 15, def: 5 },
                { name: "Rune Axe", atk: 17, def: 4 },
                { name: "War Hammer", atk: 16, def: 6 }
            ],
            legendary: [
                { name: "Excalibur", atk: 30, def: 10 },
                { name: "Titan Cleaver", atk: 33, def: 9 },
                { name: "Mjolnir", atk: 32, def: 11 }
            ]
        },
        marksman: {
            rare: [
                { name: "Steel Bow", atk: 7, def: 0 },
                { name: "Oak Crossbow", atk: 6, def: 1 },
                { name: "Iron Longbow", atk: 5, def: 2 }
            ],
            epic: [
                { name: "Wind Crossbow", atk: 18, def: 3 },
                { name: "Shadow Bow", atk: 16, def: 4 },
                { name: "Flame Arbalest", atk: 17, def: 2 }
            ],
            legendary: [
                { name: "Phoenix Bow", atk: 35, def: 8 },
                { name: "Storm Slinger", atk: 33, def: 9 },
                { name: "Eagle Crossbow", atk: 34, def: 7 }
            ]
        },
        tank: {
            rare: [
                { name: "Iron Shield", atk: 4, def: 3 },
                { name: "Steel Buckler", atk: 5, def: 2 },
                { name: "Bronze Guard", atk: 3, def: 4 }
            ],
            epic: [
                { name: "Fortress Shield", atk: 14, def: 6 },
                { name: "Stone Wall", atk: 13, def: 7 },
                { name: "Iron Bastion", atk: 15, def: 5 }
            ],
            legendary: [
                { name: "Aegis Shield", atk: 28, def: 14 },
                { name: "Titan Wall", atk: 30, def: 12 },
                { name: "Guardian Bulwark", atk: 29, def: 13 }
            ]
        }
    };

    if (!args[0]) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
        let oya = `✨ Halo Sensei! Selamat datang di GenshinImpact! ✨\n\n🌟 Pilih menu di bawah ya:\n🌸 .genshinimpact create - Buat hero baru\n🌿 .genshinimpact dungeon - Tantang dungeon\n🌞 .genshinimpact quest - Ambil misi harian\n🎰 .genshinimpact gacha - Gacha weapon\n🗡️ .genshinimpact equip - Pasang weapon\n❌ .genshinimpact unequip - Lepas weapon`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© DE4YOU YT 🌟" },
                            header: {
                                title: "",
                                subtitle: "Menu",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/Ch6vbCFje6sHlTfRnGifbl"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: "© Takanashi Hoshino"
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ Takanashi Hoshino ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/llkxbm.jpg",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Menu 🌟",
                                        sections: [{
                                            title: "List Menu",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Create Hero", description: "Bikin hero baru", id: ".genshinimpact create" },
                                                { header: "", title: "Profile", description: "Cek profil hero", id: ".genshinimpact profile" },
                                                { header: "", title: "Skills", description: "Liat skill hero", id: ".genshinimpact skill" },
                                                { header: "", title: "Upskill", description: "Upgrade skill hero", id: ".genshinimpact upskill" },
                                                { header: "", title: "Dungeon", description: "Masuk dungeon", id: ".genshinimpact dungeon" },
                                                { header: "", title: "Quest", description: "Ambil misi harian", id: ".genshinimpact quest" },
                                                { header: "", title: "Gacha", description: "Gacha weapon baru", id: ".genshinimpact gacha" },
                                                { header: "", title: "Equip", description: "Pasang weapon", id: ".genshinimpact equip" },
                                                { header: "", title: "Unequip", description: "Lepas weapon", id: ".genshinimpact unequip" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    let command = args[0].toLowerCase();

    if (command === 'create') {
        if (user.rpg.hero) return m.reply('🚫 Sensei udah punya hero nih! Cek di .genshinimpact profile ya! 🌟');
        
        let heroType = args[1] ? args[1].toLowerCase() : '';
        let timezone = args[2] ? args[2].toUpperCase() : '';
        let heroes = {
            mage: { hp: 80, atk: 20, def: 5, skills: [], allSkills: skillProgression.mage },
            fighter: { hp: 120, atk: 15, def: 10, skills: [], allSkills: skillProgression.fighter },
            marksman: { hp: 90, atk: 18, def: 7, skills: [], allSkills: skillProgression.marksman },
            tank: { hp: 150, atk: 10, def: 15, skills: [], allSkills: skillProgression.tank }
        };

        if (!heroType) {
            let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
            let oya = `🌟 Pilih tipe hero buat petualangan Sensei! 🌟\n\nContoh:\n🌸 .genshinimpact create mage WIB\n> Buat hero Mage pake WIB!`;
            let msg = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: oya },
                                footer: { text: "© DE4YOU YT 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Create Hero",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/Ch6vbCFje6sHlTfRnGifbl"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: "© Takanashi Hoshino"
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ Takanashi Hoshino ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/llkxbm.jpg",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Pilih Hero 🌟",
                                            sections: [{
                                                title: "Tipe Hero",
                                                highlight_label: "RPG",
                                                rows: [
                                                    { header: "", title: "Mage", description: "HP 80, ATK 20, DEF 5", id: ".genshinimpact create mage" },
                                                    { header: "", title: "Fighter", description: "HP 120, ATK 15, DEF 10", id: ".genshinimpact create fighter" },
                                                    { header: "", title: "Marksman", description: "HP 90, ATK 18, DEF 7", id: ".genshinimpact create marksman" },
                                                    { header: "", title: "Tank", description: "HP 150, ATK 10, DEF 15", id: ".genshinimpact create tank" }
                                                ]
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
            return;
        }

        if (!heroes[heroType]) return m.reply('🚫 Pilih hero yang bener ya, Sensei: mage, fighter, marksman, tank! 🌟');

        if (!timezone) {
            let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
            let oya = `🌟 Pilih zona waktu Sensei dulu ya! 🌟\n\nContoh:\n🌸 .genshinimpact create ${heroType} WIB\n> Pake WIB (UTC+7)\n🌿 .genshinimpact create ${heroType} WIT\n> Pake WIT (UTC+9)`;
            let msg = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: oya },
                                footer: { text: "© DE4YOU YT 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Pilih Zona Waktu",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/Ch6vbCFje6sHlTfRnGifbl"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: "© Takanashi Hoshino"
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ Takanashi Hoshino ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/llkxbm.jpg",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Pilih Zona Waktu 🌟",
                                            sections: [{
                                                title: "Zona Waktu",
                                                highlight_label: "RPG",
                                                rows: [
                                                    { header: "", title: "WIB", description: "Waktu Indonesia Barat (UTC+7)", id: `.genshinimpact create ${heroType} WIB` },
                                                    { header: "", title: "WIT", description: "Waktu Indonesia Timur (UTC+9)", id: `.genshinimpact create ${heroType} WIT` }
                                                ]
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
            return;
        }

        if (!['WIB', 'WIT'].includes(timezone)) return m.reply('🚫 Zona waktu cuma WIB atau WIT ya, Sensei! 🌟');

        user.rpg.hero = heroType;
        user.rpg.maxHp = heroes[heroType].hp;
        user.rpg.hp = heroes[heroType].hp;
        user.rpg.atk = heroes[heroType].atk;
        user.rpg.def = heroes[heroType].def;
        user.rpg.skills = [];
        user.rpg.allSkills = heroes[heroType].allSkills;
        user.rpg.lastRegen = Date.now();
        user.rpg.timezone = timezone;

        addRandomSkill(user);

        globalData[m.sender] = user;
        await saveData(globalData);
        m.reply(`🎉 Hero Sensei berhasil dibuat!\n🌟 Tipe: ${heroType}\n⏰ Zona Waktu: ${timezone}\n✨ Skill awal: ${user.rpg.skills.join(', ')}\n🌠 Total skill yang bisa dipake: ${user.rpg.allSkills.length}\n💡 Skill bakal nambah otomatis tiap level up sampe maksimal 3!`);
    }

    if (!user.rpg.hero || !user.rpg.timezone) return m.reply('🚫 Sensei belum punya hero atau zona waktu nih! Bikin dulu pake .genshinimpact create ya! 🌟');

    if (command === 'profile') {
        let hpStatus = getHPStatus(user);
        let regenTime = Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15));
        let weaponInfo = user.rpg.equippedWeapon ? `${user.rpg.equippedWeapon.name} (ATK: ${user.rpg.equippedWeapon.atk}, DEF: ${user.rpg.equippedWeapon.def})` : "Belum equip weapon";
        let inventoryList = user.rpg.inventory.length > 0 ? user.rpg.inventory.map(w => `${w.name} (ATK: ${w.atk}, DEF: ${w.def})`).join('\n') : "Kosong";
        let profile = `🌟 *Profil Sensei* 🌟\n` +
                      `👤 *Hero*: ${user.rpg.hero}\n` +
                      `⏰ *Zona Waktu*: ${user.rpg.timezone}\n` +
                      `📊 *Level*: ${user.rpg.level}\n` +
                      `✨ *XP*: ${user.rpg.xp}/${user.rpg.level * 100}\n` +
                      `💰 *Gold*: ${user.rpg.gold}\n` +
                      `❤️ *HP*: ${hpStatus.hpText}\n` +
                      `⏳ *Regen*: ${hpStatus.regenText}\n` +
                      `⚔️ *ATK*: ${user.rpg.atk}\n` +
                      `🛡️ *DEF*: ${user.rpg.def}\n` +
                      `🌠 *Active Skills*: ${user.rpg.skills.join(', ')}\n` +
                      `🏆 *Dungeon Wins*: ${user.rpg.dungeonWins}\n` +
                      `🗡️ *Equipped Weapon*: ${weaponInfo}\n` +
                      `🎒 *Inventory*: \n${inventoryList}`;
        m.reply(profile);
    }

    if (command === 'skill') {
        m.reply(`🌠 *Active Skills Sensei* 🌠\n✨ ${user.rpg.skills.join('\n✨ ')}\n\n💡 Skill nambah otomatis tiap level up, upgrade pake .genshinimpact upskill ya!`);
    }

    if (command === 'upskill') {
        let skill = args[1] ? args[1].toLowerCase() : '';
        if (!skill) {
            let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
            let oya = `🌟 Pilih skill aktif yang mau diupgrade, Sensei! 🌟\n\nSkill aktif:\n${user.rpg.skills.map(s => s).join('\n')}\n\nContoh:\n🌸 .genshinimpact upskill fireball\n> Naikin ATK pake 50 Gold!`;
            let rows = user.rpg.skills.map(s => ({
                header: "", title: s, description: `Upgrade ${s} (50 Gold)`, id: `.genshinimpact upskill ${s}`
            }));
            let msg = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: oya },
                                footer: { text: "© DE4YOU YT 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Upskill",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/Ch6vbCFje6sHlTfRnGifbl"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: "© Takanashi Hoshino"
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ Takanashi Hoshino ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/llkxbm.jpg",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Pilih Skill 🌟",
                                            sections: [{ title: "Active Skills", highlight_label: "RPG", rows }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
            return;
        }
        if (!user.rpg.skills.includes(skill)) return m.reply('🚫 Skill itu gak ada di skill aktif Sensei! Cek .genshinimpact skill ya! 🌟');
        if (user.rpg.gold < 50) return m.reply('💰 Gold Sensei kurang nih! Butuh 50 gold buat upgrade! 🌟');
        user.rpg.gold -= 50;
        user.rpg.atk += 5;
        globalData[m.sender] = user;
        await saveData(globalData);
        m.reply(`🎉 Skill *${skill}* berhasil diupgrade!\n⚔️ ATK Sensei naik +5, jadi *${user.rpg.atk}*!\n💰 Sisa Gold: ${user.rpg.gold}`);
    }

    if (command === 'gacha') {
        if (!args[1]) {
            let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
            let oya = `🎰 *Gacha Teyvat Keren Abis!* 🎰\n\nPilih tingkat gacha:\n🌟 Normal (30 Gold) - Zonk/XP/Gold\n✨ Rare (50 Gold) - Zonk/XP/Gold/Weapon Rare\n🌌 Epic (150 Gold) - Zonk/XP/Gold/Weapon Epic\n⚡ Legendary (500 Gold) - Zonk/XP/Gold/Weapon Legendary`;
            let msg = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: oya },
                                footer: { text: "© DE4YOU YT 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Gacha",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/Ch6vbCFje6sHlTfRnGifbl"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: "© Takanashi Hoshino"
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ Takanashi Hoshino ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/llkxbm.jpg",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Pilih Gacha 🌟",
                                            sections: [{
                                                title: "Tingkat Gacha",
                                                highlight_label: "RPG",
                                                rows: [
                                                    { header: "", title: "Normal", description: "30 Gold", id: ".genshinimpact gacha normal" },
                                                    { header: "", title: "Rare", description: "50 Gold", id: ".genshinimpact gacha rare" },
                                                    { header: "", title: "Epic", description: "150 Gold", id: ".genshinimpact gacha epic" },
                                                    { header: "", title: "Legendary", description: "500 Gold", id: ".genshinimpact gacha legendary" }
                                                ]
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
            return;
        }

        let gachaType = args[1].toLowerCase();
        let gachaCosts = { normal: 30, rare: 50, epic: 150, legendary: 500 };

        if (!gachaCosts[gachaType]) return m.reply('🚫 Pilih gacha yang bener ya, Sensei: normal, rare, epic, legendary! 🌟');
        if (user.rpg.gold < gachaCosts[gachaType]) return m.reply(`💰 Gold Sensei kurang nih! Butuh ${gachaCosts[gachaType]} gold buat gacha ${gachaType}! 🌟`);

        user.rpg.gold -= gachaCosts[gachaType];
        let result = '';

        const gachaOutcomes = {
            normal: [
                { type: 'zonk', chance: 0.4, message: '💥 Zonk! Sayur kolplay nih, Sensei, coba lagi ya!' },
                { type: 'xp', chance: 0.35, value: Math.floor(Math.random() * 10) + 1, message: '✨ Dapet XP dikit!' },
                { type: 'gold', chance: 0.25, value: Math.min(user.rpg.level <= 5 ? 1 : user.rpg.level <= 10 ? 15 : 25, gachaCosts[gachaType] - 1), message: '💰 Dapet Gold!' }
            ],
            rare: [
                { type: 'zonk', chance: 0.35, message: '💥 Zonk! Apes banget, Sensei, gacha lagi yuk!' },
                { type: 'xp', chance: 0.3, value: Math.floor(Math.random() * 20) + 5, message: '✨ Dapet XP!' },
                { type: 'gold', chance: 0.2, value: Math.min(user.rpg.level <= 5 ? 5 : user.rpg.level <= 10 ? 20 : 40, gachaCosts[gachaType] - 1), message: '💰 Dapet Gold!' },
                { type: 'weapon', chance: 0.15, pool: weapons[user.rpg.hero].rare, message: '🗡️ Dapet Weapon Rare!' }
            ],
            epic: [
                { type: 'zonk', chance: 0.3, message: '💥 Zonk! Sabar ya, Sensei, keberuntungan lagi nyanyi!' },
                { type: 'xp', chance: 0.25, value: Math.floor(Math.random() * 50) + 10, message: '✨ Dapet XP lumayan!' },
                { type: 'gold', chance: 0.2, value: Math.min(user.rpg.level <= 5 ? 10 : user.rpg.level <= 10 ? 50 : 100, gachaCosts[gachaType] - 1), message: '💰 Dapet Gold banyak!' },
                { type: 'weapon', chance: 0.25, pool: weapons[user.rpg.hero].epic, message: '🗡️ Dapet Weapon Epic!' }
            ],
            legendary: [
                { type: 'zonk', chance: 0.25, message: '💥 Zonk! Hoki Sensei lagi tidur, coba lagi!' },
                { type: 'xp', chance: 0.2, value: Math.floor(Math.random() * 100) + 20, message: '✨ Dapet XP gede!' },
                { type: 'gold', chance: 0.15, value: Math.min(user.rpg.level <= 5 ? 20 : user.rpg.level <= 10 ? 100 : 200, gachaCosts[gachaType] - 1), message: '💰 Dapet Gold melimpah!' },
                { type: 'weapon', chance: 0.4, pool: weapons[user.rpg.hero].legendary, message: '🗡️ Dapet Weapon Legendary!' }
            ]
        };

        const outcomes = gachaOutcomes[gachaType];
        const rand = Math.random();
        let cumulativeChance = 0;
        let outcome;

        for (let i = 0; i < outcomes.length; i++) {
            cumulativeChance += outcomes[i].chance;
            if (rand <= cumulativeChance) {
                outcome = outcomes[i];
                break;
            }
        }

        if (outcome.type === 'xp') {
            user.rpg.xp += outcome.value;
            result = `${outcome.message}\n✨ XP +${outcome.value}\n💰 Sisa Gold: ${user.rpg.gold}`;
        } else if (outcome.type === 'gold') {
            user.rpg.gold += outcome.value;
            result = `${outcome.message}\n💰 Gold +${outcome.value}\n💰 Sisa Gold: ${user.rpg.gold}`;
        } else if (outcome.type === 'weapon') {
            let newWeapon = outcome.pool[Math.floor(Math.random() * outcome.pool.length)];
            user.rpg.inventory.push(newWeapon);
            result = `${outcome.message}\n🗡️ *${newWeapon.name}*\n⚔️ ATK: ${newWeapon.atk}\n🛡️ DEF: ${newWeapon.def}\n💰 Sisa Gold: ${user.rpg.gold}\n✨ Masuk inventory, equip pake .genshinimpact equip ya!`;
        } else {
            result = `${outcome.message}\n💰 Sisa Gold: ${user.rpg.gold}`;
        }

        globalData[m.sender] = user;
        await saveData(globalData);
        m.reply(result);

        if (user.rpg.xp >= user.rpg.level * 100) {
            user.rpg.level += 1;
            user.rpg.xp = 0;
            user.rpg.maxHp += 20;
            user.rpg.hp = user.rpg.maxHp;
            user.rpg.atk += 5;
            user.rpg.def += 3;
            addRandomSkill(user);
            globalData[m.sender] = user;
            await saveData(globalData);
            m.reply(`🎉 *Level Up!* 🎉\n📊 Sensei sekarang *Level ${user.rpg.level}*\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n🌠 Skill aktif: ${user.rpg.skills.join(', ')}\n⏳ Regen HP jadi tiap ${Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15))} menit!`);
        }
    }

    if (command === 'equip') {
        if (!args[1]) {
            if (user.rpg.inventory.length === 0) return m.reply('🚫 Inventory Sensei kosong nih! Gacha dulu pake .genshinimpact gacha ya! 🌟');
            let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");
            let oya = `🗡️ *Pilih Weapon buat Equip, Sensei!* 🗡️\n\nInventory Sensei:\n${user.rpg.inventory.map((w, i) => `${i + 1}. ${w.name} (ATK: ${w.atk}, DEF: ${w.def})`).join('\n')}\n\nContoh: .genshinimpact equip 1`;
            let rows = user.rpg.inventory.map((w, i) => ({
                header: "", title: w.name, description: `ATK: ${w.atk}, DEF: ${w.def}`, id: `.genshinimpact equip ${i + 1}`
            }));
            let msg = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: oya },
                                footer: { text: "© DE4YOU YT 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Equip Weapon",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/Ch6vbCFje6sHlTfRnGifbl"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: "© Takanashi Hoshino"
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ Takanashi Hoshino ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/llkxbm.jpg",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Pilih Weapon 🌟",
                                            sections: [{ title: "Inventory", highlight_label: "RPG", rows }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
            return;
        }

        let weaponIndex = parseInt(args[1]) - 1;
        if (isNaN(weaponIndex) || weaponIndex < 0 || weaponIndex >= user.rpg.inventory.length) {
            return m.reply('🚫 Nomor weapon salah, Sensei! Cek inventory pake .genshinimpact equip ya! 🌟');
        }

        let selectedWeapon = user.rpg.inventory[weaponIndex];

        if (user.rpg.equippedWeapon) {
            user.rpg.atk -= user.rpg.equippedWeapon.atk;
            user.rpg.def -= user.rpg.equippedWeapon.def;
            user.rpg.inventory.push(user.rpg.equippedWeapon);
        }

        user.rpg.equippedWeapon = selectedWeapon;
        user.rpg.atk += selectedWeapon.atk;
        user.rpg.def += selectedWeapon.def;
        user.rpg.inventory.splice(weaponIndex, 1);

        globalData[m.sender] = user;
        await saveData(globalData);
        m.reply(`🗡️ *Weapon Berhasil Di-equip!* 🗡️\nSensei sekarang pake *${selectedWeapon.name}*\n⚔️ ATK jadi: ${user.rpg.atk}\n🛡️ DEF jadi: ${user.rpg.def}`);
    }

    if (command === 'unequip') {
        if (!user.rpg.equippedWeapon) return m.reply('🚫 Sensei gak lagi equip weapon nih! Equip dulu pake .genshinimpact equip ya! 🌟');

        user.rpg.atk -= user.rpg.equippedWeapon.atk;
        user.rpg.def -= user.rpg.equippedWeapon.def;
        user.rpg.inventory.push(user.rpg.equippedWeapon);
        let unequippedWeapon = user.rpg.equippedWeapon;
        user.rpg.equippedWeapon = null;

        globalData[m.sender] = user;
        await saveData(globalData);
        m.reply(`❌ *Weapon Dilepas!* ❌\n🗡️ *${unequippedWeapon.name}* kembali ke inventory\n⚔️ ATK jadi: ${user.rpg.atk}\n🛡️ DEF jadi: ${user.rpg.def}`);
    }

    if (command === 'dungeon') {
        if (user.rpg.hp === 0) return m.reply('🚫 HP Sensei 0 nih! Tunggu regenerasi dulu ya! 🌟');
        
        let enemies = [
            { name: 'Slime', hp: 30, atk: 5, def: 2, gold: 10, xp: 15, difficulty: 'easy' },
            { name: 'Treasure Hoarder', hp: 40, atk: 8, def: 3, gold: 15, xp: 20, difficulty: 'easy' },
            { name: 'Hilichurl', hp: 50, atk: 10, def: 5, gold: 20, xp: 30, difficulty: 'medium' },
            { name: 'Mitachurl', hp: 80, atk: 15, def: 8, gold: 35, xp: 50, difficulty: 'medium' },
            { name: 'Abyss Mage', hp: 100, atk: 20, def: 10, gold: 50, xp: 70, difficulty: 'medium' },
            { name: 'Ruin Guard', hp: 150, atk: 25, def: 15, gold: 100, xp: 150, difficulty: 'hard' },
            { name: 'Geovishap', hp: 200, atk: 30, def: 20, gold: 150, xp: 200, difficulty: 'hard' },
            { name: 'Fatui Skirmisher', hp: 180, atk: 35, def: 18, gold: 120, xp: 180, difficulty: 'hard' },
            { name: 'Ruin Hunter', hp: 300, atk: 40, def: 25, gold: 250, xp: 300, difficulty: 'extreme' },
            { name: 'Abyss Herald', hp: 350, atk: 45, def: 30, gold: 300, xp: 350, difficulty: 'extreme' }
        ];

        let availableEnemies = enemies.filter(enemy => {
            if (user.rpg.level <= 3) return enemy.difficulty === 'easy';
            if (user.rpg.level <= 7) return ['easy', 'medium'].includes(enemy.difficulty);
            if (user.rpg.level <= 15) return ['easy', 'medium', 'hard'].includes(enemy.difficulty);
            return true;
        });

        let enemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
        let enemyHp = enemy.hp;
        let totalAtk = user.rpg.atk;
        let totalDef = user.rpg.def;
        m.reply(`⚔️ Sensei masuk *Dungeon Teyvat*!\n👾 Ketemu *${enemy.name}*\n❤️ HP: ${enemyHp}\n⚔️ ATK: ${enemy.atk}\n🛡️ DEF: ${enemy.def}\n\n🌟 Pertarungan dimulai!`);

        let battleTurns = 0;
        let midTurn = false;

        while (user.rpg.hp > 0 && enemyHp > 0) {
            battleTurns++;
            let playerDmg = Math.max(0, totalAtk - enemy.def);
            let enemyDmg = Math.max(0, enemy.atk - totalDef);
            enemyHp -= playerDmg;
            user.rpg.hp -= enemyDmg;

            if (battleTurns === 1) {
                await conn.sendMessage(m.chat, { text: `💥 *Awal Pertarungan* 💥\n⚔️ Sensei kasih damage *${playerDmg}*\n👾 *${enemy.name}* sisa HP: ${enemyHp}\n🩸 *${enemy.name}* balas *${enemyDmg}*\n❤️ HP Sensei: ${user.rpg.hp}` });
                await sleep(30000);
            }
            else if (!midTurn && enemyHp <= enemy.hp / 2) {
                midTurn = true;
                await conn.sendMessage(m.chat, { text: `🔥 *Tengah Pertarungan* 🔥\n⚔️ Sensei kasih damage *${playerDmg}*\n👾 *${enemy.name}* sisa HP: ${enemyHp}\n🩸 *${enemy.name}* balas *${enemyDmg}*\n❤️ HP Sensei: ${user.rpg.hp}` });
                await sleep(30000);
            }
        }

        if (user.rpg.hp <= 0) {
            user.rpg.hp = 0;
            user.rpg.lastRegen = Date.now();
            globalData[m.sender] = user;
            await saveData(globalData);
            await conn.sendMessage(m.chat, { text: `💀 *Akhir Pertarungan* 💀\n👾 *${enemy.name}* menang!\n❤️ HP Sensei jadi *0*\n🌟 HP akan pulih 5% tiap ${Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15))} menit!` });
        } else {
            await conn.sendMessage(m.chat, { text: `🏆 *Akhir Pertarungan* 🏆\n⚔️ Sensei kalahin *${enemy.name}*!\n❤️ Sisa HP Sensei: ${user.rpg.hp}` });
            user.rpg.gold += enemy.gold;
            user.rpg.xp += enemy.xp;
            user.rpg.dungeonWins += 1;
            
            let bonusMultiplier = {
                'easy': 1,
                'medium': 1.2,
                'hard': 1.5,
                'extreme': 2
            }[enemy.difficulty];
            
            let bonusGold = Math.floor(enemy.gold * (bonusMultiplier - 1));
            let bonusXp = Math.floor(enemy.xp * (bonusMultiplier - 1));
            
            user.rpg.gold += bonusGold;
            user.rpg.xp += bonusXp;
            
            globalData[m.sender] = user;
            await saveData(globalData);
            
            let winMsg = `🎉 Sensei menang!\n💰 Dapet *${enemy.gold} Gold*` +
                        (bonusGold > 0 ? ` + *${bonusGold} Bonus Gold*` : '') +
                        `\n✨ Dapet *${enemy.xp} XP*` +
                        (bonusXp > 0 ? ` + *${bonusXp} Bonus XP*` : '') +
                        `\n🏅 Dungeon Wins: ${user.rpg.dungeonWins}`;
            m.reply(winMsg);

            if (user.rpg.xp >= user.rpg.level * 100) {
                user.rpg.level += 1;
                user.rpg.xp = 0;
                user.rpg.maxHp += 20;
                user.rpg.hp = user.rpg.maxHp;
                user.rpg.atk += 5;
                user.rpg.def += 3;
                addRandomSkill(user);
                globalData[m.sender] = user;
                await saveData(globalData);
                m.reply(`🎉 *Level Up!* 🎉\n📊 Sensei sekarang *Level ${user.rpg.level}*\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n🌠 Skill aktif: ${user.rpg.skills.join(', ')}\n⏳ Regen HP jadi tiap ${Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15))} menit!`);
            }
        }
    }

    if (command === 'quest') {
        const today = getCurrentDate(user.rpg.timezone);
        if (user.rpg.lastQuest === today) return m.reply(`🚫 Sensei udah ambil quest hari ini nih! Tunggu besok ya, mulai jam 00:00 ${user.rpg.timezone}! 🌟`);
        const questGold = 10;
        const questXP = 15;
        user.rpg.gold += questGold;
        user.rpg.xp += questXP;
        user.rpg.lastQuest = today;
        globalData[m.sender] = user;
        await saveData(globalData);
        m.reply(`🌞 *Quest Harian Selesai!* 🌞\n💰 Dapet *${questGold} Gold*\n✨ Dapet *${questXP} XP*\n📅 Bisa ambil lagi besok jam 00:00 ${user.rpg.timezone}!`);
        if (user.rpg.xp >= user.rpg.level * 100) {
            user.rpg.level += 1;
            user.rpg.xp = 0;
            user.rpg.maxHp += 20;
            user.rpg.hp = user.rpg.maxHp;
            user.rpg.atk += 5;
            user.rpg.def += 3;
            addRandomSkill(user);
            globalData[m.sender] = user;
            await saveData(globalData);
            m.reply(`🎉 *Level Up!* 🎉\n📊 Sensei sekarang *Level ${user.rpg.level}*\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n🌠 Skill aktif: ${user.rpg.skills.join(', ')}\n⏳ Regen HP jadi tiap ${Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15))} menit!`);
        }
    }
};

handler.help = ['genshinimpact'];
handler.tags = ['rpg'];
handler.command = /^(genshinimpact|genshin)$/i;
handler.register = true;
handler.limit = true;

export default handler;