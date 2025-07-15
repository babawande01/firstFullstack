import React, { use } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router';

const RecommendedMovies = ({movieTitles}) => {
    const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOThjMzVhNjQ2ODBiYWM4OGQxNjc1ZDIxYTM3MDJlYSIsIm5iZiI6MTc1MDg1MDUxNy43ODMsInN1YiI6IjY4NWJkYmQ1ZmE4NDNlNWI2M2FmYTY4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eVMWywSDkV-6ALL7epMYXMlho6NOXmQ9oz17FxSwAsI'
  }
};


  const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchMovies = async (title) => {
        const encodedTitle = encodeURIComponent(title);
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`

        try {
            const res = await fetch(url, options);
            const data = await res.json();
            return data.results?.[0] || null ;
        } catch (error) {
            console.log("Error fetching movies: ", error);
            return null;

        }
    }

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            const results = await Promise.all(movieTitles.map((title) => fetchMovies(title)));
            setMovies(results.filter(Boolean));
            setLoading(false);
        }

        if (movieTitles?.length) {
            loadMovies();

        }
    },[movieTitles])

    if (loading) {
        return <p>Loading</p>
    }
    console.log("Movies: ", movies);
  return (
    <div className='grid grid-col-2 md:grid-cols-5 gap-4'>{movies.map(movie => (
        <Link to={`/movie/${movie.id}`} key={movie.id} className='bg-[#232323] rounded-lg overflow-hidden'>
            {movie.poster_path ? (<img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className='w-full h-48 object-cover' /> ): (<div className='w-full h-64 bg-gray-800 flex items-center justify-center text-white'>No Image</div>)}


            <div className='p-2'>
                <h3 className='text-sm font-semibold text-white truncate'>{movie.title}</h3>
                <p className='text-xs text-gray-400'>{movie.release_date ? movie.release_date.slice(0,4): "N/A"}</p>
            </div>

        </Link>
    ))}
    </div>
  )
}

export default RecommendedMovies