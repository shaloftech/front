import React, { useEffect, useState } from "react";
import axios from "axios";

const CryptoNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          "https://cryptopanic.com/api/developer/v2/posts/",
          {
            params: {
              auth_token: "03bbeaa0e21fdeaa30e04a456d7ea8dc537170e0",
            },
          }
        );
        setNews(res.data.results);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div
      className="p-4 text-white min-h-screen"
      style={{
        backgroundImage: "linear-gradient(to right, #2f1c58, #090f3b)",
      }}
    >
      <h2 className="text-2xl font-bold mb-4">Latest Cryptocurrency News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.slice(0, 9).map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 p-4 rounded shadow hover:shadow-lg transition duration-200"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            </a>
            <p className="text-sm text-gray-400 mb-1">
              Source: {item.source?.title || item.domain}
            </p>
            <p className="text-sm text-gray-500">
              Published: {new Date(item.published_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href="https://cryptopanic.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-500 hover:text-blue-300 hover:underline text-sm font-medium transition duration-150"
        >
          View more →
        </a>
      </div>
    </div>
  );
};

export default CryptoNews;
