import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import MovieDetails from "./MovieDetails";
import Recommendations from "./Recommendations";
import SearchIcon from "./search.svg";
import "./App.css";

const API_URL = "http://www.omdbapi.com?apikey=b6003d8a";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async (title) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search.slice(0, 10)); // Display the first 10 movies
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const searchEnterKey = (e) => {
    if (e.key === "Enter") {
      searchMovies(searchTerm);
    }
  };

  useEffect(() => {
    searchMovies("batman"); // Default search when the app loads
  }, []);

  return (
    <Router>
      <div className="app fade-in">
        {/* The MovieZone title navigates back to the home screen */}
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault(); // Prevent React Router's default navigation
            window.location.reload(); // Trigger full page reload
          }}
          className="home-link"
        >
          <h1>MOVIEZONE</h1>
        </Link>

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <div className="search fade-in">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for movies"
                    onKeyDown={searchEnterKey}
                  />
                  <img
                    src={SearchIcon}
                    alt="search button"
                    onClick={() => searchMovies(searchTerm)}
                  />
                  <Link to="/recommendations" className="recommendation-link">
                    Recommendations
                  </Link>
                </div>

                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                  </div>
                ) : movies?.length > 0 ? (
                  <div className="container fade-in">
                    {movies.map((movie) => (
                      <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID}>
                        <MovieCard movie={movie} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="empty fade-in">
                    <h2>No movies found</h2>
                  </div>
                )}
              </>
            }
          />

          {/* Recommendations Page */}
          <Route path="/recommendations" element={<Recommendations />} />

          {/* Movie Details Page */}
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
