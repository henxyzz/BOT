/* INS DEV */


let axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    if(!imageUrl) throw 'masukkan link foto nya'
    let result = await uploadImageToAinSFX
    await m.reply`ni wak ${result}`
    
  }

handler.command = handler.help = ['toainsfx','ainsfx'];
handler.tags = ['tools'];
handler.premium = false;
handler.limit = true;

export default handler

async function uploadImageToAinSFX(imageUrl) {
  const url = 'https://ins.neastooid.xyz/api/ai/ainsfxv2';
  const payload = {
    imageUrl: imageUrl
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const uploadedUrl = response.data.uploadedUrl;
    return uploadedUrl || null;
  } catch (error) {
    console.error('Error uploading image to AniSFX:', error);
    return null;
  }
}

return uploadImageToAinSFX(imageUrl)