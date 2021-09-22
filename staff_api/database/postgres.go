package database

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"staff_api/entity"
)

func Connect() (*gorm.DB, error) {
	// dsn := "host=staff_db user=postgres password=postgres port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	host := os.Getenv("STAFF_DB_HOST")
	user := os.Getenv("STAFF_DB_USER")
	password := os.Getenv("STAFF_DB_PASSWORD")
	port := os.Getenv("STAFF_DB_PORT")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s port=%s sslmode=disable TimeZone=Asia/Tokyo",
		host, user, password, port,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&entity.Staff{})
	if err != nil {
		return nil, err
	}

	return db, nil
}
