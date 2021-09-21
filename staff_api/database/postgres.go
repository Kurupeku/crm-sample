package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"staff_api/entity"
)

func Connect() (*gorm.DB, error) {
	dsn := "host=staff_db user=postgres password=postgres port=5432 sslmode=disable TimeZone=Asia/Tokyo"
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
