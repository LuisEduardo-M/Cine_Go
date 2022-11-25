import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Movie = () => {
    const [movie, setMovie] = useState({});
    // Getting the exact "id" from Router
    let { id } = useParams();

    useEffect(() => {
        let myMovie = {
            id: 1,
            title: "Scarface",
            release_date: "17-04-1984",
            runtime: 170,
            mpaa_rating: "R",
            description: "Some descript for Scarface"
        }

        setMovie(myMovie);
    }, [id])

    return (
        <div>
            <h2>Movie: {movie.title}</h2>
            <small>{movie.release_date}, {movie.runtime} minutes - Rated {movie.mpaa_rating}</small>
            <hr />

            <p>{movie.description}</p>
        </div>

    )
}

export default Movie;