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

	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}

	go server.RunGrpc()
	server.RunGraphql(db)
}
