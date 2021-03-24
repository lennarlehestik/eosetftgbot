const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
// replace the value below with the Telegram token you receive from @BotFather
const token = '1783312535:AAF6ZX9r_8wElX8meIl_onEZZ8jJHPQgvfQ';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/help/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Use '/eosetf price' to get price of eosetf. Use '/eosetf supply' to get current supply of eosetf.");

});

bot.onText(/\/eosetf (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

    if(resp == "price"){
        fetch("https://api.main.alohaeos.com:443/v1/chain/get_table_rows", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            json: true,
            code: "swap.defi",
            table: "pairs",
            scope: "swap.defi",
            lower_bound: 1232,
            upper_bound: 1232,
            limit: 1,
          }),
        }).then((response) =>
          response.json().then((price) => bot.sendMessage(chatId, price.rows[0].price1_last + " EOS/EOSETF"))
        ).catch((err) => respond(err))
    }
    else if(resp == "supply"){
      fetch("https://api.main.alohaeos.com:443/v1/chain/get_table_rows", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          json: true,
          code: "cet.f",
          table: "stat",
          scope: "CETF",
          limit: 1,
        }),
      }).then((response) =>
        response.json().then((etfbalance) => bot.sendMessage(chatId, etfbalance.rows[0].supply))
      ).catch((err) => respond(err))
    }
    else{
      bot.sendMessage(chatId, "Sorry, I couldn't recognize the command");
    }
    bot.closeWebHook()

});
