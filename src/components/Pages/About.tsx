import { motion } from "framer-motion";
import img1 from "@/assets/image1.png";

export default function About() {
  return (
    <motion.section
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={img1}
        alt="About Us Cover"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-4 md:p-10 text-white text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
          About Us
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl px-2">
          Our mission is to provide exceptional services with a focus on
          innovation, quality, and sustainability. We strive to create impactful
          solutions that empower businesses globally.
        </p>
      </div>
    </motion.section>
  );
}
