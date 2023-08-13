package inquiry_api

import (
	"errors"
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const database = "postgres"

var d *gorm.DB

type Meta struct {
	host     string
	user     string
	password string
	port     string
	dbname   string
}

func Connect() (*gorm.DB, error) {
	m := Meta{}
	m.init()
	db, err := connect(&m)

	if err != nil {
		return nil, err
	}

	d = db

	if err != nil {
		return nil, err
	}

	return db, nil
}

func GetDB() *gorm.DB {
	return d
}

func (m *Meta) init() {
	m.host = os.Getenv("DB_HOST")
	m.user = os.Getenv("DB_USER")
	m.password = os.Getenv("DB_PASSWORD")
	m.port = os.Getenv("DB_PORT")
	m.dbname = "inquiry_" + os.Getenv("GO_ENV")
}

func (m *Meta) pgDsn() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Tokyo",
		m.host, m.port, m.user, m.password, m.dbname,
	)
}

func connect(m *Meta) (*gorm.DB, error) {
	switch database {
	case "postgres":
		return connectOrCreatePostgresDatabase(m)
	}

	return nil, errors.New("const 'database' is unmatched in method connect")
}

func connectOrCreatePostgresDatabase(m *Meta) (*gorm.DB, error) {
	named, err := gorm.Open(postgres.Open(m.pgDsn()), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return named, nil
}
