import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.config = {
    /*============== INFO LINK ==============*/
    instagram: 'https://www.instagram.com/kumaha_lamun_aing_nyerenteng/',
    github: 'https://github.com/henxyzz',
    group: 'https://chat.whatsapp.com/JWFAgwpHbuw9hiwoO7UKWM',
    website: 'https://chat.whatsapp.com/JWFAgwpHbuw9hiwoO7UKWM',
    saluran: 'https://chat.whatsapp.com/JWFAgwpHbuw9hiwoO7UKWM',

    /*============== PAYMENT ==============*/
    dana: '085866034212',
    ovo: '-',
    gopay: '-',
    pulsa: '-',

    /*============== STAFF ==============*/
    owner: [
        ['6285866034212', 'X', true]

    ],

    /*============= PAIRING =============*/
    pairingNumber: "6285723701289",
    pairingAuth: true,

    /*============== API ==============*/
    APIs: {
        lol: 'https://api.lolhuman.xyz',
        rose: 'https://api.itsrose.rest',
        xzn: 'https://skizoasia.xyz',
        betabotz : 'https://api.betabotz.eu.org',
    },

    APIKeys: {
        'https://api.lolhuman.xyz': 'de4you',
        'https://api.itsrose.rest': 'Rk-f5d4b183e7dd3dd0a44653678ba5107c',
        'https://skizoasia.xyz': 'de4you',
        'https://api.betabotz.eu.org': 'de4you',
    },

    /*============== TEXT ==============*/
    watermark: 'Nakano - MD',
    author: 'Nakano',
    loading: 'Mohon ditunggu...',
    errorMsg: 'Error :)',

    stickpack: 'Made With',
    stickauth: 'Nakano - MD Sewa? Chat : 6285723701289',

    digi: {
        username: "",
        apikey: ""
    },

    OK: {
        ID: "_",
        Pin: "_",
        Pass: "_",        
        Apikey: "_"
    },
    
    taxRate: 0.05,
    taxMax: 2000
}

global.loading = (m, conn, back = false) => {
    if (!back) {
        return conn.sendReact(m.chat, "🕒", m.key)
    } else {
        return conn.sendReact(m.chat, "", m.key)
    }
}

/*============== EMOJI ==============*/
global.rpg = {
    emoticon(string) {
        string = string.toLowerCase()
        let emot = {
            level: '📊',
            limit: '🎫',
            health: '❤️',
            exp: '✨',
            atm: '💳',
            money: '💰',
            bank: '🏦',
            potion: '🥤',
            diamond: '💎',
            common: '📦',
            uncommon: '🛍️',
            mythic: '🎁',
            legendary: '🗃️',
            superior: '💼',
            pet: '🔖',
            trash: '🗑',
            armor: '🥼',
            sword: '⚔️',
            pickaxe: '⛏️',
            fishingrod: '🎣',
            wood: '🪵',
            rock: '🪨',
            string: '🕸️',
            horse: '🐴',
            cat: '🐱',
            dog: '🐶',
            fox: '🦊',
            robo: '🤖',
            dragon: '🐉',
            lion: '🦁',
            rhinoceros: '🦏',
            centaur: '🦄',
            kyubi: '🦊',
            griffin: '🦅',
            phonix: '🔥',
            wolf: '🐺',
            petfood: '🍖',
            iron: '⛓️',
            gold: '🪙',
            emerald: '❇️',
            upgrader: '🧰',
            bibitanggur: '🌱',
            bibitjeruk: '🌿',
            bibitapel: '☘️',
            bibitmangga: '🍀',
            bibitpisang: '🌴',
            anggur: '🍇',
            jeruk: '🍊',
            apel: '🍎',
            mangga: '🥭',
            pisang: '🍌',
            botol: '🍾',
            kardus: '📦',
            kaleng: '🏮',
            plastik: '📜',
            gelas: '🧋',
            chip: '♋',
            umpan: '🪱',
            skata: '🧩',
            bitcoin: '☸️',
            polygon: '☪️',
            dogecoin: '☯️',
            etherium: '⚛️',
            solana: '✡️',
            memecoin: '☮️',
            donasi: '💸',
            ammn: '⚖️',
            bbca: '💵',
            bbni: '💴',
            cuan: '🧱',
            bbri: '💶',
            msti: '📡',
            steak: '🥩',
            ayam_goreng: '🍗',
            ribs: '🍖',
            roti: '🍞',
            udang_goreng: '🍤',
            bacon: '🥓',
            gandum: '🌾',
            minyak: '🥃',
            garam: '🧂',
            babi: '🐖',
            ayam: '🐓',
            sapi: '🐮',
            udang: '🦐'
        }
        if (typeof emot[string] !== 'undefined') {
            return emot[string]
        } else {
            return ''
        }
    }
}

//------ JANGAN DIUBAH -----
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
