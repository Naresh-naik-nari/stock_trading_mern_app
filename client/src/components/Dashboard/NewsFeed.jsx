import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Divider, Link } from "@material-ui/core";
import { RssFeed as RssFeedIcon } from "@material-ui/icons";
import axios from "axios";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5001/api/news/");
        setNews(res.data.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error('News fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000); // refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent style={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body2" style={{ marginTop: 16 }}>
            Loading news...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <RssFeedIcon style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Market News
        </Typography>
        {error && (
          <Typography variant="body2" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        {news.length > 0 ? (
          <List>
            {news.map((item, idx) => (
              <React.Fragment key={idx}>
                <ListItem>
                  <img src={item.image} alt={item.headline} style={{ width: '100px', marginRight: '16px' }} />
                  <ListItemText
                    primary={
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        style={{ fontWeight: 'bold' }}
                      >
                        {item.headline}
                      </Link>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {item.summary}
                      </Typography>
                    }
                  />
                </ListItem>
                {idx < news.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No news available at the moment.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
} 