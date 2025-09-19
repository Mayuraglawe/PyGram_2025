# Telegram Bot Integration for PyGram 2025

## Overview

The PyGram 2025 system now includes a Telegram bot integration that allows publishers (mentors with publisher role) to send messages directly to the principal via Telegram. This feature enhances communication between faculty members and administration.

## 🚀 Features

- **Direct Messaging**: Publishers can send text messages to the principal through the dashboard
- **Priority Levels**: Support for low, medium, and high priority messages
- **Message History**: Track recent messages sent to the principal
- **Real-time Delivery**: Messages are delivered instantly via Telegram
- **Professional Formatting**: Messages include sender information, department, and timestamp
- **Urgent Notifications**: High priority messages send immediate alerts

## 📋 Setup Instructions

### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation with BotFather
3. Send `/newbot` command
4. Follow the prompts to name your bot (e.g., "PyGram Principal Bot")
5. Choose a username for your bot (e.g., "pygram_principal_bot")
6. BotFather will provide you with a **Bot Token** - save this securely

### Step 2: Get Principal's Chat ID

1. The principal should start a conversation with your newly created bot
2. Principal should send `/start` command to the bot
3. To get the chat ID, you can:
   - Use the bot's `getUpdates` API endpoint
   - Use a temporary script to capture the chat ID
   - Contact the developer for assistance

### Step 3: Configure Environment Variables

Add the following to your `.env` file:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCDEF1234567890abcdef1234567890ABC
PRINCIPAL_TELEGRAM_CHAT_ID=123456789
```

**Important**: 
- Replace the token with your actual bot token from BotFather
- Replace the chat ID with the principal's actual Telegram chat ID
- Keep these values secure and never commit them to version control

### Step 4: Restart the Server

After adding the environment variables, restart your PyGram 2025 server:

```bash
pnpm dev
```

The server will automatically initialize the Telegram service and log the status.

## 🎯 Usage

### For Publishers

1. **Login as Publisher**: Use mentor account with publisher role
2. **Navigate to Dashboard**: Go to the main department dashboard
3. **Find Message Section**: Scroll down to the "Message to Principal" card
4. **Compose Message**: 
   - Select priority level (low, medium, high)
   - Type your message (max 4000 characters)
   - Review sender information
5. **Send Message**: Click "Send to Principal" button
6. **Confirmation**: You'll receive a confirmation when the message is delivered

### Message Format

Messages sent to the principal include:

```
🔴 Message from Publisher

From: Prof. Sarah Johnson
Role: mentor
Department: Computer Science Engineering
Priority: High
Time: 9/18/2025, 11:30:45 PM

Message:
Urgent: Need approval for emergency timetable changes due to faculty illness.

📱 Sent via PyGram 2025 System
```

### Priority Levels

- **🔵 Low**: Regular notifications (silent delivery)
- **🟡 Medium**: Standard notifications (default)
- **🔴 High**: Urgent notifications (immediate alert + special formatting)

## 🔧 API Endpoints

### Send Message to Principal
```
POST /api/telegram/send-to-principal
```

**Request Body:**
```json
{
  "senderName": "Prof. Sarah Johnson",
  "senderRole": "mentor",
  "senderDepartment": "Computer Science Engineering",
  "message": "Your message content here",
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent to principal successfully",
  "messageId": 12345,
  "timestamp": "2025-09-18T23:30:45.000Z"
}
```

### Test Connection
```
GET /api/telegram/test-connection
```

### Get Service Status
```
GET /api/telegram/status
```

## 🛠️ Technical Details

### Architecture

1. **TelegramService**: Core service for handling bot operations
2. **API Routes**: Express.js routes for handling HTTP requests
3. **React Component**: UI component for composing messages
4. **Dashboard Integration**: Seamlessly integrated into department dashboard

### Dependencies

- `node-telegram-bot-api`: Official Telegram Bot API client
- `@types/node-telegram-bot-api`: TypeScript definitions

### Security Features

- Environment variable validation
- Message length limits (4000 characters)
- Rate limiting (can be implemented)
- Input sanitization
- Error handling and logging

## 🐛 Troubleshooting

### Common Issues

1. **Bot Token Invalid**
   - Verify the token is correct and hasn't been revoked
   - Ensure no extra spaces in the environment variable

2. **Chat ID Not Found**
   - Ensure the principal has started a conversation with the bot
   - Verify the chat ID is a number, not a username

3. **Messages Not Delivering**
   - Check if the bot is blocked by the principal
   - Verify network connectivity
   - Check server logs for error messages

4. **Service Not Starting**
   - Ensure both `TELEGRAM_BOT_TOKEN` and `PRINCIPAL_TELEGRAM_CHAT_ID` are set
   - Check the server startup logs for initialization errors

### Error Messages

- `"Telegram bot is not initialized"`: Environment variables missing
- `"Telegram service is not available"`: Bot connection failed
- `"Message too long"`: Message exceeds 4000 character limit
- `"Network error"`: Connection to Telegram API failed

## 📝 Development Notes

### File Structure
```
server/
├── services/
│   └── telegramService.ts     # Core Telegram service
└── routes/
    └── telegram.ts            # API endpoints

client/
└── components/
    └── communication/
        └── MessageToPrincipal.tsx  # UI component
```

### Future Enhancements

- [ ] Message templates
- [ ] Scheduled messages
- [ ] Message categories
- [ ] Read receipts
- [ ] Group messaging
- [ ] File attachments
- [ ] Message search/filtering

### Testing

To test the integration:

1. Set up the bot with test credentials
2. Use a test Telegram account as the "principal"
3. Login as a publisher in PyGram 2025
4. Send test messages through the dashboard
5. Verify delivery and formatting in Telegram

## 📞 Support

For assistance with the Telegram bot integration:

1. Check the server logs for error messages
2. Verify environment variables are correctly set
3. Test the bot connection using the `/api/telegram/test-connection` endpoint
4. Contact the development team for technical support

---

**Note**: This feature requires proper Telegram bot setup and principal cooperation. Ensure all parties understand how to use the system before deployment.