import similarity from "similarity";

const threshold = 0.72;

export async function before(m) {
  let id = m.chat;
  if (m.fromMe) return true;

  if (!(this.tebakheroml?.[id])) return;

  let json = JSON.parse(JSON.stringify(this.tebakheroml[id][1]));
  let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);

  if (isSurrender) {
    clearTimeout(this.tebakheroml[id][3]);
    delete this.tebakheroml[id];
    return m.reply('*Yah Menyerah :( !*');
  }

  if (m.text.toLowerCase() === json.name.toLowerCase().trim()) {
    global.db.data.users[m.sender].exp += this.tebakheroml[id][2];
    m.reply(`*Benar!*\n+${this.tebakheroml[id][2]} Money`);
    clearTimeout(this.tebakheroml[id][3]);
    delete this.tebakheroml[id];
  } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold) {
    m.reply(`*Dikit Lagii!*`);
  }

  return true;
}

export const exp = 0;

const buttontebakheroml = [
  ["tebakheroml", "/tebakheroml"]
];