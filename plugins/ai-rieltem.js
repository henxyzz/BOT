import axios from "axios";

async function aiRieltem(text) {
let payload = {
messages: [{
content: text,
role: "user"
}]
};

try {
let { data } = await axios.post("https://ai.riple.org/", payload, {
headers: {
"Content-Type": "application/json",
"Accept": "application/json",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
},
responseType: "stream"
});

return new Promise((resolve, reject) => {  
     let fullResponse = "";  

     data.on("data", (chunk) => {  
        let lines = chunk.toString().split("\n");  

        for (let line of lines) {  
           if (line.startsWith("data: ")) {  
              let jsonString = line.slice(6).trim();  

              if (jsonString === "[DONE]") {  
                 return resolve(fullResponse.trim());  
              }  

              try {  
                 let parsedData = JSON.parse(jsonString);  
                 let content = parsedData?.choices?.[0]?.delta?.content;  

                 if (content) {  
                    fullResponse += content;  
                 }  
              } catch (err) {  
                 reject(err);  
              }  
           }  
        }  
     });  

     data.on("error", (err) => reject(err));  
  });

} catch (error) {
throw new Error(error.message);
}
}

let handler = async (m, { conn, text }) => {
if (!text) return m.reply('⚠️ Masukkan pertanyaan yang ingin ditanyakan ke AI Rieltem!');

// Reaksi proses 🤖  
await conn.sendMessage(m.chat, {  
    react: { text: "🤖", key: m.key }  
});  

let response;  
try {  
    response = await aiRieltem(text);  
} catch (error) {  
    await conn.sendMessage(m.chat, {  
        react: { text: "❌", key: m.key }  
    });  
    return m.reply('❌ Gagal mendapatkan jawaban dari AI!');  
}  

let caption = `*🤖 Jawaban dari AI Rieltem*\n\n📝 *Pertanyaan:* ${text}\n💡 *Jawaban:* ${response}`;  

// Reaksi selesai ✅  
await conn.sendMessage(m.chat, {  
    react: { text: "✅", key: m.key }  
});  

await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

};

handler.command = /^(rieltem)$/i;
handler.help = ['riletem (pertanyaan)'];
handler.tags = ['ai'];

export default handler;