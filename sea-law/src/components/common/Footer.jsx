import { Anchor, ExternalLink, MapPin, Mail, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  foreign: 'https://www.mofa.gov.vn',
  justice: 'https://moj.gov.vn',
  border: 'https://mofa.gov.vn/vi/chi-tiet-cctc/tochuc/uy-ban-bien-gioi-quoc-gia-26.html',
  coastguard: 'https://canhsatbien.vn/'
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-4 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 text-white mb-6">
            <Anchor size={24} className="text-blue-500" />
            <span className="font-bold text-xl uppercase tracking-tighter">OceanMind</span>
          </div>
          <p className="max-w-md leading-relaxed">
            Đây là dự án thuộc môn Lịch sử do nhóm học sinh lớp 12A7 thực hiện, với mục tiêu nghiên cứu và lan tỏa hiểu biết về chủ quyền biển đảo Việt Nam, cũng như vai trò của cộng đồng ngư dân và lực lượng thực thi pháp luật trên biển.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/ban-do" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
              <MapPin size={18} />
            </Link>
            <Link to="/lich-su" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
              <Info size={18} />
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Cơ quan chủ quản</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={footerLinks.foreign} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                Bộ Ngoại giao <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href={footerLinks.justice} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                Bộ Tư pháp <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href={footerLinks.border} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                Ủy ban Biên giới quốc gia <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href={footerLinks.coastguard} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                Cảnh sát biển Việt Nam <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-[0.2em]">Hỗ trợ pháp lý</h4>
          <p className="text-sm mb-4">Mọi thắc mắc về luật biển vui lòng gửi về:</p>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-white font-bold text-sm flex items-center gap-2"><Mail size={14} /> dannyhong2310@gmail.com</p>
            <p className="text-[10px] mt-1 uppercase text-slate-500 tracking-wider">Thời gian hỗ trợ: 24/7</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} OceanMind - Dự án Lịch Sử 12A7. Bản quyền thuộc về cộng đồng yêu biển đảo Việt Nam.
      </div>
    </footer>
  );
}
