import './App.css';
import {useCallback, useRef, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {useInfiniteQuery} from "react-query";

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

// const getMovieList =async () => {
//   const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`)
//   return await response.data;
// };

function MoviesAdv() {
  const {data, fetchNextPage} = useInfiniteQuery(["movies"],
    ({pageParam}) => {
      return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageParam}`)
        .then((res) => res.data);
    }, {
      getNextPageParam: (lastPage) => lastPage?.page + 1,
    }
  );

  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);


  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  // useEffect(() => {
  //   const option = {
  //     root: null,
  //     rootMargin: '0px',
  //     threshold: 1.0,
  //   };
  //   const observer = new IntersectionObserver(handleObserver, option);
  //   if (loadMoreRef.current) observer.observe(loadMoreRef.current)
  //   return () => {
  //     if(loadMoreRef.current) observer.unobserve(loadMoreRef.current);
  //   }
  // }, [handleObserver])


  function makeImagePath(id) {
    return `https://image.tmdb.org/t/p/original/${id}`;
  }

  return (
    <>
      {
        data?.pages.map((group, index) => (
          <Row key={index}>
            {group?.results?.map((movie) =>
              <Box key={movie.id}>
                <MoviePoster src={makeImagePath(movie.backdrop_path)} alt=""/>
                <Info>{movie.original_title}</Info>
              </Box>
            )}
            <button onClick={() => fetchNextPage()}>다음 페이지</button>
          </Row>

        ))
      }
    </>
  );
}

export default MoviesAdv;