import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";

const EditMovie = () => {
    const [movie, setMovie] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
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

    useEffect(() => {
        // Not authorized
        if (jwtToken === "") {
            navigate("/login");
            return;
        }
    }, [jwtToken, navigate])

    const handleSubmit = event => {
        event.preventDefault();
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

    return (
        <div>
            <h2>Add/Edit Movie</h2>
            <hr />
            <pre>{JSON.stringify(movie, null, 3)}</pre>

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
            </form>
        </div>
    )
}

export default EditMovie;