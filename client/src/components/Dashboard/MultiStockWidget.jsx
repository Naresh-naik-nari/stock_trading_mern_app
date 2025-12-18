import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5001/api/news/")
      .then(res => {
        setNews(res.data.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading news...</div>;

  return (
    <div>
      <h3>Market News</h3>
      <ul>
        {news.map((item, idx) => (
          <li key={idx}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">{item.headline}</a>
            <div>{item.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 