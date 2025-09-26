import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
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

      // For now, just return success (you can integrate the actual Telegram service later)
      return res.status(200).json({
        success: true,
        message: 'Message would be sent to principal (Telegram service not implemented in this API route yet)'
      });
    } catch (error) {
      console.error('Telegram send error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}