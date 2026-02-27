import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatbotWidget from '../components/chatbot/ChatbotWidget';
import { ChatbotProvider } from '../context/ChatbotContext';

export default function MainLayout() {
  return (
    <ChatbotProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <ChatbotWidget />
      </div>
    </ChatbotProvider>
  );
}
