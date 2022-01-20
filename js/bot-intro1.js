//having to add the .Telegraf at the end shouldn't have to happen, but I guess there's an issue with the package and that's a workaround
const Telegraf = require('telegraf').Telegraf;
require('dotenv').config();
const token = 'token';
//API token for bot goes in the quotes; this token will need to be stored a different file so people can't use it to control the bot
const bot = new Telegraf(token);

const helpMessage = `
Say something to me:
/start - start the chat
/help - command reference
`;

const commandRef = `
/help - command reference
/meow - meow like a cat
`;

//what happens when the chat is started -- start command; ctx (context) object is part of Telegraf package
//use the next param and function if you need to pass things along to other methods (middlewares)
//can also modify state of the ctx object in order to pass things along to other methods
bot.start((ctx) => {
    //.reply is what is replied to the user
    ctx.reply("I am afraid I cannot do that " + ctx.from.first_name);
    ctx.reply(helpMessage);
});
bot.help((ctx) => {
    //.reply is what is replied to the user
    ctx.reply("Sending Lassie. Timmy should be more careful.");
    ctx.reply(commandRef);
});
bot.settings((ctx) => {
    //.reply is what is replied to the user
    ctx.reply("You have entered the settings command");
});

//create your own commands; first param is the command, second param is the middleware (ctx)
bot.command(["meow", "Meow"], (ctx)=>{
    ctx.reply("Meow. I am a cat.");
    //the above is shortcut for bot.telegram.sendMessage(ctx.chat.id, "Meow. I am a cat.");
});

//reply to text messages and not commands
/* bot.hears("help", (ctx)=>{
    ctx.reply("Sending Lassie. Timmy should be more careful.")
}); */

//reply to other types of messages and not commands
bot.on("sticker", (ctx)=>{
    ctx.reply("What is brown and sticky? Not this.")
});

//can reply to mentions, hashtags and phone numbers using different methods; here's the phone number
bot.phone("+1 234 567-8901", (ctx)=>{
    ctx.reply("This is a phone number");
});

//this command is needed so that the script starts checking for any messages sent to the bot
bot.launch();