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
	mux.Get("/movie/{id}", app.GetMovie)
	mux.Post("/authenticate", app.Authenticate)
	mux.Get("/refresh", app.RefreshToken)
	mux.Get("/logout", app.Logout)

	// Authorization Middleware
	mux.Route("/admin", func(mux chi.Router) {
		mux.Use(app.authRequired)

		mux.Get("/movies", app.MovieCatalog)
		mux.Get("/movies/{id}", app.MovieForEdit)
	})

	return mux
}
