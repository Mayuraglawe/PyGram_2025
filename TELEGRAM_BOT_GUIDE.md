# Telegram Bot Integration

This document provides a complete guide for setting up and using the Telegram bot integration for principal communication in the Py-Gram system.

## 🚀 Quick Start

### 1. Bot Token Setup ✅
The bot token is already configured:
- **Bot Username**: @Principle_Pygram_bot
- **Status**: Active and ready to receive messages

### 2. Get Principal's Chat ID

1. **Principal Action Required:**
   - Open Telegram app
   - Search for: `@Principle_Pygram_bot`
   - Start conversation by sending `/start`
   - Send any message to the bot

2. **Admin Setup:**
   - Visit `/telegram-setup` page in the admin panel
   - Click "Get Recent Chat IDs"
   - Find the principal's chat entry
   - Copy the `chatId` number
   - Add to `.env` file: `TELEGRAM_PRINCIPAL_CHAT_ID=<chat_id>`
   - Restart the server

### 3. Test the Integration
- Use the test feature in `/telegram-setup`
- Or use the "Message to Principal" feature in the publisher dashboard

## 📋 Features

### For Publishers:
- **Direct Messaging**: Send messages to principal via dashboard
- **Priority Levels**: Low, Medium, High priority messages
- **Character Counter**: Real-time message length validation
- **Message History**: Track sent messages
- **Rich Formatting**: Messages include sender info and timestamp

### For Principal:
- **Instant Notifications**: Receive messages directly in Telegram
- **Formatted Messages**: Clear sender identification and context
- **Urgent Alerts**: High-priority messages with special formatting
- **Daily Summaries**: Optional summary of all messages

### For Admins:
- **Setup Interface**: Easy configuration via web interface
- **Status Monitoring**: Real-time bot status and connection health
- **Chat ID Discovery**: Simple tool to find principal's chat ID
- **Test Messaging**: Test bot functionality before going live

## 🛠 Technical Details

### API Endpoints

#### Setup and Configuration
- `GET /api/telegram/setup` - Get setup instructions
- `GET /api/telegram/getchatid` - Retrieve recent chat IDs
- `POST /api/telegram/test` - Send test message
- `GET /api/telegram/status` - Check bot status

#### Message Operations
- `POST /api/telegram/send-to-principal` - Send message to principal
- `POST /api/telegram/daily-summary` - Send daily message summary
- `GET /api/telegram/test-connection` - Test bot connectivity

### Environment Variables
```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8270761154:AAHWClhg4sdYRsnmIU3RAb_TFSYTB3cNlpE
TELEGRAM_PRINCIPAL_CHAT_ID=your-principal-chat-id-here
```

### Message Format
Messages sent to the principal include:
- **Sender Information**: Name, role, department
- **Priority Level**: Visual indicators for urgency
- **Timestamp**: When the message was sent
- **Message Content**: The actual message text
- **Formatting**: Markdown formatting for better readability

Example message:
```
🔵 New Message - Medium Priority

👤 From: John Doe (Publisher)
🏢 Department: Computer Engineering
🕐 Time: 2024-01-15 14:30:25

📝 Message:
Need approval for upcoming workshop schedule. Please review the attached timetable changes.
```

## 🎯 User Workflows

### Publisher Workflow:
1. Log into publisher dashboard
2. Navigate to "Message to Principal" section
3. Select priority level (Low/Medium/High)
4. Type message (max 4000 characters)
5. Click "Send Message"
6. Receive confirmation of delivery

### Principal Workflow:
1. Receive Telegram notification
2. Read formatted message with full context
3. Respond via appropriate channel (phone, email, in-person)

### Admin Workflow:
1. Initial setup using `/telegram-setup` page
2. Monitor bot status via admin panel
3. View message statistics and system health
4. Update configuration as needed

## 🔧 Troubleshooting

### Common Issues:

#### "Telegram service is not available"
- Check `TELEGRAM_BOT_TOKEN` in `.env` file
- Verify bot token is valid
- Restart the server

#### "Principal chat ID not configured"
- Ensure principal has messaged the bot
- Use `/telegram-setup` to get chat ID
- Add `TELEGRAM_PRINCIPAL_CHAT_ID` to `.env`
- Restart the server

#### "Failed to send message"
- Check bot token validity
- Verify principal's chat ID is correct
- Ensure principal hasn't blocked the bot
- Check network connectivity

### Debug Steps:
1. Visit `/api/telegram/status` to check service status
2. Use `/telegram-setup` test feature
3. Check server logs for error messages
4. Verify environment variables are loaded correctly

## 🔒 Security Notes

- Bot token is sensitive - never commit to version control
- Chat IDs are unique identifiers - treat as private data
- Messages are sent via Telegram's secure API
- No message content is stored locally

## 📱 Telegram Bot Commands

The bot responds to these commands when principal messages it:
- `/start` - Initialize conversation
- `/help` - Show available commands
- Any text message - Creates a chat ID that admins can discover

## 🎨 UI Components

### MessageToPrincipal Component
Located in: `client/components/communication/MessageToPrincipal.tsx`
- Role-based access control (Publisher only)
- Real-time character counting
- Priority selection
- Form validation
- Success/error feedback

### TelegramSetup Page
Located in: `client/pages/TelegramSetup.tsx`
- Complete setup workflow
- Chat ID discovery
- Test messaging
- Status monitoring
- Configuration guidance

### Admin Panel Integration
Located in: `client/pages/Admin.tsx`
- Quick access to bot configuration
- Status overview
- Direct links to setup and monitoring

## 🚀 Future Enhancements

Potential features for future development:
- Two-way communication (principal replies)
- File/image sharing
- Bulk messaging to multiple recipients
- Message scheduling
- Integration with calendar events
- Analytics and reporting
- Multi-language support

## 📞 Support

For technical support or questions:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Use the built-in status monitoring tools
4. Contact system administrator

---

**Status**: ✅ Fully implemented and ready for use
**Last Updated**: January 15, 2024
**Bot Username**: @Principle_Pygram_bot