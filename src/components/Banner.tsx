import CustomButton from "./CustomButton";
import ImageViewer from "./ImageViewer";

const banners = [
  {
    id: 1,
    title: "Pharmacy at your doorstep!",
    description: "Cough syrups, pain relief sprays & more",
    buttonText: "Order Now",
    bgColor: "bg-teal-500",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Pet Care supplies in minutes",
    description: "Food, treats, toys & more",
    buttonText: "Order Now",
    bgColor: "bg-yellow-400",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "No time for a diaper run?",
    description: "Get baby care essentials in minutes",
    buttonText: "Order Now",
    bgColor: "bg-blue-200",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop"
  }
];

const Banner = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className={`${banner.bgColor} rounded-lg overflow-hidden relative h-48 md:h-64`}
        >
          <div className="absolute inset-0">
            <ImageViewer
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover mix-blend-overlay opacity-20"
            />
          </div>
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{banner.title}</h3>
              <p className="text-sm md:text-base text-white/90">{banner.description}</p>
            </div>
            <CustomButton className="bg-white text-primary-text px-4 py-2 rounded-lg w-fit hover:bg-gray-300 transition-colors text-sm md:text-base">
              <p className="text-primary-text">{banner.buttonText}</p>
            </CustomButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;