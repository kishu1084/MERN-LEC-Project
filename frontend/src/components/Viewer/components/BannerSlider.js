import React, { useEffect, useState } from "react";

const BannerSlider = () => {
  const images = [
    "./css.png",
    "./fullStack.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 1000); // Change every 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="banner-container">
      <img
        src={images[currentIndex]}
        className="d-block w-100"
        alt="Banner"
      />
    </div>
  );
};

export default BannerSlider;
