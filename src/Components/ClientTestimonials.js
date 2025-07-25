import React, { useState } from "react";
import "./ClientTestimonials.css";

const reviews = [
  {
    text: "TrustCoinFX helped me transition from traditional stocks to crypto with ease. Their risk tools and insights are game changers.",
    name: "Amina Boateng",
    role: "Investment Strategist",
    rating: 5,
    reviewsCount: 14872,
  },
  {
    text: "I was skeptical at first, but now I use TrustCoinFX every day. Their staking plans and real-time updates keep me ahead.",
    name: "Takashi Sato",
    role: "Retail Crypto Trader",
    rating: 4,
    reviewsCount: 22857,
  },
  {
    text: "Their platform is reliable, clean, and well-optimized. I’ve doubled my ROI since I joined, and I trust their roadmap.",
    name: "Sofia Almeida",
    role: "DeFi Research Analyst",
    rating: 5,
    reviewsCount: 37492,
  },
  {
    text: "TrustCoinFX’s fixed-ROI plans are unmatched. No hidden terms, just solid growth. This is how modern investing should feel.",
    name: "Camilo Torres",
    role: "Financial Blogger",
    rating: 5,
    reviewsCount: 11809,
  },
  {
    text: "Hands down the best support team I've dealt with in crypto. They actually respond and resolve issues fast. 10/10 experience.",
    name: "Mereana Rangi",
    role: "Web3 App Developer",
    rating: 5,
    reviewsCount: 6724,
  },
];

const ClientTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="client-testimonials">
      <p style={{ fontSize: "25px" }}>Success Stories from Our Clients</p>
      <p className="subheading">
        Discover how TrustCoinFX has empowered individuals and businesses in
        their crypto trading and investment journey.
      </p>

      <div className="testimonial-container">
        {/* Left Circle Section */}
        <div className="review-circle">
          <p className="review-title">Amazing !</p>
          <div className="stars">
            {"★".repeat(reviews[currentIndex].rating)}
          </div>
          <p className="review-count">
            {reviews[currentIndex].reviewsCount} Reviews
          </p>
        </div>

        {/* Right Review Section */}
        <div className="testimonial-content">
          <p className="review-text">"{reviews[currentIndex].text}"</p>
          <p className="review-author">
            <strong>{reviews[currentIndex].name}</strong>
          </p>
          <p className="review-role">{reviews[currentIndex].role}</p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="navigation-buttons">
        <button onClick={prevReview} className="nav-btn">
          ←
        </button>
        <button onClick={nextReview} className="nav-btn">
          →
        </button>
      </div>
    </section>
  );
};

export default ClientTestimonials;
