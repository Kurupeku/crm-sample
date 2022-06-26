package main

import (
	"log"
	"os"

	"staff_api/database"
	"staff_api/server"
)

func main() {
	if os.Getenv("GO_ENV") == "" {
		os.Setenv("GO_ENV", "development")
	}

	if len(os.Args) != 2 {
		log.Fatal("require argument of port number")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "50051"
	}

	_, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}

	server.RunGrpc(port)
}
