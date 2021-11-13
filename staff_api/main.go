package main

import (
	"log"
	"os"

	"staff_api/database"
	"staff_api/entity"
	"staff_api/server"
)

func main() {
	if os.Getenv("GO_ENV") == "" {
		os.Setenv("GO_ENV", "development")
	}

	db, _ := database.Connect()

	if err := db.AutoMigrate(&entity.Staff{}); err != nil {
		log.Fatal(err)
	}

	go server.RunGrpc()
	server.RunGraphql(db)
}
