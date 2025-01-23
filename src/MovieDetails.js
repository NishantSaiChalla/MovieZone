import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "https://www.omdbapi.com?apikey=b6003d8a";
const WATCHMODE_API_URL = "https://api.watchmode.com/v1/title/";
const WATCHMODE_API_KEY = "lTsWm5fLodEbcVhMtFZTejNIZ9xrMWdvz4gXHwqo";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [streaming, setStreaming] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${API_URL}&i=${id}`);
        const data = await response.json();
        setMovie(data);

        const watchModeResponse = await fetch(
          `${WATCHMODE_API_URL}${id}/sources/?apiKey=${WATCHMODE_API_KEY}`
        );
        const watchModeData = await watchModeResponse.json();
        const streamingSources = watchModeData.filter(
          (source) => source.type === "sub" || source.type === "free"
        );
        setStreaming(streamingSources);
      } catch (error) {
        console.error("Error fetching movie and streaming details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return (
      <div className="movie-details">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="back-button">
          &#8592; Back
        </button>
        <h2>Loading movie details...</h2>
      </div>
    );
  }

  return (
    <div className="movie-details">
      <button onClick={() => navigate(-1)} className="back-button">
        &#8592; Back
      </button>
      <h2>{movie.Title}</h2>
      <p>
        <strong>Year:</strong> {movie.Year}
      </p>
      <p>
        <strong>Genre:</strong> {movie.Genre}
      </p>
      <p>
        <strong>Plot:</strong> {movie.Plot}
      </p>
      <p>
        <strong>Actors:</strong> {movie.Actors}
      </p>
      <img
        src={movie.Poster}
        alt={movie.Title}
        style={{ maxWidth: "300px", borderRadius: "8px", marginTop: "1rem" }}
      />
      <div className="streaming-info">
        <h3>Available on:</h3>
        {streaming.length > 0 ? (
          streaming.map((source) => (
            <a
              key={source.id}
              href={source.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="streaming-link"
            >
              {source.name}
            </a>
          ))
        ) : (
          <p>No streaming data available</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
