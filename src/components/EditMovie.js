import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";
import CheckBox from "./form/CheckBox";

const EditMovie = () => {
    const [movie, setMovie] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
        genres: [],
        genresArray: [Array(13).fill(false)],
    });
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);
    const mpaaOptions = [
        { id: "G", value: "G" },
        { id: "PG", value: "PG" },
        { id: "PG13", value: "PG13" },
        { id: "R", value: "R" },
        { id: "NC17", value: "NC17" },
        { id: "18A", value: "18A" },
    ]

    const { jwtToken } = useOutletContext();
    const navigate = useNavigate();

    // Get ID from URL
    let { id } = useParams();

    if (id === undefined) {
        id = 0;
    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }

        if (id === 0) {
            // adding a movie
            setMovie({
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "",
                description: "",
                genres: [],
                genres_array: [Array(13).fill(false)],
            })

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`/genres`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const checks = [];

                    data.forEach(g => {
                        checks.push({ id: g.id, checked: false, genre: g.genre });
                    })

                    setMovie(m => ({
                        ...m,
                        genres: checks,
                        genres_array: [],
                    }))
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            // editing an existing movie
        }

    }, [id, jwtToken, navigate])

    const handleSubmit = event => {
        event.preventDefault();

        let errors = [];
        let required = [
            {field: movie.title, name: "title"},
            {field: movie.release_date, name: "release_date"},
            {field: movie.runtime, name: "runtime"},
            {field: movie.description, name: "description"},
            {field: movie.mpaa_rating, name: "mpaa_rating"},
        ];

        required.forEach(function (obj) {
            if (obj.field === "") {
                errors.push(obj.name);
            }
        })

        // Genres error validation
        if (movie.genres_array.length === 0) {
            Swal.fire({
                title: "Error!",
                text: "You must choose at least one genre!",
                icon: "error",
                confirmButtonText: "OK",
            })
            errors.push("genres");
        }

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }
    }

    const hasError = key => {
        return errors.indexOf(key) !== -1;
    }

    const handleChange = () => event => {
        let value = event.target.value;
        let name = event.target.name;

        setMovie({
            ...movie,
            [name]: value,
        })
    }

    const handleCheck = (event, position) => {
        let tmpArr = movie.genres;
        tmpArr[position].checked = !tmpArr[position].checked;

        let tmpIDs = movie.genres_array;
        if (!event.target.checked) {
            tmpIDs.splice(tmpIDs.indexOf(event.target.value));
        } else {
            tmpIDs.push(parseInt(event.target.value, 10));
        }

        setMovie({
            ...movie,
            genres_array: tmpIDs,
        })
    }

    return (
        <div>
            <h2>Add/Edit Movie</h2>
            <hr />
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={movie.id} id="id"></input>

                {/* Title */}
                <Input
                    title={"Title"}
                    className={"form-control"}
                    type={"text"}
                    name={"title"}
                    value={movie.title}
                    onChange={handleChange("title")}
                    errorDiv={hasError("title") ? "text-danger" : "d-none"}
                    errorMessage={"Please enter a title!"}
                />

                {/* Release Date */}
                <Input
                    title={"Release Date"}
                    className={"form-control"}
                    type={"date"}
                    name={"release_date"}
                    value={movie.release_date}
                    onChange={handleChange("release_date")}
                    errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                    errorMessage={"Please enter a release date!"}
                />

                {/* Runtime */}
                <Input
                    title={"Runtime"}
                    className={"form-control"}
                    type={"text"}
                    name={"runtime"}
                    value={movie.runtime}
                    onChange={handleChange("runtime")}
                    errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                    errorMessage={"Please enter a runtime!"}
                />

                {/* MPAA Rating */}
                <Select
                    title={"MPAA Rating"}
                    name={"mpaa_rating"}
                    options={mpaaOptions}
                    onChange={handleChange("mpaa_rating")}
                    placeHolder={"Choose..."}
                    errorMessage={"Please choose an option!"}
                    errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                />

                {/* Description */}
                <TextArea
                    title={"Description"}
                    name={"description"}
                    value={movie.description}
                    rows={"3"}
                    onChange={handleChange("description")}
                    errorMessage={"Please enter a description!"}
                    errorDiv={hasError("description") ? "text-danger" : "d-none"}
                />

                <hr />

                <h3>Genres</h3>

                {movie.genres && movie.genres.length > 1 &&
                    <>
                        {Array.from(movie.genres).map((g, index) =>
                            <CheckBox
                                title={g.genre}
                                name={"genre"}
                                value={g.id}
                                key={index}
                                id={"genre-" + index}
                                onChange={event => handleCheck(event, index)}
                                checked={movie.genres[index].checked}
                            />
                        )}
                    </>
                }

                <hr />

                <button className='btn btn-primary'>Save</button>

            </form>
        </div>
    )
}

export default EditMovie;