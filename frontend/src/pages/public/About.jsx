import React from "react";

const About = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 font-sans">
      <h1 className="text-3xl font-bold text-[#4a1c02] mb-3">
        About YummyStation
      </h1>
      <p className="text-gray-600 text-base leading-relaxed">
        Welcome to YummyStation! We are passionate about bringing delicious recipes and 
        culinary joy right into your home kitchen. Whether you are an absolute beginner 
        or an experienced home cook, our platform offers hand-picked meals to level up your cooking.
      </p>

      <h2 className="text-xl font-semibold text-[#4a1c02] mt-8 mb-3">
        Our Mission
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed">
        Our mission is simple: to make cooking fun, accessible, and high-quality. We provide 
        clear recipes, step-by-step guidance, and secure online order checkouts to make sure 
        your culinary journey runs smoothly from selection to payment.
      </p>

      <div className="mt-10 bg-[#f9f6f5] p-5 rounded-lg border border-stone-200/50">
        <h3 className="text-lg font-medium text-[#4a1c02] mb-2">Fast Facts</h3>
        <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
          <li>Over 24+ global recipe courses available</li>
          <li>Tested and approved by kitchen experts</li>
          <li>Integrated with secure eSewa payments for local orders</li>
        </ul>
      </div>
    </div>
  );
};

export default About;