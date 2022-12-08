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

    // Getting ID from URL
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
            // Adding a movie
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
                .catch(err => console.log(err))
        } else {
            // Editing an existing movie
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`/admin/movies/${id}`, requestOptions)
                .then(response => {
                    if (response.status !== 200) {
                        setError("Invalid response code: " + response.status);
                    }

                    return response.json();
                })
                .then(data => {
                    // Fixing release date
                    data.movie.release_date = new Date(data.movie.release_date).toISOString().split("T")[0];

                    const checks = [];

                    data.genres.forEach(g => {
                        if (data.movie.genres_array.indexOf(g.id) !== -1) {
                            checks.push({ id: g.id, checked: true, genre: g.genre });
                        } else {
                            checks.push({ id: g.id, checked: false, genre: g.genre });
                        }
                    });

                    setMovie({
                        ...data.movie,
                        genres: checks,
                    })
                })
                .catch(err => console.log(err))
        }

    }, [id, jwtToken, navigate])

    const handleSubmit = event => {
        event.preventDefault();

        let errors = [];
        let required = [
            { field: movie.title, name: "title" },
            { field: movie.release_date, name: "release_date" },
            { field: movie.runtime, name: "runtime" },
            { field: movie.description, name: "description" },
            { field: movie.mpaa_rating, name: "mpaa_rating" },
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

        // Save changes
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        // Adding a new movie
        let method = "PUT";

        // Editing an existing movie
        if (movie.id > 0) {
            method = "PATCH"
        }

        const requestBody = movie;
        // Converting values in JSON for release date to date and runtime to int
        requestBody.release_date = new Date(movie.release_date);
        requestBody.runtime = parseInt(movie.runtime, 10);

        let requestOptions = {
            body: JSON.stringify(requestBody),
            method: method,
            headers: headers,
            credentials: "include",
        }

        fetch(`/admin/movies/${movie.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate("/manage-catalogue");
                }
            })
            .catch(err => console.log(err))
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

    const confirmDelete = () => {
        Swal.fire({
            title: 'Delete movie?',
            text: "You cannot undo this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let headers = new Headers();
                headers.append("Authorization", "Bearer " + jwtToken);

                const requestOptions = {
                    method: "DELETE",
                    headers: headers,
                }

                fetch(`/admin/movies/${movie.id}`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            console.log(data.error);
                        } else {
                            navigate("/manage-catalogue");
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
    }

    if (error !== null) {
        return <div>Error: {error.message}</div>
    } else {
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
                        value={movie.mpaa_rating}
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

                    {movie.id > 0 &&
                        <a href="#!" className='btn btn-danger ms-2' onClick={confirmDelete}>Delete Movie</a>
                    }

                </form>
            </div>
        )
    }
}

export default EditMovie;