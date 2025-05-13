import { useLocationStore } from '../store/useLocationStore';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import CategorySection from '../components/CategorySection';
import CustomizedSwiperSlider from '../components/CustomizedSwiperSlider';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  const { latitude, longitude} = useLocationStore();
  console.log("Latitude in home page: ", latitude);
  console.log("Longitude in home page: ", longitude);
  

  return (
    <div className="mx-auto px-2 py-8">
      <Helmet>
        <title>Suvega | Get everything under 15 minutes</title>
        <meta name="description" content="suvega is a quick-commerce platform where you can get everything under 15 minutes in your city. we value your time and convenience." />
        <link rel="canonical" href="https://suveganow.com" />
        <meta property="og:title" content="suvega | Buy Fresh Groceries Online" />
        <meta property="og:description" content="suvega is a quick-commerce platform where you can get everything under 15 minutes." />
        <meta property="og:image" content="https://suveganow.com/og-image.png" />
        <meta property="og:url" content="https://suveganow.com" />
        <meta property="og:site_name" content="Suvega" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="suvega | Buy Fresh Groceries Online" />
        <meta property="og:image:type" content="image/png" />        
      </Helmet>
      {/* Navbar only visible on small screens */}
      <div className="sm:hidden">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto px-2 py-20">
        <div className="hidden md:block">
          <Banner />
        </div>
        <CategorySection />
        <CustomizedSwiperSlider/>
      </div>
    </div>
  )
}

export default HomePage