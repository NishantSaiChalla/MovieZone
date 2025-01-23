import React, { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

const API_URL = "https://www.omdbapi.com?apikey=b6003d8a";

const Recommendations = () => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({});
  const [recommendedMovie, setRecommendedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const questions = [
    { id: 1, text: "What genre do you prefer?", options: ["Action", "Drama", "Comedy", "Horror", "Sci-Fi", "Romance", "Thriller", "Animation"] },
    { id: 2, text: "What mood or theme do you prefer?", options: ["Feel-Good", "Suspenseful", "Heart-Wrenching", "Action-Packed", "Romantic"] },
    { id: 3, text: "Do you prefer recent or classic movies?", options: ["Recent (2020+)", "Classics (Before 2000)", "Any"] },
    { id: 4, text: "What runtime do you prefer?", options: ["< 90 mins", "90-120 mins", "> 120 mins"] },
    { id: 5, text: "Do you prefer a specific language?", options: ["English", "Spanish", "French", "Hindi", "Korean", "Doesn't matter"] },
    { id: 6, text: "Should the movie be highly rated?", options: ["Yes (IMDb 8+)", "No (Any rating is fine)"] },
    { id: 7, text: "What kind of lead character do you prefer?", options: ["Hero", "Anti-Hero", "Villain Protagonist", "Strong Female Lead", "Doesn't matter"] },
    { id: 8, text: "What kind of ending do you prefer?", options: ["Happy Ending", "Open Ending", "Plot Twist", "Doesn't matter"] },
  ];

  const handleOptionClick = (questionId, option) => {
    setPreferences((prev) => ({ ...prev, [questionId]: option }));
    if (step < questions.length) {
      setStep((prev) => prev + 1);
    } else {
      recommendMovie();
    }
  };

  const recommendMovie = async () => {
    setLoading(true);
    setError(null);

    const genre = preferences[1]?.toLowerCase() || "";
    const mood = preferences[2]?.toLowerCase() || "";
    const year = preferences[3] === "Recent (2020+)" ? "2020" : preferences[3] === "Classics (Before 2000)" ? "1990" : "";
    const runtime = preferences[4];
    const language = preferences[5]?.toLowerCase() !== "doesn't matter" ? preferences[5]?.toLowerCase() : "";
    const highlyRated = preferences[6] === "Yes (IMDb 8+)";
    const leadType = preferences[7]?.toLowerCase() || "";
    const endingType = preferences[8]?.toLowerCase() || "";

    let runtimeFilter = "";
    if (runtime === "< 90 mins") runtimeFilter = "&type=movie";
    else if (runtime === "90-120 mins") runtimeFilter = "&type=movie";
    else if (runtime === "> 120 mins") runtimeFilter = "&type=movie";

    const query = `${API_URL}&s=${genre}&y=${year}${runtimeFilter}`;

    try {
      const response = await fetch(query);
      const data = await response.json();

      if (data.Response === "True") {
        setRecommendedMovie(data.Search[0]); // Use the first matching result
      } else {
        setError("No movies found based on your preferences.");
        setRecommendedMovie(null); // No movie found
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to fetch movie recommendations. Please try again.");
      setRecommendedMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(1);
    setPreferences({});
    setRecommendedMovie(null);
    setError(null);
  };

  return (
    <div className="recommendations">
      <Link to="/" className="back-button">
        &#8592; Back
      </Link>

      {!recommendedMovie ? (
        <div>
          {loading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <div className="error">
              <h2>{error}</h2>
              <button onClick={restart} className="restart-button">
                Restart
              </button>
            </div>
          ) : (
            <>
              <h2>{questions[step - 1].text}</h2>
              {questions[step - 1].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(questions[step - 1].id, option)}
                  className="option-button"
                >
                  {option}
                </button>
              ))}
            </>
          )}
        </div>
      ) : (
        <div>
          <h2>We Recommend:</h2>
          <div className="movie-container">
            {recommendedMovie && (
              <Link to={`/movie/${recommendedMovie.imdbID}`}>
                <MovieCard movie={recommendedMovie} />
              </Link>
            )}
          </div>
          <button onClick={restart} className="restart-button">
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
