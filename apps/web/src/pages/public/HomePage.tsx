import { MarketingHeader, HeroBackground } from '@/components/layout/MarketingLayout';
import { HomeHeroSection } from '@/components/marketing/HomeHeroSection';
import { HomeFeaturesSection } from '@/components/marketing/HomeFeaturesSection';
import { FeaturedChampionshipsSection } from '@/components/marketing/FeaturedChampionshipsSection';
import { HomePricingSection } from '@/components/marketing/HomePricingSection';
import { HomeContactSection } from '@/components/marketing/HomeContactSection';
import { HomeReviewsSection } from '@/components/marketing/HomeReviewsSection';
import { HomeFooterSection } from '@/components/marketing/HomeFooterSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBackground>
        <MarketingHeader />
        <HomeHeroSection />
      </HeroBackground>

      <HomeFeaturesSection />
      <FeaturedChampionshipsSection />
      <HomePricingSection />
      <HomeContactSection />
      <HomeReviewsSection />
      <HomeFooterSection />
    </div>
  );
}
