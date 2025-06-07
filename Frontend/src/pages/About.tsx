
import React from 'react';

const AboutUs = () => {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16 flex items-center justify-center">
      <div className="max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold text-primary">About Us</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Welcome to <strong>RushSphere</strong>, your ultimate online marketplace where diversity meets convenience.
          At RushSphere, we bring together a vibrant community of vendors and shoppers, offering a seamless platform to
          discover, buy, and sell a wide array of products across various categories.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Our mission is to empower small businesses and individual sellers by providing them with a dynamic and
          user-friendly marketplace. Whether you're a buyer searching for unique finds or a vendor looking to grow your
          brand, RushSphere is here to connect you with millions of customers worldwide.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          With a commitment to quality, security, and exceptional service, we strive to create a trusted environment
          where everyone can shop and sell with confidence. Join us today and experience the future of online shopping
          and selling!
        </p>
        <p className="text-lg font-semibold text-primary">
          RushSphere — Connecting Buyers and Sellers, Globally.
        </p>
      </div>
    </main>
  );
};

export default AboutUs;

