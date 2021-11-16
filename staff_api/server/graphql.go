package server

import (
	"log"
	"net/http"

	"staff_api/graph"
	"staff_api/graph/generated"
	"staff_api/handlers"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const gqlPort = "3001"

func RunGraphql() {
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/health_check", http.HandlerFunc(handlers.HealthCheckHandler))

	http.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	http.Handle("/graphql", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", gqlPort)

	log.Fatal(http.ListenAndServe(":"+gqlPort, nil))
}
