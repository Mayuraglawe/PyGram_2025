import { RequestHandler } from 'express';
import TelegramBot from 'node-telegram-bot-api';

// This endpoint helps get the principal's chat ID
export const getSetupInstructions: RequestHandler = (req, res) => {
  const instructions = {
    title: "Telegram Bot Setup Instructions",
    steps: [
      {
        step: 1,
        title: "Bot Token Setup",
        description: "Bot token is already configured",
        status: "✅ Complete"
      },
      {
        step: 2,
        title: "Get Principal's Chat ID",
        description: "Principal needs to start a conversation with the bot",
        instructions: [
          "1. Search for your bot in Telegram using: @your_bot_username",
          "2. Start a conversation by sending /start to the bot",
          "3. Send any message to the bot",
          "4. Use the /getchatid endpoint below to get the chat ID"
        ],
        status: "⏳ Pending"
      },
      {
        step: 3,
        title: "Configure Chat ID",
        description: "Add the chat ID to environment variables",
        status: "⏳ Pending"
      }
    ],
    botInfo: {
      token: process.env.TELEGRAM_BOT_TOKEN ? "Configured" : "Missing",
      principalChatId: process.env.TELEGRAM_PRINCIPAL_CHAT_ID ? "Configured" : "Missing"
    },
    nextActions: [
      "Have the principal message the bot",
      "Call GET /api/telegram/getchatid to see recent chat IDs",
      "Update TELEGRAM_PRINCIPAL_CHAT_ID in .env file"
    ]
  };

  res.json(instructions);
};

// This endpoint shows recent chat IDs (useful for finding principal's chat ID)
export const getChatIds: RequestHandler = async (req, res) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token || token === 'your-telegram-bot-token-here') {
      return res.status(400).json({ 
        error: 'Bot token not configured properly' 
      });
    }

    const bot = new TelegramBot(token, { polling: false });
    
    // Get updates to see recent messages and chat IDs
    const updates = await bot.getUpdates();
    
    const chatIds = updates
      .filter(update => update.message)
      .map(update => ({
        chatId: update.message!.chat.id,
        firstName: update.message!.from?.first_name,
        lastName: update.message!.from?.last_name,
        username: update.message!.from?.username,
        messageText: update.message!.text,
        date: new Date(update.message!.date * 1000).toISOString()
      }))
      .slice(-10); // Get last 10 chat interactions

    res.json({
      success: true,
      recentChats: chatIds,
      instructions: [
        "1. Find the principal's chat ID from the list above",
        "2. Copy the chatId number", 
        "3. Add it to your .env file as TELEGRAM_PRINCIPAL_CHAT_ID=<chat_id>",
        "4. Restart the server"
      ]
    });

  } catch (error) {
    console.error('Error getting chat IDs:', error);
    res.status(500).json({ 
      error: 'Failed to get chat IDs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Test endpoint to send a message to the configured principal
export const testPrincipalMessage: RequestHandler = async (req, res) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const principalChatId = process.env.TELEGRAM_PRINCIPAL_CHAT_ID;

    if (!token || token === 'your-telegram-bot-token-here') {
      return res.status(400).json({ 
        error: 'Bot token not configured' 
      });
    }

    if (!principalChatId) {
      return res.status(400).json({ 
        error: 'Principal chat ID not configured' 
      });
    }

    const bot = new TelegramBot(token, { polling: false });
    
    const testMessage = `🧪 *Test Message*\n\nThis is a test message from the Py-Gram system.\n\nIf you receive this, the Telegram bot integration is working correctly!\n\nSent at: ${new Date().toLocaleString()}`;
    
    await bot.sendMessage(principalChatId, testMessage, { 
      parse_mode: 'Markdown' 
    });

    res.json({
      success: true,
      message: 'Test message sent to principal successfully',
      chatId: principalChatId
    });

  } catch (error) {
    console.error('Error sending test message:', error);
    res.status(500).json({ 
      error: 'Failed to send test message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};