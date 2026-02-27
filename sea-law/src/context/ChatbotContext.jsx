import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ChatbotContext = createContext();

const CHAT_API = import.meta.env.VITE_CHATBOT_API_URL || 'https://bright-thankful-malamute.ngrok-free.app/chat';

const WELCOME_MESSAGE = {
  role: 'bot',
  content: 'Chào bạn! Tôi là trợ lý tri thức chuyên về **Biển đảo Việt Nam**. Tôi có thể hỗ trợ bạn tìm hiểu về:\n* **Địa lý biển đảo:** Vị trí, đặc điểm các đảo, quần đảo, vùng biển của Việt Nam.\n* **Chủ quyền biển đảo:** Các bằng chứng lịch sử, pháp lý khẳng định chủ quyền đối với Hoàng Sa và Trường Sa.\n* **Lịch sử biển đảo:** Quá trình xác lập và thực thi chủ quyền qua các thời kỳ.\n* **Luật biển (UNCLOS 1982):** Các quy định của Công ước Liên Hợp Quốc về Luật Biển.\n* **Môi trường biển:** Đa dạng sinh học, ô nhiễm, biến đổi khí hậu.\n* **Kinh tế biển:** Ngư nghiệp, du lịch, dầu khí, vận tải biển.\n* **An ninh - Quốc phòng:** Vai trò biển đảo trong bảo vệ Tổ quốc.\nBạn quan tâm đến vấn đề cụ thể nào? Hãy cho tôi biết nhé!'
};

export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const pendingAutoAskRef = useRef(null);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const sendMessage = useCallback(async (text, topicOverride) => {
    if (!text.trim() || isLoading) return;
    const userMessage = text.trim();

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Build topic - use override if provided, else from selected island
    const topic = topicOverride || (selectedIsland ? selectedIsland.properties?.name : null);

    try {
      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: chatHistory, topic })
      });

      const data = await res.json();
      const botResponse = data.reply || data.response || data.message || data.answer || 'Xin lỗi, tôi không thể xử lý yêu cầu này.';

      setChatHistory(prev => [...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botResponse }
      ]);
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: 'Xin lỗi, đã xảy ra lỗi kết nối. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatHistory, selectedIsland]);

  // Auto-ask about island when selected from map
  useEffect(() => {
    if (pendingAutoAskRef.current && !isLoading) {
      const { name, topic } = pendingAutoAskRef.current;
      pendingAutoAskRef.current = null;
      sendMessage(
        `Hãy cho tôi biết thông tin chi tiết về ${name}, bao gồm vị trí, lịch sử, ý nghĩa chủ quyền và tình trạng hiện tại.`,
        topic
      );
    }
  }, [isLoading, sendMessage]);

  const selectIsland = useCallback((feature) => {
    if (!feature) return;
    const props = feature.properties;
    setSelectedIsland(feature);
    setIsOpen(true);

    // Add island info card message
    setMessages(prev => [...prev, {
      role: 'island-info',
      island: {
        name: props.name,
        note: props.note,
        category: props.category,
        area: props.area,
        status: props.status,
        coordinates: feature.geometry.coordinates,
      }
    }]);

    // Queue auto-ask - will fire via useEffect when not loading
    pendingAutoAskRef.current = { name: props.name, topic: props.name };
  }, []);

  const clearIslandContext = useCallback(() => {
    setSelectedIsland(null);
  }, []);

  const askAboutIsland = useCallback((islandName) => {
    sendMessage(
      `Hãy cho tôi biết thông tin chi tiết về ${islandName}, bao gồm vị trí, lịch sử, ý nghĩa chủ quyền và tình trạng hiện tại.`,
      islandName
    );
  }, [sendMessage]);

  return (
    <ChatbotContext.Provider value={{
      isOpen, openChat, closeChat,
      selectedIsland, selectIsland, clearIslandContext,
      messages, sendMessage, askAboutIsland,
      isLoading, chatEndRef
    }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) throw new Error('useChatbot must be used within ChatbotProvider');
  return context;
}
