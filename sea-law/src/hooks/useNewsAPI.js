import { useState, useEffect } from 'react';
import axios from 'axios';
import { fallbackNews } from '../data/fallback-news';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';
const CACHE_KEY = 'oceanmind-news-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function useNewsAPI(query = 'biển Đông Việt Nam Hoàng Sa Trường Sa', pageSize = 6) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      // Check cache first
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setArticles(data);
            setLoading(false);
            return;
          }
        }
      } catch { /* ignore cache errors */ }

      // Try API if key is available
      if (API_KEY) {
        try {
          const res = await axios.get(BASE_URL, {
            params: {
              q: query,
              language: 'vi',
              sortBy: 'publishedAt',
              pageSize,
              apiKey: API_KEY
            },
            timeout: 8000
          });

          if (res.data.articles && res.data.articles.length > 0) {
            const newsData = res.data.articles;
            setArticles(newsData);
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: newsData, timestamp: Date.now() }));
            setLoading(false);
            return;
          }
        } catch {
          // API failed, use fallback
        }
      }

      // Fallback to static data
      setArticles(fallbackNews);
      setError('Sử dụng dữ liệu tin tức mẫu');
      setLoading(false);
    };

    fetchNews();
  }, [query, pageSize]);

  return { articles, loading, error };
}
