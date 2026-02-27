import HeroSection from '../components/home/HeroSection';
import FeaturesPreview from '../components/home/FeaturesPreview';
import StatsPreview from '../components/home/StatsPreview';
import NewsCarousel from '../components/home/NewsCarousel';
import QuoteSection from '../components/home/QuoteSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesPreview />
      <StatsPreview />
      <NewsCarousel />
      <QuoteSection />
    </>
  );
}
