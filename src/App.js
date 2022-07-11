import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Movies from "./Movies";
import MoviesAdv from "./MoviesAdv";
import Movie from "./Movie";


function App() {

  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="movies" element={<MoviesAdv/> } />
          <Route path="movies/:id" element={<Movie/>}/>
        </Routes>
      </div>
  );
}

export default App;
