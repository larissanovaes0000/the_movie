import { useEffect, useState } from 'react';
import './HomeView.scss'
import axios from 'axios';

export function HomeView() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = () => {
    axios({
      method: 'get',
      url: 'https://api.themoviedb.org/3/discover/movie',
      params: {
        api_key: '367014a3bfb5f31c249f13d24550b58f',
        language: 'pt-BR'
      }
    }).then(response => {
      setMovies(response.data.results);
      console.log(response)
    })
  }

  return (
    <section className="movies">
      <div className="movies-container">
        {
          movies && movies.map((movie: any) => (
            <div className="movie-card" title={movie.title}>
              <div className="movie-card-placeholder"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }}>

                <button className="favorite-button unselected">&#9825;</button>
                {/* <button className="favorite-button selected">❤️</button> */}

              </div>
              <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
              <span className="rate">{Number(movie.vote_average).toFixed(1)}</span>
            </div>
          ))
        }
      </div>
    </section>
  )
}
