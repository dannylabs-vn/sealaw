import React, { useState, useEffect, useRef } from 'react';
import daiNamImg from './assets/dai_nam.jpg';
import anNamImg from './assets/an_nam.jpg';
import banDoImg from './assets/ban_do.jpg';

import { 
  Anchor, 
  BookOpen, 
  MessageCircle, 
  Map as MapIcon, 
  ShieldCheck, 
  Info, 
  X, 
  Send,
  ChevronRight,
  Menu,
  Search,
  FileText,
  ExternalLink,
  Download,
  History,
  Navigation
} from 'lucide-react';
import MapView from './components/MapView'
import { islandsGeo } from './data/islands'

// Markdown parser component
const MarkdownMessage = ({ content }) => {
  // Helper function to parse inline formatting (bold, italic, etc.)
  const parseInlineFormatting = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    // Split by **bold** pattern
    const boldParts = text.split(/(\*\*[^*]+\*\*)/);
    
    return boldParts.map((part, idx) => {
      // Check if this part is bold
      if (part.match(/^\*\*[^*]+\*\*$/)) {
        const content = part.slice(2, -2);
        return <strong key={`bold-${idx}`}>{content}</strong>;
      }
      return part;
    });
  };

  const parseMarkdown = (text) => {
    const lines = text.split('\n');
    const result = [];

    lines.forEach((line, lineIdx) => {
      // Skip empty lines but add spacing
      if (!line || !line.trim()) {
        result.push(<div key={`empty-${lineIdx}`} className="h-1"></div>);
        return;
      }

      // Check for headings (#, ##, ###, etc.)
      const headingMatch = line.match(/^(#+)\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const headingContent = headingMatch[2];
        result.push(
          <div key={`heading-${lineIdx}`} className={`font-bold mt-3 mb-2 ${
            level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'
          }`}>
            {parseInlineFormatting(headingContent)}
          </div>
        );
        return;
      }

      // Check for bullet points (* or - at start of line)
      const bulletMatch = line.match(/^[-*]\s+(.+)$/);
      if (bulletMatch) {
        result.push(
          <div key={`bullet-${lineIdx}`} className="flex gap-2 ml-2">
            <span className="text-slate-700">•</span>
            <span>{parseInlineFormatting(bulletMatch[1])}</span>
          </div>
        );
        return;
      }

      // Regular text with inline formatting
      result.push(
        <div key={`line-${lineIdx}`} className="mb-1">
          {parseInlineFormatting(line)}
        </div>
      );
    });

    return result;
  };

  return <div className="space-y-1">{parseMarkdown(content)}</div>;
};

