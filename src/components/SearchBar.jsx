function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <h1>Find Moviez</h1>
      <input
        type="text"
        placeholder="Search by title"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
