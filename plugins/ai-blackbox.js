/*
Jangan Hapus Wm Bang 

*Ai Kotak Hitam  Plugins Esm*

- Bisa Setting Model
- Default Model Deepseek V3 
- Tersedia 7 Model Yang Berbeda Beda
- Blackbox Stream 

*[Source]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

ZErvida
*/

import axios from 'axios';

class Blackbox {
  static models = [
    'deepseek-ai/DeepSeek-V3',
    'deepseek-ai/DeepSeek-R1',
    'mistralai/Mistral-Small-24B-Instruct-2501',
    'deepseek-ai/deepseek-llm-67b-chat',
    'databricks/dbrx-instruct',
    'Qwen/QwQ-32B-Preview',
    'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
  ];

  constructor(model = Blackbox.models[0], apiUrl = 'https://api.blackbox.ai/api/chat') {
    this.apiUrl = apiUrl;
    this.model = model;
    this.maxTokens = 1024;
    this.chats = [];
  }

  async chat(message) {
    this.chats.push({ content: message, role: 'user' });
    
    const data = {  
      messages: this.chats,  
      model: this.model,  
      max_tokens: this.maxTokens  
    };
    
    try {  
      const response = await axios.post(this.apiUrl, data);  
      const result = response.data;  
      this.chats.push({ content: result, role: 'model' });  
      return result;  
    } catch (error) {  
      console.error('Error:', error);  
      return null;  
    }
  }

  async chatStream(message, onData) {
    this.chats.push({ content: message, role: 'user' });
    
    const data = {  
      messages: this.chats,  
      model: this.model,  
      max_tokens: this.maxTokens,  
      stream: true  
    };
    
    try {  
      const response = await axios.post(this.apiUrl, data, { responseType: 'stream' });  
      response.data.on('data', (chunk) => onData(chunk.toString()));  
      return response.data;  
    } catch (error) {  
      console.error('Stream Error:', error);  
      return null;  
    }
  }
}

const userModels = new Map();

const handler = async (m, { conn, args, command }) => {
  const text = args.join(' ');
  const sender = m.sender;

  try {
    if (command === 'blackboxmodel') {
      let modelList = "📚 Daftar Model AI yang Tersedia:\n\n";
      Blackbox.models.forEach((model, index) => {
        modelList += `${index + 1}. ${model}\n`;
      });
      modelList += "\n```Gunakan: blackboxsetmodel <nomor>```";
      return m.reply(modelList);
    }

    if (command === 'blackboxsetmodel') {
      const modelIndex = parseInt(text) - 1;
      if (isNaN(modelIndex) || modelIndex < 0 || modelIndex >= Blackbox.models.length) {
        return m.reply(`*_Nomor model tidak valid! Gunakan angka 1-${Blackbox.models.length}_*`);
      }
      
      userModels.set(sender, Blackbox.models[modelIndex]);
      return m.reply(`*Berhasil set model ke:\n${Blackbox.models[modelIndex]}*`);
    }

    if (command === 'blackbox' || command === 'blackboxstream') {
      if (!text) return m.reply('Masukkan pertanyaan!');
      
      const selectedModel = userModels.get(sender) || Blackbox.models[0];
      const blackbox = new Blackbox(selectedModel);

      if (command === 'blackbox') {
        const response = await blackbox.chat(text);
        if (!response) throw new Error('Gagal mendapatkan respons!');
        await m.reply(response);
      } else if (command === 'blackboxstream') {
        let fullResponse = '';
        const stream = await blackbox.chatStream(text, (chunk) => {
          fullResponse += chunk;
        });
        
        await new Promise((resolve, reject) => {
          stream.on('end', resolve);
          stream.on('error', reject);
        });
        
        await m.reply(fullResponse);
      }
    }
  } catch (error) {
    console.error(error);
    await m.reply(`🚩 Error: ${error.message}`);
  }
};

handler.help = [
  'blackbox <teks>',
  'blackboxstream <teks>',
  'blackboxmodel',
  'blackboxsetmodel <nomor>'
];

handler.command = /^(blackbox|blackboxstream|blackboxmodel|blackboxsetmodel)$/i;
handler.limit = true;
handler.tags = ['ai'];

export default handler;