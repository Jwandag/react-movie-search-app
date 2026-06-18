import "./App.css";
import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import useDebounce from "./hooks/useDebounce";
import useLocalStorage from "./hooks/useLocalStorage";

const API_KEY = "fad55766";

function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    let ignore = false;
    if (debouncedQuery.trim() === "") {
      setMovies([]);
      setError(null);
      setLoading(false);
      return () => {
        ignore = true;
      };
    }
    setLoading(true);
    setError(null);
    fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${debouncedQuery}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!ignore) {
          setMovies(data.Search || []);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error.message);
          setMovies([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
  }, [debouncedQuery]);

  function toggleFavorite(movie) {
    const alreadyFavorite = favorites.some(
      (favorite) => favorite.imdbID === movie.imdbID,
    );
    if (alreadyFavorite) {
      setFavorites(
        favorites.filter((favorite) => favorite.imdbID !== movie.imdbID),
      );
    } else {
      setFavorites([...favorites, movie]);
    }
  }

  return (
    <div>
      <SearchBar
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="tabs">
        <button onClick={() => setTab("all")}>All</button>
        <button onClick={() => setTab("favorites")}>Favorites</button>
      </div>
      {tab === "favorites" ? (
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard
              movie={movie}
              onToggleFavorite={toggleFavorite}
              isFavorite={true}
              key={movie.imdbID}
            />
          ))}
        </div>
      ) : loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.some(
                (favorite) => favorite.imdbID === movie.imdbID,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
