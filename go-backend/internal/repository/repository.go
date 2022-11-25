package repository

import (
	"database/sql"
	"github.com/LuisEduardo-M/Cine_Go/internal/models"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	AllMovies() ([]*models.Movie, error)
}