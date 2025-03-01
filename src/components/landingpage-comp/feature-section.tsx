import images from "@/assets/images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Sample features data (you can modify this based on your needs)
const features = [
  {
    id: 1,
    title: "Pay supplier invoices",
    description: "Streamline SMB trade, making it easier and faster than ever.",
    route: "/features/pay-supplier-invoices",
    image: images.image1,
  },
  {
    id: 2,
    title: "Track expenses",
    description: "Monitor and manage your expenses with intuitive tools.",
    route: "/features/track-expenses",
    image: images.image2,
  },
  {
    id: 3,
    title: "Generate reports",
    description: "Create detailed financial reports in just a few clicks.",
    route: "/features/generate-reports",
    image: images.image3,
  },
  {
    id: 4,
    title: "Manage inventory",
    description: "Keep track of your stock levels with real-time updates.",
    route: "/features/manage-inventory",
    image: images.image4,
  },
  {
    id: 5,
    title: "Process payments",
    description: "Accept payments securely from multiple channels.",
    route: "/features/process-payments",
    image: images.image5,
  },
  {
    id: 6,
    title: "Integrate apps",
    description: "Connect with your favorite tools seamlessly.",
    route: "/features/integrate-apps",
    image: images.image6,
  },
];

export function FeatureSec() {
  // Sample handler for adding to cart (replace with your actual cart logic)
  const handleAddToCart = (feature: { id: number; title: string; description: string; route: string; image: string }) => {
    console.log(`${feature.title} added to cart!`);
    // Add your cart logic here (e.g., update state, call an API, etc.)
  };

  return (
    <div className="abeezee-regular w-full py-12 md:py-20 lg:py-32 xl:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          {/* Header Section */}
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant="secondary">Platform</Badge>
            </div>
            <div className="flex gap-3 flex-col">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter font-semibold text-left">
                Something new!
              </h2>
              <p className="text-base sm:text-lg md:max-w-xl lg:max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-left">
                Managing a small business today is already tough. Our platform helps you simplify processes and save time.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col gap-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-300 group h-full min-h-[400px]" // Added min height for consistency
              >
                {/* Link wraps the image and title for navigation */}
                <Link to={feature.route} className="flex flex-col flex-1">
                  {/* Image Container */}
                  <div className="rounded-none aspect-square mb-2 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Feature Info */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                      {feature.description}
                    </p>
                  </div>
                </Link>
                {/* Add to Cart Button */}
                <Button
                  variant="ghost"
                  className="mt-2 w-full bg-[#521635] hover:bg-white rounded-none text-white hover:text-[#521635] hover:border-2 hover:border-[#521635]"
                  onClick={() => handleAddToCart(feature)}
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureSec;