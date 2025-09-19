import TelegramBot from 'node-telegram-bot-api';

// ============================================================================
// TELEGRAM SERVICE FOR PUBLISHER-TO-PRINCIPAL COMMUNICATION
// ============================================================================

interface TelegramConfig {
  botToken: string;
  principalChatId: string;
}

interface MessagePayload {
  senderName: string;
  senderRole: string;
  senderDepartment: string;
  message: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
}

interface SendMessageResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Telegram Service for handling publisher-to-principal communication
 * Allows publishers to send messages directly to the principal via Telegram bot
 */
export class TelegramService {
  private bot: TelegramBot | null = null;
  private config: TelegramConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      principalChatId: process.env.TELEGRAM_PRINCIPAL_CHAT_ID || ''
    };
  }

  /**
   * Initialize the Telegram bot
   */
  public async initialize(): Promise<boolean> {
    try {
      if (!this.config.botToken) {
        console.error('❌ TELEGRAM_BOT_TOKEN environment variable is not set');
        return false;
      }

      if (!this.config.principalChatId) {
        console.error('❌ TELEGRAM_PRINCIPAL_CHAT_ID environment variable is not set');
        return false;
      }

      // Create bot instance
      this.bot = new TelegramBot(this.config.botToken, { polling: false });

      // Test the bot connection
      const me = await this.bot.getMe();
      console.log(`✅ Telegram bot initialized successfully: @${me.username}`);
      
      this.isInitialized = true;
      return true;

    } catch (error) {
      console.error('❌ Failed to initialize Telegram bot:', error);
      return false;
    }
  }

  /**
   * Send a message from publisher to principal
   */
  public async sendMessageToPrincipal(payload: MessagePayload): Promise<SendMessageResult> {
    try {
      if (!this.isInitialized || !this.bot) {
        return {
          success: false,
          error: 'Telegram bot is not initialized'
        };
      }

      // Format the message for the principal
      const formattedMessage = this.formatMessageForPrincipal(payload);

      // Send message to principal
      const result = await this.bot.sendMessage(
        this.config.principalChatId,
        formattedMessage,
        {
          parse_mode: 'HTML',
          disable_notification: payload.priority === 'low'
        }
      );

      console.log(`✅ Message sent to principal from ${payload.senderName}`);

      return {
        success: true,
        messageId: result.message_id
      };

    } catch (error) {
      console.error('❌ Failed to send message to principal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Send a notification about urgent matters
   */
  public async sendUrgentNotification(payload: MessagePayload): Promise<SendMessageResult> {
    try {
      if (!this.isInitialized || !this.bot) {
        return {
          success: false,
          error: 'Telegram bot is not initialized'
        };
      }

      const urgentMessage = `
🚨 <b>URGENT MESSAGE</b> 🚨

<b>From:</b> ${payload.senderName}
<b>Role:</b> ${payload.senderRole}
<b>Department:</b> ${payload.senderDepartment}
<b>Time:</b> ${payload.timestamp.toLocaleString()}

<b>Message:</b>
${payload.message}

⚠️ <i>This message requires immediate attention</i>
`;

      const result = await this.bot.sendMessage(
        this.config.principalChatId,
        urgentMessage,
        {
          parse_mode: 'HTML',
          disable_notification: false // Always notify for urgent messages
        }
      );

      return {
        success: true,
        messageId: result.message_id
      };

    } catch (error) {
      console.error('❌ Failed to send urgent notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Send a daily summary of messages (optional feature)
   */
  public async sendDailySummary(messages: MessagePayload[]): Promise<SendMessageResult> {
    try {
      if (!this.isInitialized || !this.bot || messages.length === 0) {
        return {
          success: false,
          error: 'No messages to summarize or bot not initialized'
        };
      }

      const summary = `
📊 <b>Daily Summary - ${new Date().toLocaleDateString()}</b>

<b>Total Messages:</b> ${messages.length}

${messages.map((msg, index) => `
<b>${index + 1}.</b> <b>${msg.senderName}</b> (${msg.senderDepartment})
<i>${msg.message.substring(0, 100)}${msg.message.length > 100 ? '...' : ''}</i>
`).join('\n')}

📱 <i>Summary generated by PyGram 2025 System</i>
`;

      const result = await this.bot.sendMessage(
        this.config.principalChatId,
        summary,
        {
          parse_mode: 'HTML'
        }
      );

      return {
        success: true,
        messageId: result.message_id
      };

    } catch (error) {
      console.error('❌ Failed to send daily summary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Format message for principal with proper structure
   */
  private formatMessageForPrincipal(payload: MessagePayload): string {
    const priorityIcon = {
      'low': '🔵',
      'medium': '🟡',
      'high': '🔴'
    };

    const icon = priorityIcon[payload.priority || 'medium'];
    
    return `
${icon} <b>Message from Publisher</b>

<b>From:</b> ${payload.senderName}
<b>Role:</b> ${payload.senderRole}
<b>Department:</b> ${payload.senderDepartment}
<b>Priority:</b> ${payload.priority || 'Medium'}
<b>Time:</b> ${payload.timestamp.toLocaleString()}

<b>Message:</b>
${payload.message}

📱 <i>Sent via PyGram 2025 System</i>
`;
  }

  /**
   * Test the bot connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      if (!this.bot) {
        return false;
      }

      await this.bot.getMe();
      return true;
    } catch (error) {
      console.error('❌ Telegram bot connection test failed:', error);
      return false;
    }
  }

  /**
   * Get bot information
   */
  public async getBotInfo(): Promise<any> {
    try {
      if (!this.bot) {
        return null;
      }

      return await this.bot.getMe();
    } catch (error) {
      console.error('❌ Failed to get bot info:', error);
      return null;
    }
  }

  /**
   * Check if the service is ready to send messages
   */
  public isReady(): boolean {
    return this.isInitialized && this.bot !== null && 
           this.config.botToken !== '' && this.config.principalChatId !== '';
  }

  /**
   * Gracefully shutdown the bot
   */
  public async shutdown(): Promise<void> {
    try {
      if (this.bot) {
        await this.bot.stopPolling();
        this.bot = null;
        this.isInitialized = false;
        console.log('✅ Telegram bot service shutdown successfully');
      }
    } catch (error) {
      console.error('❌ Error during Telegram bot shutdown:', error);
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let telegramServiceInstance: TelegramService | null = null;

/**
 * Get the singleton instance of TelegramService
 */
export function getTelegramService(): TelegramService {
  if (!telegramServiceInstance) {
    telegramServiceInstance = new TelegramService();
  }
  return telegramServiceInstance;
}

/**
 * Initialize the Telegram service (call this on server startup)
 */
export async function initializeTelegramService(): Promise<boolean> {
  const service = getTelegramService();
  return await service.initialize();
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type { MessagePayload, SendMessageResult, TelegramConfig };