const footerLinks = {
  foreign: 'https://www.mofa.gov.vn',
  justice: 'https://moj.gov.vn',
  border: 'https://mofa.gov.vn/vi/chi-tiet-cctc/tochuc/uy-ban-bien-gioi-quoc-gia-26.html',
  coastguard: 'https://canhsatbien.vn/'
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Xin chào! Tôi là Trợ lý Luật Biển Việt Nam. Bạn cần tra cứu thông tin gì về quy định biển đảo không?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to check if response is likely truncated
  const isResponseTruncated = (text) => {
    if (!text) return false;
    // Check for incomplete sentences (ends with incomplete word or unclosed parenthesis)
    const incompletePhrases = [
      /\(\s*$/, // ends with unclosed (
      /hoặc\s*$/, // ends with hoặc
      /\s+or\s*$/, // ends with or
      /[,;]\s*$/, // ends with comma or semicolon
      /\w+\(\s*$/, // ends with word( 
    ];
    return incompletePhrases.some(pattern => pattern.test(text.trim()));
  };

  const handleSendMessage = async (retryCount = 0) => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let botResponse = null;
      let attempts = 0;
      const maxAttempts = 3;

      // Retry mechanism for truncated responses
      while (attempts < maxAttempts && !botResponse) {
        const res = await fetch("https://bright-thankful-malamute.ngrok-free.app/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            history: chatHistory,
            topic: null
          })
        });

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const data = await res.json();
        const response = data.reply || data.response || data.message || data.answer || "";

        // Validate response is not empty and not truncated
        if (response && response.trim().length > 0 && !isResponseTruncated(response)) {
          botResponse = response;
        } else if (response && response.trim().length > 50) {
          // If response is long enough but seems truncated, still use it but warn user
          botResponse = response + "\n\n⚠️ *Lưu ý: Phản hồi có thể không đầy đủ. Vui lòng gửi lại câu hỏi để nhận câu trả lời chi tiết hơn.*";
        } else if (attempts === maxAttempts - 1) {
          botResponse = "Xin lỗi, máy chủ không thể xử lý yêu cầu này lúc này. Vui lòng thử lại sau hoặc hỏi câu hỏi khác.";
        }

        attempts++;
        
        // Small delay before retry
        if (!botResponse && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      botResponse = botResponse || "Xin lỗi, tôi không thể xử lý yêu cầu này.";

      setChatHistory(prev => [...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botResponse }
      ]);
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch (err) {
      console.error('Chat Error:', err);
      setMessages(prev => [...prev, { role: 'bot', content: `Xin lỗi, đã xảy ra lỗi: ${err.message}. Vui lòng kiểm tra kết nối mạng và thử lại.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Các trang nội dung
  const renderContent = () => {
    switch(activeTab) {
      case 'law':
        return (
          <div className="py-12 px-4 max-w-7xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-8 text-blue-900 flex items-center gap-3">
              <FileText /> Hệ thống văn bản pháp luật
            </h2>
            <div className="grid gap-6">
              {[
                { title: "Luật Biển Việt Nam 2012", date: "21/06/2012", desc: "Văn bản pháp lý cơ bản nhất của Việt Nam về biển đảo.", type: "Trong nước", url: "https://thuvienphapluat.vn/van-ban/Giao-thong-Van-tai/Luat-bien-Viet-Nam-2012-143494.aspx" },
                { title: "Công ước UNCLOS 1982", date: "10/12/1982", desc: "Công ước Liên Hợp Quốc về Luật Biển - Cơ sở pháp lý quốc tế.", type: "Quốc tế", url: "https://vmrcc.gov.vn/thong-tin-phap-luat/cong-uoc-lien-hiep-quoc-ve-luat-bien-unclos-1982-250.html" },
                { title: "Tuyên bố DOC 2002", date: "04/11/2002", desc: "Tuyên bố về ứng xử của các bên ở Biển Đông giữa ASEAN và Trung Quốc.", type: "Quốc tế", url: "https://nghiencuubiendong.vn/tuyen-bo-ve-cach-ung-xu-cua-cac-ben-o-bien-dong.5989.adata" },
                { title: "Nghị định 61/2019/NĐ-CP", date: "10/07/2019", desc: "Quy định chi tiết một số điều và biện pháp thi hành Luật Cảnh sát biển Việt Nam.", type: "Trong nước", url: "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-dinh-61-2019-ND-CP-huong-dan-Luat-Canh-sat-bien-Viet-Nam-418521.aspx" }
              ].map((doc, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${doc.type === 'Trong nước' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                      {doc.type}
                    </span>
                    <h3 className="text-lg font-bold mt-2">{doc.title}</h3>
                    <p className="text-slate-500 text-sm">{doc.desc}</p>
                    <p className="text-slate-400 text-xs mt-1">Ban hành: {doc.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 flex items-center">
                      <ExternalLink size={20} />
                    </a>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 flex items-center">
                      <Download size={20} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="py-12 px-4 max-w-7xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-8 text-blue-900 flex items-center gap-3">
              <Navigation /> Bản đồ chủ quyền trực quan
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-200 aspect-video rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center border-4 border-white">
                   <div className="absolute inset-0">
                     <MapView geojson={islandsGeo} />
                   </div>
                  <div className="relative z-10 text-center p-6 bg-white/80 backdrop-blur rounded-xl max-w-md border border-white">
                    <MapIcon size={48} className="mx-auto text-blue-600 mb-4" />
                    <p className="font-medium text-slate-800">Hệ thống bản đồ tương tác đang tải dữ liệu tọa độ...</p>
                    <p className="text-sm text-slate-500 mt-2">Dữ liệu bao gồm: Đường cơ sở, Lãnh hải 12 hải lý, Vùng đặc quyền kinh tế (EEZ) và Thềm lục địa.</p>
                  </div>
                 {/* Marker giả lập */}
                 <div className="absolute top-1/3 right-1/4 group cursor-pointer">
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-ping absolute" />
                    <div className="w-4 h-4 bg-red-600 rounded-full relative" />
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">QĐ. TRƯỜNG SA</div>
                 </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-bold mb-4">Chú giải bản đồ</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3"><span className="w-4 h-1 bg-red-600 rounded"></span> Đường cơ sở</li>
                    <li className="flex items-center gap-3"><span className="w-4 h-1 bg-blue-400 rounded"></span> Vùng lãnh hải (12 hải lý)</li>
                    <li className="flex items-center gap-3"><span className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></span> Vùng đặc quyền kinh tế</li>
                    <li className="flex items-center gap-3"><span className="w-4 h-4 bg-red-500 rounded-full"></span> Điểm đảo/Cơ sở hạ tầng</li>
                  </ul>
                </div>
                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md">
                  <h3 className="font-bold mb-2">Tọa độ địa lý</h3>
                  <p className="text-sm text-blue-100 italic">"Hoàng Sa và Trường Sa là bộ phận không thể tách rời của lãnh thổ Việt Nam."</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="py-12 px-4 max-w-7xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-8 text-blue-900 flex items-center gap-3">
              <History /> Tư liệu & Bằng chứng lịch sử
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Đại Nam Thực Lục", time: "Thế kỷ 19", desc: "Ghi chép chính sử về việc triều đình nhà Nguyễn cử đội Hoàng Sa đi thực thi chủ quyền.", url: "https://www.thuvienhoasen.org/a37128/dai-nam-thuc-luc-toan-tap" },
                { title: "Bản đồ An Nam Đại Quốc Họa Đồ", time: "Năm 1838", desc: "Bản đồ của Giám mục Taberd vẽ rõ 'Paracel seu Cát Vàng' thuộc lãnh thổ Việt Nam.", url: "https://nghiencuulichsu.com/2014/09/29/nhan-xet-ve-an-nam-dai-quoc-hoa-do/" },
                { title: "Bộ sưu tập bản đồ phương Tây", time: "Thế kỷ 16-18", desc: "Hàng trăm bản đồ cổ của các nhà hàng hải Hà Lan, Bồ Đào Nha khẳng định chủ quyền.", url: "https://infonet.vietnamnet.vn/phat-hien-56-ban-do-co-phuong-tay-ve-hoang-sa-cua-viet-nam-122373.html" }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    <img src={
                      i === 0 ? daiNamImg : (i === 1 ? anNamImg : (i === 2 ? banDoImg : `https://mocban.vn/bo-van-khac-su-hoc-dai-nam-thuc-luc-nhung-dau-an-con-mai/${i}`))
                    } className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title}/>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-800">{item.time}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
                    >
                      Khám phá tư liệu
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-cyan-800/80 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000" 
                alt="Biển Việt Nam" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-20 text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight animate-in slide-in-from-bottom duration-700">
                  Pháp Lý Biển Đảo <br/> & Chủ Quyền Dân Tộc
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-light">
                  Cổng thông tin phổ biến kiến thức Luật Biển và hỗ trợ tra cứu pháp lý trực tuyến hàng đầu Việt Nam.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setActiveTab('law')} className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2">
                    <BookOpen size={20} /> Tìm hiểu Luật Biển 2012
                  </button>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} /> Chat với AI Trợ lý
                  </button>
                </div>
              </div>
            </section>

            {/* Features Preview */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div onClick={() => setActiveTab('law')} className="p-8 hover:bg-white rounded-2xl transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pháp lý chính thống</h3>
                  <p className="text-slate-500 text-sm">Cập nhật đầy đủ các văn bản quy phạm pháp luật mới nhất.</p>
                </div>
                <div onClick={() => setActiveTab('map')} className="p-8 hover:bg-white rounded-2xl transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                    <MapIcon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Bản đồ số hóa</h3>
                  <p className="text-slate-500 text-sm">Trải nghiệm trực quan về các vùng biển thuộc chủ quyền Việt Nam.</p>
                </div>
                <div onClick={() => setActiveTab('history')} className="p-8 hover:bg-white rounded-2xl transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                    <Info size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Tư liệu lịch sử</h3>
                  <p className="text-slate-500 text-sm">Kho tàng bằng chứng thép về chủ quyền đối với 2 quần đảo.</p>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="bg-blue-700 p-2 rounded-xl text-white shadow-lg">
                <Anchor size={28} />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tighter text-blue-900 block leading-none">OceanMind</span>
                <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">Website luật biển Việt Nam và Chatbot AI</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-wide">
              {[
                { id: 'home', label: 'Trang chủ' },
                { id: 'law', label: 'Chủ đề học tập' },
                { id: 'map', label: 'Bản đồ biển' },
                { id: 'history', label: 'Tư liệu' },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`transition-all pb-1 border-b-2 ${activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden lg:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                  <Search size={16} className="text-slate-400 mr-2" />
                  <input type="text" placeholder="Tìm kiếm văn bản..." className="bg-transparent outline-none text-xs w-32" />
               </div>
               <button className="md:hidden p-2 text-slate-600"><Menu /></button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-6">
              <Anchor size={24} className="text-blue-500" />
              <span className="font-bold text-xl uppercase tracking-tighter">Luật Biển Việt Nam</span>
            </div>
            <p className="max-w-md leading-relaxed">
              Đây là dự án thuộc môn Lịch sử do nhóm học sinh lớp 12A7 thực hiện, với mục tiêu nghiên cứu và lan tỏa hiểu biết về chủ quyền biển đảo Việt Nam, cũng như vai trò của cộng đồng ngư dân và lực lượng thực thi pháp luật trên biển.
            </p>
            <div className="mt-8 flex gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"><Info size={18} /></div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"><MapIcon size={18} /></div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Cơ quan chủ quản</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={footerLinks.foreign} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  Bộ Ngoại giao <ExternalLink size={12}/>
                </a>
              </li>
              <li>
                <a href={footerLinks.justice} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  Bộ Tư pháp <ExternalLink size={12}/>
                </a>
              </li>
              <li>
                <a href={footerLinks.border} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  Ủy ban Biên giới quốc gia <ExternalLink size={12}/>
                </a>
              </li>
              <li>
                <a href={footerLinks.coastguard} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  Cảnh sát biển Việt Nam <ExternalLink size={12}/>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Hỗ trợ pháp lý</h4>
            <p className="text-sm mb-4">Mọi thắc mắc về luật biển vui lòng gửi về:</p>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-white font-bold text-sm">dannyhong2310@gmail.com</p>
              <p className="text-[10px] mt-1 uppercase text-slate-500 tracking-wider">Thời gian hỗ trợ: 24/7</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Dự án Lịch Sử - 12A7. Bản quyền thuộc về cộng đồng yêu biển đảo Việt Nam.
        </div>
      </footer>

      {/* Chatbot Interface */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${isChatOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-white w-[350px] sm:w-[400px] h-[580px] rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden ring-1 ring-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 flex justify-between items-center text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <MessageCircle size={22} />
              </div>
              <div>
                <p className="font-bold text-sm leading-none mb-1">O-Mind ChatbotAI</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-blue-100 font-medium tracking-wide">TRỰC TUYẾN</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 shadow-inner">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <MarkdownMessage content={msg.content} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isLoading ? "Đang xử lý..." : "Nhập câu hỏi tra cứu luật..."}
                disabled={isLoading}
                className="flex-1 bg-transparent px-3 py-2 outline-none text-sm placeholder:text-slate-400 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">Hỗ trợ tra cứu tự động dựa trên UNCLOS 1982 & Luật Biển 2012</p>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-5 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all z-40 group"
        >
          <MessageCircle size={32} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest shadow-xl">
            Hỏi Trợ lý Luật Biển
          </span>
        </button>
      )}
    </div>
  );
};

export default App;