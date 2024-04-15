import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config();

const prisma = new PrismaClient();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
    }
  }
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  if (match) {
    const resp = match[1];
    bot.sendMessage(chatId, resp);
  } else {
    bot.sendMessage(chatId, 'Ocorreu um erro na comunicação');
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id.toString();
  const messageDate = new Date(msg.date * 1000);
  const timeHours = messageDate.getHours();

  if (timeHours >= 9 && timeHours < 18) {
    await bot.sendMessage(chatId, 'Olá! Aqui está o link: https://uvv.br');
  } else {
    await bot.sendMessage(
      chatId,
      'BOT FORA DE FUNCIONAMENTO\nTente novamente das 9:00 às 18:00 ou digite seu email para entrarmos em contato:'
    );
    const userEmail = await getUserEmail(chatId);

    if (userEmail) {
      await bot.sendMessage(
        chatId,
        `Seu email ${userEmail} foi salvo! Agradecemos pelo contato.`
      );
    } else {
      await bot.sendMessage(
        chatId,
        'Ocorreu um erro ao salvar o email. Por favor, tente novamente.'
      );
    }
  }
});

async function getUserEmail(chatId: string) {
  return new Promise((resolve) => {
    bot.once('message', async (msg) => {
      const email = msg.text;

      const user = await prisma.user.upsert({
        where: {
          id_telegram: chatId.toString(),
        },
        update: {
          name: `${msg.chat.first_name} ${msg.chat.last_name}`,
        },
        create: {
          name: `${msg.chat.first_name} ${msg.chat.last_name}`,
          id_telegram: chatId.toString(),
          email: email,
        },
      });

      resolve(user.email);
    });
  });
}
