package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"staff_api/database"
	"staff_api/entity"
	"staff_api/graph"
	"staff_api/graph/generated"
	"staff_api/handlers"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const gqlPort = "3001"

var (
	dbName string
)

func main() {
	db, _ := database.Connect(dbName)
	if err := db.AutoMigrate(&entity.Staff{}); err != nil {
		log.Fatal(err)
	}
	runServer()
}

func runServer() {
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/health_check", http.HandlerFunc(handlers.HealthCheckHandler))
	http.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	http.Handle("/graphql", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", gqlPort)
	if err := http.ListenAndServe(":"+gqlPort, nil); err != nil {
		log.Fatal(err)
	}
}

func init() {
	env, ok := os.LookupEnv("GO_ENV")
	if !ok {
		env = "development"
		os.Setenv("GO_ENV", env)
	}
	dbName = fmt.Sprintf("staff_%s", env)
}
