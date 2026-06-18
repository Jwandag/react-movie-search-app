function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  return (
    <div className="movie-card">
      <img src={movie.Poster} alt={movie.Title} />
      <h2>{movie.Title}</h2>
      <p>{movie.Year}</p>
      <button onClick={() => onToggleFavorite(movie)}>
        {isFavorite ? "♥" : "♡"}
      </button>
    </div>
  );
}

export default MovieCard;
