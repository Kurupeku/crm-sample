package main

import (
	"log"
	"os"
	"strconv"

	"staff_api/database"
	"staff_api/entity"
	"staff_api/server"
)

func main() {
	if os.Getenv("GO_ENV") == "" {
		os.Setenv("GO_ENV", "development")
	}

	if len(os.Args) != 2 {
		log.Fatal("require argument of port number")
	}

	port := os.Args[1]
	if _, err := strconv.Atoi(port); err != nil {
		log.Fatal("env var PORT must be a uint")
	}

	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}

	if err = db.AutoMigrate(&entity.Staff{}); err != nil {
		log.Fatal(err)
	}

	server.RunGraphql(port)
}
