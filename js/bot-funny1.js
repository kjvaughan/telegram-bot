//const Telegraf = require('telegraf').Telegraf;
//import { Telegraf } from 'telegraf'
const { Telegraf } = require('telegraf');
require('dotenv').config();
const token = 'token';
//fun fact: the fetch API is not part of node, so a package must be added to use it
//const fetch = require('node-fetch');
const axios = require('axios');
const bot = new Telegraf(token);

bot.start((ctx) => {
    //.reply is what is replied to the user
    ctx.reply(`I am afraid I cannot do that ${ctx.from.first_name}. Please type "menu".`);
});
bot.hears('menu', (ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id, "Sending Lassie. Timmy should be more careful.", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Rainbows", callback_data: "rainbow"}, {text: "Unicorns", callback_data: "unicorn"}],
                [{text: "Do you like words?", callback_data: "word"}]
            ]
        }
    })
});

bot.action('rainbow', (ctx)=>{
    ctx.deleteMessage();
    ctx.telegram.sendMessage(ctx.chat.id, "Here is a rainbow: 🌈", { //sendSticker
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{text: "Again!", callback_data: "go-back"}]
            ]
        }
    })
});

bot.action('unicorn', (ctx)=>{
    ctx.deleteMessage();
    ctx.telegram.sendPhoto(ctx.chat.id, "https://fscomps.fotosearch.com/compc/ARP/ARP116/unicorn-clipart__unicorn.jpg", { //sendSticker
        reply_markup: {
            inline_keyboard: [
                [{text: "Again!", callback_data: "go-back"}]
            ]
        }
    })
});

bot.action('word', (ctx)=>{
    ctx.deleteMessage();
    //let jokes = getData(); -- this lets you use a returned value outside of a function, since getData() returns a value that jokes is now equal to
    //.then is needed because an async function always returns a promise
    getData().then(jokes =>{
        ctx.telegram.sendMessage(ctx.chat.id, jokes, { //sendSticker
            reply_markup: {
                inline_keyboard: [
                    [{text: "Again!", callback_data: "go-back"}]
                ]
            }
        })   
    })
});

bot.action('go-back', (ctx)=>{
    ctx.deleteMessage();
    ctx.telegram.sendMessage(ctx.chat.id, "Sending Lassie. Timmy should be more careful.", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Rainbows", callback_data: "rainbow"}, {text: "Unicorns", callback_data: "unicorn"}],
                [{text: "Do you like words?", callback_data: "word"}]
            ]
        }
    })
});

async function getData(){
    let url = 'https://icanhazdadjoke.com/';
    let res = await axios.get(url,{
        //method: 'get',
        //url: 'https://icanhazdadjoke.com/',
        headers: {
            "Accept" : "application/json" 
        }
    });
    //console.log(res.data);
    //console.log(res.data.joke);
    let joke = res.data.joke;
    //console.log(joke);
    return joke;
}

bot.launch();