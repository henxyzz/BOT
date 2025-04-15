/*
*<>KALENDER, SUPPORT NAMA BULAN, DAN JIKA TIDAK ADA QUERY MAKA AKAN KEKIRIM BULAN DEFAULT!!!<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
HAPUS WM=SDM RENDAH 
*BAGI YANG RECODE DAN YANG MENYESUAIKAN LAGI NI CODE, MOHON UNTUK JANGAN DIHAPUS WM PERTAMA, ATAU BERI CREDIT LINK CH YANG SHARE CODE INI!*
"aku janji tidak akan hapus wm ini"
SELASA, 07 JANUARI 2025 19:23
*/
import { createCanvas } from 'canvas';
import moment from 'moment-timezone';
//wm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
let handler = async (m, { conn, text }) => {
  const timezone = 'Asia/Jakarta';
  const currentDate = moment.tz(timezone);
  const currentMonth = currentDate.month(); //wm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const currentYear = currentDate.year();
  const today = currentDate.date();
//hapus=mandul https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  //wwwwmmmmm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const months = [
    'januari', 'februari', 'maret', 'april', 'mei', 'juni',
    'juli', 'agustus', 'september', 'oktober', 'november', 'desember',
  ];
  let queryMonth = months.findIndex((month) => month.toLowerCase() === text.toLowerCase());
  if (queryMonth === -1) queryMonth = currentMonth; //hapus?=mandul https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V

  //hapus wm?=sdm rendah https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const displayDate = moment.tz(timezone).month(queryMonth).startOf('month');
  const monthName = months[queryMonth];
  const year = currentYear;
//wwwmmmmm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const holidays = [
    { date: '2025-01-01', description: 'Tahun Baru 2025 Masehi' },
    { date: '2025-01-27', description: 'Isra Mikraj Nabi Muhammad SAW' },
    { date: '2025-01-29', description: 'Tahun Baru Imlek 2576 Kongzili' },
    { date: '2025-03-29', description: 'Hari Suci Nyepi Tahun Baru Saka 1947' },
    { date: '2025-03-31', description: 'Hari Raya Idulfitri 1446 Hijriah' },
    { date: '2025-04-01', description: 'Hari Raya Idulfitri 1446 Hijriah' },
    { date: '2025-04-18', description: 'Wafat Yesus Kristus' },
    { date: '2025-05-01', description: 'Hari Buruh Internasional' },
    { date: '2025-05-12', description: 'Hari Raya Waisak 2569 BE' },
    { date: '2025-05-29', description: 'Kenaikan Isa Almasih' },
    { date: '2025-06-01', description: 'Hari Lahir Pancasila' },
    { date: '2025-06-07', description: 'Hari Raya Iduladha 1446 Hijriah' },
    { date: '2025-06-27', description: 'Tahun Baru Islam 1447 Hijriah' },
    { date: '2025-08-17', description: 'Hari Kemerdekaan Republik Indonesia' },
    { date: '2025-09-05', description: 'Maulid Nabi Muhammad SAW' },
    { date: '2025-12-25', description: 'Hari Raya Natal' },
    { date: '2025-01-28', description: 'Cuti Bersama Tahun Baru Imlek' },
    { date: '2025-03-28', description: 'Cuti Bersama Hari Suci Nyepi' },
    { date: '2025-04-02', description: 'Cuti Bersama Idulfitri 1446 Hijriah' },
    { date: '2025-04-03', description: 'Cuti Bersama Idulfitri 1446 Hijriah' },
    { date: '2025-04-04', description: 'Cuti Bersama Idulfitri 1446 Hijriah' },
    { date: '2025-12-26', description: 'Cuti Bersama Hari Raya Natal' },
  ];
//hapus wm=sdm rendah https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const holidaysThisMonth = holidays.filter(
    (holiday) => moment(holiday.date).month() === queryMonth
  );
//hapus wm ini?=mandulll https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const daysInMonth = displayDate.daysInMonth();
  const firstDayOfMonth = displayDate.day();
  const canvasWidth = 700;
  const canvasHeight = 850; //wm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
//https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = '#000000';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';

  ctx.fillText(`${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`, canvasWidth / 2, 50);
//wwwmmmm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  daysOfWeek.forEach((day, index) => {
    ctx.fillStyle = day === 'Min' ? '#ff0000' : '#000000'; //wwwwmmmmm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    ctx.fillText(day, 100 + index * 80, 100);
  });
//https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  let x = 100;
  let y = 150;
//hapus?=mandul https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  for (let i = 0; i < firstDayOfMonth; i++) {
    x += 80;
  }
//https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  for (let date = 1; date <= daysInMonth; date++) {
    const currentDay = (firstDayOfMonth + date - 1) % 7;
//wwwmmm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    if (queryMonth === currentMonth && date === today) {
      ctx.beginPath();
      ctx.arc(x, y - 10, 30, 0, 2 * Math.PI); //hapus?=mandul https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
      ctx.strokeStyle = '#0000ff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();
    }
//https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    const holiday = holidaysThisMonth.find((holiday) => moment(holiday.date).date() === date);

    if (holiday || currentDay === 0) {
      ctx.fillStyle = '#ff0000'; //hapus wm?=sdm rendah https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    } else {
      ctx.fillStyle = '#000000';
    }

    ctx.fillText(date.toString(), x, y);

    x += 80;
    if ((date + firstDayOfMonth) % 7 === 0) {
      x = 100;
      y += 70;
    }
  }

  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  let textY = y + 70;
  holidaysThisMonth.forEach((holiday) => {
    ctx.fillStyle = '#ff0000';
    ctx.fillText(`${moment(holiday.date).format('DD MMMM YYYY')} - ${holiday.description}`, 50, textY);
    textY += 30;
  });
//hapus wm?=sdm rendah https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
  const buffer = canvas.toBuffer();
  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `kalender bulan: ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`,
  });
};
//hapus=mandul https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
handler.help = ['kalender [bulan]'];
handler.tags = ['tools'];
handler.command = ['kalender'];
//hapus wm=sdm rendah https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
export default handler;
//aku janji tidak akan hapus wm ini https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
/*
*<>KALENDER, SUPPORT NAMA BULAN, DAN JIKA TIDAK ADA QUERY MAKA AKAN KEKIRIM BULAN DEFAULT!!!<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
HAPUS WM=SDM RENDAH 
*BAGI YANG RECODE DAN YANG MENYESUAIKAN LAGI NI CODE, MOHON UNTUK JANGAN DIHAPUS WM PERTAMA, ATAU BERI CREDIT LINK CH YANG SHARE CODE INI!*
"aku janji tidak akan hapus wm ini"
SELASA, 07 JANUARI 2025 19:22
*/