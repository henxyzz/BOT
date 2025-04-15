//*<>AUTO CLOSE GROUP SAAT WAKTU SHOLAT<>*
//SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
//DON'T DELETE THIS WM!
//HAPUS WM MANDUL 7 TURUNAN 
//HAPUS WM=SDM RENDAH  
//`BAGI YANG RECODE DAN YANG MENYESUAIKAN LAGI NI CODE, MOHON UNTUK JANGAN DIHAPUS WM PERTAMA, ATAU BERI CREDIT LINK CH YANG SHARE CODE INI!`
//"aku janji tidak akan hapus wm ini, karena ini amanah harus saya pegang!"
//SELASA, 25 FEBRUARI 2025 16:15
import moment from 'moment-timezone';
import schedule from 'node-schedule';

export async function before(m) {
const timeZone = 'Asia/Jakarta';

//untuk waktu sesuaikan sama daerah kalian, ini daerah jakarta 
const prayerTimes = {
    '04:40': 'Subuh',
    '12:010': 'Dzuhur',
    '15:05': 'Ashar',
    '18:00': 'Maghrib',
    '19:10': 'Isya'
};

//untuk ini, ganti menjadi id grup kalian!!!
const groupChats = [
    'isi sendiri',
    '120363330747299667@g.us',
    '-',
    '-'
];

let groupStatus = {};
let originalGroupNames = {};
let lastClosedTime = {}; 

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const executeWithRetry = async (fn, retries = 3, delayMs = 5000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (error.message.includes("rate-overlimit") && attempt < retries - 1) {
                console.log(`[WARNING] Rate Limit! Coba lagi dalam ${delayMs / 1000} detik...`);
                await delay(delayMs);
            } else {
                throw error;
               }
            }
        }
    }
};

function ucapan() {
    const time = moment().tz(timeZone).hour();
    if (time >= 4 && time < 10) return "Selamat Pagi!";
    if (time >= 10 && time < 15) return "Selamat Siang!";
    if (time >= 15 && time < 18) return "Selamat Sore!";
    return "Selamat Malam!";
}

const checkPrayerTimes = async (conn) => {
    const currentTime = moment().tz(timeZone).format('HH:mm');

    if (prayerTimes[currentTime]) {
        const prayerName = prayerTimes[currentTime];
//hapus?=mandul https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
        for (const chatId of groupChats) {
       
            if (lastClosedTime[chatId] && moment().diff(lastClosedTime[chatId], 'minutes') < 10) {
                console.log(`[INFO] Grup ${chatId} sudah ditutup untuk ${prayerName}, abaikan.`);
                continue;
            }
// https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
            const groupMetadata = await executeWithRetry(() => conn.groupMetadata(chatId));
            const currentGroupName = groupMetadata.subject;

            if (!originalGroupNames[chatId]) {
                originalGroupNames[chatId] = currentGroupName;
            }

            if (groupStatus[chatId] !== 'closed') {
                await executeWithRetry(() => conn.groupSettingUpdate(chatId, 'announcement'));
                await executeWithRetry(() => conn.groupUpdateSubject(chatId, `${originalGroupNames[chatId]} (𝗖𝗟𝗢𝗦𝗘)`));
                await executeWithRetry(() => conn.sendMessage(chatId, {
                    text: `*[System Notice]*\n\n\`\`\`${ucapan()} Halo semuanya! Sistem grup WhatsApp akan ditutup sementara selama 10 menit karena sudah memasuki waktu ${prayerName}. Silakan istirahat sejenak dan nikmati waktu bersama keluarga atau melakukan aktivitas lainnya. Kami akan membuka kembali sistem grup ini setelah waktu ${prayerName}. Terima kasih atas pengertian dan kerjasamanya. Selamat beristirahat!\`\`\``
                }));

                groupStatus[chatId] = 'closed';
                lastClosedTime[chatId] = moment(); // Catat waktu terakhir grup ditutup

                setTimeout(async () => {
                    await executeWithRetry(() => conn.groupSettingUpdate(chatId, 'not_announcement'));
                    await executeWithRetry(() => conn.groupUpdateSubject(chatId, originalGroupNames[chatId]));
                    await executeWithRetry(() => conn.sendMessage(chatId, {
                        text: `*[System Notice]*\n\n\`\`\`${ucapan()} Sistem grup WhatsApp telah dibuka setelah waktu ${prayerName}. Semoga kita semua telah menjalankan ibadah dengan baik dan mendapatkan berkah di hari ini. Mari kita berbagi cerita, informasi, dan kebahagiaan bersama di grup ini. Selamat bergabung dan semoga kita memiliki waktu yang menyenangkan!\`\`\``
                    }));

                    groupStatus[chatId] = 'opened';
                }, 10 * 60 * 1000); 
//bagi yang recode dan menyesuaikan lagi ni code, mohon untuk jangan di hapus wm pertama, atau beri credit link ch yang share kode ini !
                
                await delay(2000);
            }
        }
    }
};


schedule.scheduleJob('* * * * *', () => {
    checkPrayerTimes(conn);
});
export const disabled = false;
//*<>AUTO CLOSE GROUP SAAT WAKTU SHOLAT<>*
//SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
//DON'T DELETE THIS WM!
//HAPUS WM MANDUL 7 TURUNAN 
//HAPUS WM=SDM RENDAH  
//`BAGI YANG RECODE DAN YANG MENYESUAIKAN LAGI NI CODE, MOHON UNTUK JANGAN DIHAPUS WM PERTAMA, ATAU BERI CREDIT LINK CH YANG SHARE CODE INI!`
//"aku janji tidak akan hapus wm ini, karena ini amanah harus saya pegang!"
//SELASA, 25 FEBRUARI 2025 16:15