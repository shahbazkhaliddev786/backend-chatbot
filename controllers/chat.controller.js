const prisma = require("../db/prisma.config");
const axios = require("axios");

// function to get bot response
// async function getBotResponse(prompt) {
//     try {
//       const response = await axios.post(
//         'https://api.together.xyz/inference',
//         {
//           model: 'togethercomputer/llama-2-70b-chat',
//           max_tokens: 3000,
//           prompt: prompt,
//           request_type: 'language-model-inference',
//           temperature: 0.7,
//           top_p: 0.7,
//           top_k: 50,
//           repetition_penalty: 1,
//           stop: ['[/INST]', '</s>'],
//           negative_prompt: '',
//           sessionKey: '13daeea5-9e6f-4b1d-b1ba-a7e13e3b727b',
//         },
//         {
//           headers: {
//             Authorization: 'Bearer 8cc8b6a21bca579e2bea732923c5aa8d5362655f7438de4e2e8020f1670d8df5',
//           },
//         }
//       );
  
//       return response.data;
//     } catch (error) {
//       console.error('Error getting bot response:', error);
//       return 'Sorry, I am unable to respond at the moment.';
//     }
//   }

// create new chat
const newChat = async(req,res)=>{
    try {
        const chat = await prisma.chat.create({data:{}});
        res.status(200).json({chat,messages: []});
    } catch (error) {
        res.status(500).json(error);
    }
}

// create message and add to chat
const messageToChat = async(req,res)=>{ // /chats/:id/messages
    const {id} = req.params; // id(name must be same in route :id)
    const {content, sender, chatId} = req.body;

    try {
        async function getBotResponse(prompt) {
            try {
                console.log("try one")
              const response = await axios.post(
                'https://api.together.xyz/inference',
                {
                  model: 'togethercomputer/llama-2-70b-chat',
                  max_tokens: 3000,
                  prompt: prompt,
                  request_type: 'language-model-inference',
                  temperature: 0.7,
                  top_p: 0.7,
                  top_k: 50,
                  repetition_penalty: 1,
                  stop: ['[/INST]', '</s>'],
                  negative_prompt: '',
                  sessionKey: '13daeea5-9e6f-4b1d-b1ba-a7e13e3b727b',
                },
                {
                  headers: {
                    Authorization: 'Bearer 8cc8b6a21bca579e2bea732923c5aa8d5362655f7438de4e2e8020f1670d8df5',
                  },
                }
              );
              return response.data.output.choices[0].text;
            } catch (error) {
              console.error('Error getting bot response:', error);
              return 'Sorry, I am unable to respond at the moment.';
            }
          }

        const botResponse = await getBotResponse(content);
        console.log(botResponse)

        if (botResponse === null) {
            res.status(500).json({ error: 'Bot is unable to respond at the moment.' });
            return;
          }
        await prisma.message.create({
            data:{
                content: botResponse,
                sender: 'bot',
                chatId: parseInt(id, 10)
            }
        });

        const message = await prisma.message.create({
            data: {
                content,
                sender,
                chatId:chatId
            }
          });
        
        res.json({message, botResponse});
    } catch (error) {
        res.status(500).json(error);
    }
}

// get all messages in a chat  /chats/:id/messages
const allMessages = async(req,res)=>{
    const {id} = req.params;
    try {
        const messages = await prisma.message.findMany({
            where: {chatId: parseInt(id, 10)}
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
}

// delete chat 
const deleteChat = async(req,res)=>{
    const {id} = req.params;
    try {
        const deletedMessages = await prisma.message.deleteMany({
            where:{chatId: Number(id)}
        });
        const deletedChat = await prisma.chat.delete({
            where:{id:Number(id)}
        })
        res.json({deletedMessages, deletedChat});
    } catch (error) {
        res.json(error);
    }
}

//all chats
const allChats = async(req,res)=>{
    try {
        const chats = await prisma.chat.findMany();
        res.json(chats);
    } catch (error) {
        res.status(500).json({message: "Chats not found"});
    }
}

module.exports = {
    newChat,
    messageToChat,
    allMessages,
    deleteChat,
    allChats
}