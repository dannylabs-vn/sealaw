import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/common/ScrollToTop';
import MainLayout from './layouts/MainLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const LawPage = lazy(() => import('./pages/LawPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm font-medium">Đang tải...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/luat-bien" element={<LawPage />} />
            <Route path="/ban-do" element={<MapPage />} />
            <Route path="/lich-su" element={<HistoryPage />} />
            <Route path="/dong-thoi-gian" element={<TimelinePage />} />
            <Route path="/kiem-tra" element={<QuizPage />} />
            <Route path="/thong-ke" element={<StatisticsPage />} />
            <Route path="/tin-tuc" element={<NewsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
