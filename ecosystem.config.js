module.exports = {
  apps : [{
    name   : "telegram-quiz-bot",
    script : "dist/main.js",
    env: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID
    }
  }]
}
