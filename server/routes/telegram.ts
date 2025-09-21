import { Router, Request, Response } from 'express';
import { getTelegramService, MessagePayload } from '../services/telegramService';
import { getSetupInstructions, getChatIds, testPrincipalMessage } from './telegram-setup';

// ============================================================================
// TELEGRAM API ROUTES
// ============================================================================

const router = Router();

// Setup and admin routes
router.get('/setup', getSetupInstructions);
router.get('/getchatid', getChatIds);
router.post('/test', testPrincipalMessage);

/**
 * Send message to principal via Telegram
 * POST /api/telegram/send-to-principal
 */
router.post('/send-to-principal', async (req: Request, res: Response) => {
  try {
    const {
      senderName,
      senderRole,
      senderDepartment,
      message,
      priority = 'medium'
    } = req.body;

    // Validate required fields
    if (!senderName || !senderRole || !senderDepartment || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: senderName, senderRole, senderDepartment, message'
      });
    }

    // Validate message length
    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        error: 'Message too long. Maximum 4000 characters allowed.'
      });
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority. Must be one of: low, medium, high'
      });
    }

    const telegramService = getTelegramService();

    // Check if service is ready
    if (!telegramService.isReady()) {
      return res.status(503).json({
        success: false,
        error: 'Telegram service is not available. Please contact system administrator.'
      });
    }

    // Prepare message payload
    const messagePayload: MessagePayload = {
      senderName,
      senderRole,
      senderDepartment,
      message: message.trim(),
      timestamp: new Date(),
      priority
    };

    // Send message based on priority
    let result;
    if (priority === 'high') {
      result = await telegramService.sendUrgentNotification(messagePayload);
    } else {
      result = await telegramService.sendMessageToPrincipal(messagePayload);
    }

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Message sent to principal successfully',
        messageId: result.messageId,
        timestamp: messagePayload.timestamp
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to send message'
      });
    }

  } catch (error) {
    console.error('❌ Error in send-to-principal endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * Test Telegram bot connection
 * GET /api/telegram/test-connection
 */
router.get('/test-connection', async (req: Request, res: Response) => {
  try {
    const telegramService = getTelegramService();
    
    const isConnected = await telegramService.testConnection();
    const botInfo = await telegramService.getBotInfo();

    if (isConnected && botInfo) {
      res.status(200).json({
        success: true,
        connected: true,
        botInfo: {
          username: botInfo.username,
          firstName: botInfo.first_name,
          id: botInfo.id
        },
        message: 'Telegram bot is connected and ready'
      });
    } else {
      res.status(503).json({
        success: false,
        connected: false,
        message: 'Telegram bot is not available'
      });
    }

  } catch (error) {
    console.error('❌ Error testing Telegram connection:', error);
    res.status(500).json({
      success: false,
      connected: false,
      error: 'Failed to test connection'
    });
  }
});

/**
 * Get Telegram service status
 * GET /api/telegram/status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const telegramService = getTelegramService();
    
    const status = {
      isReady: telegramService.isReady(),
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChatId: !!process.env.TELEGRAM_PRINCIPAL_CHAT_ID,
      lastChecked: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      status
    });

  } catch (error) {
    console.error('❌ Error getting Telegram status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get service status'
    });
  }
});

/**
 * Send daily summary (admin only)
 * POST /api/telegram/daily-summary
 */
router.post('/daily-summary', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages must be an array'
      });
    }

    const telegramService = getTelegramService();

    if (!telegramService.isReady()) {
      return res.status(503).json({
        success: false,
        error: 'Telegram service is not available'
      });
    }

    const result = await telegramService.sendDailySummary(messages);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Daily summary sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to send daily summary'
      });
    }

  } catch (error) {
    console.error('❌ Error sending daily summary:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;