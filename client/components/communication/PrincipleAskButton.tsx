import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Send, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  Loader2,
  Crown,
  Bot
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDepartment } from '@/contexts/DepartmentContext';

interface PrincipleAskButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function PrincipleAskButton({ 
  variant = 'default', 
  size = 'default', 
  className = '',
  children 
}: PrincipleAskButtonProps) {
  const { user } = useAuth();
  const { activeDepartment } = useDepartment();
  
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'general' | 'urgent' | 'approval' | 'policy'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const maxLength = 4000;
  const remainingChars = maxLength - message.length;

  const resetForm = () => {
    setMessage('');
    setCategory('general');
    setStatus({ type: 'idle', message: '' });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSend = async () => {
    console.log('🚀 PRINCIPLE ASK: Send button clicked');
    
    if (!message.trim()) {
      console.log('❌ PRINCIPLE ASK: Empty message');
      setStatus({ type: 'error', message: 'Please enter a message' });
      return;
    }

    if (!user || !activeDepartment) {
      console.log('❌ PRINCIPLE ASK: Missing user or department', { user, activeDepartment });
      setStatus({ type: 'error', message: 'User or department information not available' });
      return;
    }

    console.log('✅ PRINCIPLE ASK: Starting message send process');
    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      // Map category to priority for the API
      const priorityMap = {
        general: 'medium',
        urgent: 'high',
        approval: 'high',
        policy: 'medium'
      };

      const priority = priorityMap[category];

      // Add category context to the message
      const categoryPrefix = {
        general: '📋 General Query',
        urgent: '🚨 Urgent Matter',
        approval: '✅ Approval Request',
        policy: '📜 Policy Inquiry'
      };

      const enhancedMessage = `${categoryPrefix[category]}\n\n${message.trim()}`;

      const requestPayload = {
        senderName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
        senderRole: `${user.role || 'user'} (Publisher)`,
        senderDepartment: activeDepartment.name,
        message: enhancedMessage,
        priority,
      };

      console.log('📤 PRINCIPLE ASK: Sending request to API:', {
        endpoint: '/api/telegram/send-to-principal',
        fullUrl: window.location.origin + '/api/telegram/send-to-principal',
        payload: requestPayload
      });
      
      const apiUrl = window.location.origin + '/api/telegram/send-to-principal';
      console.log('🌐 PRINCIPLE ASK: Using full API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      console.log('📥 PRINCIPLE ASK: API response status:', response.status);
      
      const data = await response.json();
      console.log('📥 PRINCIPLE ASK: API response data:', data);

      if (data.success) {
        console.log('✅ PRINCIPLE ASK: Message sent successfully!', data);
        setStatus({ 
          type: 'success', 
          message: 'Your message has been sent to the Principal via Telegram!' 
        });
        
        // Auto-close after 2.5 seconds on success
        setTimeout(() => {
          handleClose();
        }, 2500);
      } else {
        console.log('❌ PRINCIPLE ASK: API returned failure:', data);
        setStatus({ 
          type: 'error', 
          message: data.error || 'Failed to send message to Principal' 
        });
      }
    } catch (error) {
      console.error('❌ PRINCIPLE ASK: Network/fetch error:', error);
      setStatus({ 
        type: 'error', 
        message: 'Network error. Please try again.' 
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 PRINCIPLE ASK: Send process completed');
    }
  };

  const getCategoryIcon = (categoryType: string) => {
    switch (categoryType) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4" />;
      case 'policy':
        return <Crown className="h-4 w-4" />;
      case 'general':
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (categoryType: string) => {
    switch (categoryType) {
      case 'urgent':
        return 'destructive';
      case 'approval':
        return 'default';
      case 'policy':
        return 'secondary';
      case 'general':
      default:
        return 'outline';
    }
  };

  const getCategoryDescription = (categoryType: string) => {
    switch (categoryType) {
      case 'urgent':
        return 'Requires immediate attention from Principal';
      case 'approval':
        return 'Requesting approval or authorization';
      case 'policy':
        return 'Questions about institutional policies';
      case 'general':
      default:
        return 'General communication or information';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Crown className="h-4 w-4 mr-2" />
          {children || 'Principle Ask'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-blue-600" />
            <span>Principle Ask</span>
            <Badge variant="outline" className="ml-2">
              <Bot className="h-3 w-3 mr-1" />
              Via Telegram
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Send a direct message to the Principal through our secure Telegram communication channel.
            As a Publisher, your messages are prioritized and will be delivered instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Sender Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Publisher
              </Badge>
              <span className="text-sm font-medium">Message Details</span>
            </div>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">From:</span> {user?.first_name} {user?.last_name} ({user?.email})</div>
              <div><span className="font-medium">Department:</span> {activeDepartment?.name}</div>
              <div><span className="font-medium">Role:</span> Publisher Mentor</div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Message Category</Label>
            <Select value={category} onValueChange={(value: 'general' | 'urgent' | 'approval' | 'policy') => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select message category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>General Query</span>
                    <Badge variant="outline">Standard</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="approval">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Approval Request</span>
                    <Badge variant="default">High Priority</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="policy">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4" />
                    <span>Policy Inquiry</span>
                    <Badge variant="secondary">Institutional</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Urgent Matter</span>
                    <Badge variant="destructive">Immediate</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getCategoryDescription(category)}
            </p>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Your Message to the Principal</Label>
            <Textarea
              id="message"
              placeholder="Compose your message to the Principal here. Be clear and specific about your request or concern..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px] resize-none"
              maxLength={maxLength}
            />
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(category)}
                <Badge variant={getCategoryColor(category) as any}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} 
                  {category === 'urgent' || category === 'approval' ? ' (High Priority)' : ''}
                </Badge>
              </div>
              <span className={`${remainingChars < 100 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                {remainingChars} characters remaining
              </span>
            </div>
          </div>

          {/* Status Messages */}
          {status.type !== 'idle' && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
              {status.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          {/* Info Box */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Telegram Delivery</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your message will be delivered instantly to the Principal's Telegram account. 
              Publisher messages receive priority handling and immediate notification.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={isLoading || !message.trim() || remainingChars < 0}
            className="min-w-[120px] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to Principal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}