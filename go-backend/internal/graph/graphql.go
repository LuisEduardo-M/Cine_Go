package graph

import (
	"errors"
	"strings"

	"github.com/LuisEduardo-M/Cine_Go/internal/models"
	"github.com/graphql-go/graphql"
)

type Graph struct {
	Movies      []*models.Movie
	QueryString string
	Config      graphql.SchemaConfig
	fields      graphql.Fields
	movieType   *graphql.Object
}

// New is the function to create a new instance of the Graph type
func New(movies []*models.Movie) *Graph {
	// Defining the object for the movie
	var movieType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Movie",
			Fields: graphql.Fields{
				"id": &graphql.Field{
					Type: graphql.Int,
				},
				"title": &graphql.Field{
					Type: graphql.String,
				},
				"description": &graphql.Field{
					Type: graphql.String,
				},
				"release_date": &graphql.Field{
					Type: graphql.DateTime,
				},
				"runtime": &graphql.Field{
					Type: graphql.Int,
				},
				"mpaa_rating": &graphql.Field{
					Type: graphql.String,
				},
				"created_at": &graphql.Field{
					Type: graphql.DateTime,
				},
				"updated_at": &graphql.Field{
					Type: graphql.DateTime,
				},
				"image": &graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)

	// Actions
	var fields = graphql.Fields{
		"list": &graphql.Field{
			Type:        graphql.NewList(movieType),
			Description: "Get all movies",
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return movies, nil
			},
		},

		"search": &graphql.Field{
			Type:        graphql.NewList(movieType),
			Description: "Search movies by title",
			Args: graphql.FieldConfigArgument{
				"titleContains": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var list []*models.Movie

				search, ok := p.Args["titleContains"].(string)
				if ok {
					for _, currentMovie := range movies {
						if strings.Contains(strings.ToLower(currentMovie.Title), strings.ToLower(search)) {
							list = append(list, currentMovie)
						}
					}
				}

				return list, nil
			},
		},
	}

	return &Graph{
		Movies:    movies,
		fields:    fields,
		movieType: movieType,
	}
}

func (g *Graph) Query() (*graphql.Result, error) {
	rootQuery := graphql.ObjectConfig{
		Name:   "RootQuery",
		Fields: g.fields,
	}

	schemaConfig := graphql.SchemaConfig{
		Query: graphql.NewObject(rootQuery),
	}

	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		return nil, err
	}

	params := graphql.Params{
		Schema:        schema,
		RequestString: g.QueryString,
	}

	resp := graphql.Do(params)
	if len(resp.Errors) > 0 {
		return nil, errors.New("error executing query")
	}

	return resp, nil
}
