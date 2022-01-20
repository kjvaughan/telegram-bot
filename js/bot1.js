const { Telegraf } = require('telegraf');
require('dotenv').config();
const token = 'token';
const key = 'key';
const axios = require('axios');
const bot = new Telegraf(token);

const commandRef = `
/pharmacy - find pharmacies nearby
/laboratory - find a laboratory nearby
/cost - find information about the cost of prescriptions
/info - get more information about hepatitis
`;

bot.start((ctx) => {
    ctx.reply(`Hello, ${ctx.from.first_name}. Please type "menu" to see what I can do for you.`);
});

bot.hears('menu', (ctx)=>{
    ctx.reply(commandRef);
});

bot.command(["pharmacy", "Pharmacy"], (ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id, "Choose your location.", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Tashkent", callback_data: "tashkent"}, {text: "Andijan", callback_data: "andijan"}],
                [{text: "Fergana", callback_data: "fergana"}, {text: "Namangan", callback_data: "namangan"}],
                [{text: "Sirdarya", callback_data: "sirdarya"}, {text: "Samarkand", callback_data: "samarkand"}],
                [{text: "Surkhandarya", callback_data: "surkhandarya"}, {text: "Other", callback_data: "other"}]
                //add a menu button to get back to the menu?
            ]
        }
    })
});

bot.command(["laboratory", "Laboratory"], (ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id, "Choose your location.", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Tashkent", callback_data: "tashkent"}, {text: "Andijan", callback_data: "andijan"}],
                [{text: "Fergana", callback_data: "fergana"}, {text: "Namangan", callback_data: "namangan"}],
                [{text: "Sirdarya", callback_data: "sirdarya"}, {text: "Samarkand", callback_data: "samarkand"}],
                [{text: "Surkhandarya", callback_data: "surkhandarya"}, {text: "Other", callback_data: "other"}]
            ]
        }
    })
});

bot.action('tashkent', (ctx) => {
    //console.log(ctx);
    //ctx.replyWithLocation(41.2995, 69.2401);
    //let m = new Map([["lat",[41, 42, 43]],["lon", [69, 70, 71]]]);
    //console.log(m, m.get('lat'));
    //let lat = m.get('lat');
    //let lon = m.get('lon');
    //Promise.all([ctx.replyWithLocation(41.2995, 69.2401), ctx.replyWithLocation(41.3995, 69.3401), ctx.replyWithLocation(41.4995, 69.4401)])
    //ctx.replyWithLocation(lat, lon);
    ctx.reply('Tashkent');
    getData().then(data => {
        //or data[0].address.label, data[1].address.label, data[2].address.label in a template string
        data.forEach(item => {
            ctx.reply(item.address.label);    
        });
    });
    //in the forEach loop
    /* ctx.telegram.sendMessage(ctx.chat.id, "Here are three pharmacies close to you", {
        reply_markup: {
            inline_keyboard: [
                [{text: "item.address.label", callback_data: "item.position"}]
            ]
        }
    }) */
})

bot.action('samarkand', (ctx) => {
    console.log(ctx);
    ctx.replyWithLocation(39.6270, 66.9750);
    ctx.reply('Samarkand');
})

bot.command(["cost", "Cost"], (ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id, "What are you looking for a prescription for?", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Hepatitis B", callback_data: "hbv"}, {text: "Hepatitis C", callback_data: "hcv"}]
            ]
        }
    })
});

bot.action('hbv', (ctx)=>{
    ctx.deleteMessage();
    ctx.telegram.sendMessage(ctx.chat.id, "Choose a prescription", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Prescription 1", callback_data: "presc1b"}, {text: "Prescription 2", callback_data: "presc2b"}],
                [{text: "Prescription 3", callback_data: "presc3b"}, {text: "Prescription 4", callback_data: "presc4b"}],
                [{text: "Prescription 5", callback_data: "presc5b"}, {text: "Other", callback_data: "other"}],
            ]
        }
    })
    console.log(ctx.updateType);
});

bot.action('hcv', (ctx)=>{
    ctx.deleteMessage();
    ctx.telegram.sendMessage(ctx.chat.id, "Choose a prescription", {
        reply_markup: {
            inline_keyboard: [
                [{text: "Prescription 1", callback_data: "presc1"}, {text: "Prescription 2", callback_data: "presc2"}],
                [{text: "Prescription 3", callback_data: "presc3"}, {text: "Prescription 4", callback_data: "presc4"}],
                [{text: "Prescription 5", callback_data: "presc5"}, {text: "Other", callback_data: "other"}],
            ]
            //console log to figure out what to get to store the callback in a variable and run an "if" statement
            //one callback, then if statement depending on text?
            //could use a regex with the bot.action method and then if statement to decide the proper message
        }
    })
});

bot.command(["info", "Info"], (ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id, 'Go to <a href="https://www.hep-care.com">https://www.hep-care.com</a> for more information on hepatitis', { //sendSticker
        parse_mode: 'HTML'
    })
});

bot.command('data', (ctx) => {
    ctx.reply('Finding pharmacies nearby');
    /* let pharmacies = '';
    getData().then(data => {
        //console.log(data);
        data.forEach(item => {
            //console.log(item.address.label);
            //ctx.reply(item.address.label);
            let pharmacy = item.address.label;
            let pharm = `&#13;${pharmacy}`;
            pharmacies += pharm;
            return pharmacies;
        })
        ctx.telegram.sendMessage(ctx.chat.id, pharmacies, {
            parse_mode: 'HTML'
        });
    }); */
    getData().then(data => {
        data.forEach(item => {
            ctx.reply(item.address.label);    
        });
    });
})

async function getData(){
    let url = `https://discover.search.hereapi.com/v1/discover?at=41.2995,69.2401&limit=3&q=pharmacy&in=countryCode:UZB&apiKey=${key}`;
    let res = await axios.get(url,{
        //method: 'get',
        //url: 'https://icanhazdadjoke.com/',
        headers: {
            "Accept" : "application/json" 
        }
    });
    //console.log(res.data.items);
    //console.log(res.data.joke);
    let locations = res.data.items;
    //console.log(joke);
    return locations;
}

bot.launch();