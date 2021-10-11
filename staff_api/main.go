package main

import (
	"log"
	"os"

	"staff_api/database"
	"staff_api/server"

	"github.com/joho/godotenv"
)

func main() {
	envLoad()

	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}

	go server.RunGrpc()
	server.RunGraphql(db)
}

func envLoad() {
	if os.Getenv("GO_ENV") == "" {
		os.Setenv("GO_ENV", "development")
	}

	godotenv.Load()
}
