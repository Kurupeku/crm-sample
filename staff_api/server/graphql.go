package server

import (
	"log"
	"net/http"

	"staff_api/graph"
	"staff_api/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"gorm.io/gorm"
)

const gqlPort = "3000"

func RunGraphql(db *gorm.DB) {
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: db}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	http.Handle("/graphql", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", gqlPort)

	log.Fatal(http.ListenAndServe(":"+gqlPort, nil))
}
