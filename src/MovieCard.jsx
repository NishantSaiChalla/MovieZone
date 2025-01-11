import React, { useEffect, useState } from "react";

const WATCHMODE_API_URL = "https://api.watchmode.com/v1/title/";
const WATCHMODE_API_KEY = "lTsWm5fLodEbcVhMtFZTejNIZ9xrMWdvz4gXHwqo";

const MovieCard = ({ movie }) => {
  const [streaming, setStreaming] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!movie || !movie.imdbID) return;

    const fetchStreamingData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${WATCHMODE_API_URL}${movie.imdbID}/sources/?apiKey=${WATCHMODE_API_KEY}`
        );
        const data = await response.json();

        // Filter for sources available in Canada and of type 'sub' or 'free'
        const filteredSources = data.filter(
          (source) =>
            (source.type === "sub" || source.type === "free") &&
            source.region === "CA"
        );

        // Deduplicate by name (case-insensitive)
        const uniqueSources = filteredSources.reduce((acc, current) => {
          const exists = acc.some(
            (source) => source.name.toLowerCase() === current.name.toLowerCase()
          );
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        setStreaming(uniqueSources);
      } catch (err) {
        console.error("Error fetching streaming data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamingData();
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="movie">
      <div>
        <p>{movie.Year}</p>
      </div>

      <div>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"}
          alt={movie.Title}
        />
      </div>

      <div>
        <span>{movie.Type}</span>
        <h3>{movie.Title}</h3>

        {!isLoading && streaming.length > 0 && (
          <div className="streaming-info">
            {streaming.map((source) => (
              <a
                key={source.id}
                href={source.web_url}
                target="_blank"
                rel="noopener noreferrer"
                className="streaming-link"
              >
                {source.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
