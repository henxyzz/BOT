/*
- Fitur: Lookup Domain
- Info: Lookup adalah proses mencari informasi atau data tertentu berdasarkan suatu input. Dalam konteks DNS itu berarti mencari informasi tentang suatu domain, seperti alamat IP, MX record (email server), CNAME, dan lainnya😁
- Type: Plugins `ESM`
- By: HamzDxD

- [ `SUMBER CODE` ]
- https://whatsapp.com/channel/0029Vb1NWzkCRs1ifTWBb13u
*/

async function lookup(domain) {
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/dnslookup?domain=${domain}`,
      {
        headers: { 'X-Api-Key': 'E4/gdcfciJHSQdy4+9+Ryw==JHciNFemGqOVIbyv' },
        contentType: 'application/json'
      }
    );
    const dataText = await response.text();
    return JSON.stringify(JSON.parse(dataText), null, 2);
  } catch (error) {
    console.error(error);
    const fallbackResponse = await fetch(
      `https://api.hackertarget.com/dnslookup/?q=${domain}`
    );
    return fallbackResponse.text();
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw 'Masukkan Domain/Sub Domain!\n\n*Contoh:* botcahx.live';
  }
  const domain = text.replace(/^https?:\/\//, '');
  const result = await lookup(domain);
  m.reply(`*Hasil Dns Lookup ${text} :*\n\n${result}`);
};

handler.help = ['lookup', 'dns'];
handler.tags = ['information'];
handler.command = /^(dns|lookup|dnslookup|hacktarget)$/i;
handler.limit = true

export default handler