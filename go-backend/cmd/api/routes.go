package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	// Create a router mux (multiplexer)
	mux := chi.NewRouter()

	// Middleware
	mux.Use(middleware.Recoverer)

	// CORS
	mux.Use(app.enableCORS)

	// Routes
	mux.Get("/", app.Home)
	mux.Get("/movies", app.AllMovies)
	mux.Post("/authenticate", app.Authenticate)
	mux.Get("/refresh", app.refreshToken)

	return mux
}
