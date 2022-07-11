import './App.css';
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {Link} from "react-router-dom";

const API_KEY= "bf8d080cc142561c5c990b861fee137e"

const Row = styled.ul`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
`

const Box = styled.div`
  list-style: none;
  background-color: gainsboro;
  border-radius: 10px;
  cursor: pointer;
`;
const MoviePoster = styled.img`
  max-width: 100%;
  object-fit: cover;
`
const Info = styled.span`
  font-size: 18px;
  color: black;
`

function Movies() {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    fetchMovies();
  },[page]);


  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => {
      if(loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    }
  }, [handleObserver])


  function makeImagePath(id) {
    return `https://image.tmdb.org/t/p/original/${id}`;
  }

  const fetchMovies = async () => {
    setIsLoading(true)
    const API = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`
    const response = await axios.get(API)
    setMovies([...movies, ...response.data.results]);
    setIsLoading(false);
  };


  return (
    <>
      <Row>
        {movies.length > 0 && movies.map((movie) => {
            return <Box key={movie.id}>
              <Link to={movie.id.toString()}>
                <MoviePoster src={makeImagePath(movie.backdrop_path)} alt=""/>
                <Info>{movie.original_title}</Info>
              </Link>
            </Box>
          }
        )}
        <div ref={loadMoreRef}/>
        {/*<button></button>*/}
      </Row>

    </>
  );
}

export default Movies;
