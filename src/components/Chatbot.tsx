import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your HerbalChain assistant. I can help you with questions about using the platform, understanding supply chain processes, or troubleshooting issues. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses: Record<string, string> = {
    'how to scan qr': 'To scan a QR code: 1) Click the "Scan QR Code" button, 2) Allow camera permissions, 3) Point your camera at the QR code, 4) Wait for automatic detection. The QR code contains batch information including farmer details, herb type, and supply chain stage.',
    'upload batch': 'To upload a new batch as a farmer: 1) Click "Upload New Batch", 2) Select the herb type from dropdown, 3) Enter quantity in kg, 4) Take a live photo of your herbs, 5) Click "Upload Batch" to generate QR code.',
    'payment status': 'You can check your payment status in the Farmer Portal dashboard. Payments are processed after batch collection and verification. Contact your aggregator if payment is delayed beyond the agreed timeframe.',
    'quality certificate': 'Quality certificates are uploaded by processors after testing. As a consumer, you can view certificates by scanning the final product QR code. Processors must upload certificates before batch completion.',
    'fraud alert': 'If you notice suspicious activity: 1) Report immediately through the notification system, 2) Provide batch ID and location details, 3) Admin team will investigate within 24 hours. Common fraud indicators include duplicate QR codes or invalid certificates.',
    'dark mode': 'You can toggle dark mode using the sun/moon icon in the top navigation bar. Your preference is saved automatically.',
    'language change': 'To change language: 1) Click the hamburger menu (3 lines), 2) Select "Profile Settings", 3) Choose your preferred language from the dropdown. We support Hindi, Tamil, Telugu, Kannada, Bengali, and more.',
    'roles': 'HerbalChain has 5 roles: Farmer (grows herbs), Aggregator (collects from farmers), Distributor (transports batches), Processor (processes and certifies), Admin (manages system). Each role has specific permissions and responsibilities.',
    'blockchain': 'HerbalChain uses blockchain to ensure transparency and immutability. Every transaction is recorded on the blockchain, creating an unchangeable record of the herb\'s journey from farm to consumer.',
    'help': 'I can help with: QR code scanning, batch uploads, payment queries, quality certificates, fraud reporting, app navigation, role explanations, and technical support. Just ask me anything!'
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching response
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(key) || key.split(' ').some(word => lowerMessage.includes(word))) {
        return response;
      }
    }

    // Default responses for common patterns
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! Welcome to HerbalChain. I\'m here to help you navigate the platform and answer any questions you have about the herbal supply chain process.';
    }
    
    if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with regarding HerbalChain?';
    }

    if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('error')) {
      return 'I\'m sorry to hear you\'re experiencing issues. Can you please describe the specific problem you\'re facing? I\'ll do my best to help you resolve it.';
    }

    return 'I understand you\'re asking about "' + userMessage + '". While I don\'t have a specific answer for that, I can help with QR scanning, batch uploads, payments, certificates, and general platform navigation. Could you rephrase your question or ask about one of these topics?';
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="herbal-gradient rounded-full w-14 h-14 shadow-herbal-lg hover:scale-110 transition-herbal"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96">
      <Card className="h-full shadow-herbal-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full herbal-gradient flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">HerbalChain Assistant</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full herbal-gradient flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[240px] p-3 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'herbal-gradient text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full herbal-gradient flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={!inputText.trim() || isTyping}
                className="herbal-gradient flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {['How to scan QR?', 'Upload batch', 'Payment status'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => setInputText(suggestion)}
                  disabled={isTyping}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;