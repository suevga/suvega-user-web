import { useLocationStore } from '../store/useLocationStore';
import useCategoryStore from '../store/useCategoryStore';
import useProductStore from '../store/useProductStore';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import CategorySection from '../components/CategorySection';
import CustomizedSwiperSlider from '../components/CustomizedSwiperSlider';
import ProductSection from '../components/ProductSection';

const HomePage = () => {
  const { latitude, longitude} = useLocationStore();
  console.log("Latitude in home page: ", latitude);
  console.log("Longitude in home page: ", longitude);
  const { categories } = useCategoryStore();
  const { products } = useProductStore();

  console.log("Categories in home page: ", categories);
  console.log("Products in home page: ", products);
  // Limit the number of categories to 4-5
  const limitedCategories = categories.slice(0, 5);

  return (
    <div className="mx-auto px-2 py-8">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-2 py-20">
        <div className="hidden md:block">
          <Banner />
        </div>
        <CategorySection />
        <CustomizedSwiperSlider/>
        {/* Render ProductSection for each limited category */}
        {limitedCategories.map((category) => (
          <ProductSection key={category._id} categoryId={category._id} />
        ))}
      </div>
    </div>
  )
}

export default HomePage