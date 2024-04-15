"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = require("dotenv");
const client_1 = require("@prisma/client");
(0, dotenv_1.config)();
const prisma = new client_1.PrismaClient();
const bot = new node_telegram_bot_api_1.default(process.env.BOT_TOKEN, { polling: true });
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (match) {
        const resp = match[1];
        bot.sendMessage(chatId, resp);
    }
    else {
        bot.sendMessage(chatId, 'Ocorreu um erro na comunicação');
    }
});
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id.toString();
    const messageDate = new Date(msg.date * 1000);
    const timeHours = messageDate.getHours();
    if (timeHours >= 9 && timeHours < 18) {
        yield bot.sendMessage(chatId, 'Olá! Aqui está o link: https://uvv.br');
    }
    else {
        yield bot.sendMessage(chatId, 'BOT FORA DE FUNCIONAMENTO\nTente novamente das 9:00 às 18:00 ou digite seu email para entrarmos em contato:');
        const userEmail = yield getUserEmail(chatId);
        if (userEmail) {
            yield bot.sendMessage(chatId, `Seu email ${userEmail} foi salvo! Agradecemos pelo contato.`);
        }
        else {
            yield bot.sendMessage(chatId, 'Ocorreu um erro ao salvar o email. Por favor, tente novamente.');
        }
    }
}));
function getUserEmail(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            bot.once('message', (msg) => __awaiter(this, void 0, void 0, function* () {
                const email = msg.text;
                const user = yield prisma.user.upsert({
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
            }));
        });
    });
}
