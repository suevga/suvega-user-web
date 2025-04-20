import { useLocationStore } from '../store/useLocationStore';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import CategorySection from '../components/CategorySection';
import CustomizedSwiperSlider from '../components/CustomizedSwiperSlider';

const HomePage = () => {
  const { latitude, longitude} = useLocationStore();
  console.log("Latitude in home page: ", latitude);
  console.log("Longitude in home page: ", longitude);
  

  return (
    <div className="mx-auto px-2 py-8">
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