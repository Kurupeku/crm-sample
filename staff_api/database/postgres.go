package database

import (
	"errors"
	"fmt"
	"log"
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
	m.Init()

	db, err := connect(&m)
	if err != nil {
		return nil, err
	}

	d = db

	return db, nil
}

func GetDB() *gorm.DB {
	return d
}

func (m *Meta) Init() {
	m.host = os.Getenv("DB_HOST")
	m.user = os.Getenv("DB_USER")
	m.password = os.Getenv("DB_PASSWORD")
	m.port = os.Getenv("DB_PORT")
	m.dbname = "staff_" + os.Getenv("GO_ENV")
}

func (m *Meta) PgDsn() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Tokyo",
		m.host, m.port, m.user, m.password, m.dbname,
	)
}

func (m *Meta) PgDsnWithoutDBName() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s sslmode=disable TimeZone=Asia/Tokyo",
		m.host, m.port, m.user, m.password,
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
	public, err := gorm.Open(postgres.Open(m.PgDsnWithoutDBName()), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	public.Exec(fmt.Sprintf("CREATE DATABASE %s;", m.dbname))

	named, err := gorm.Open(postgres.Open(m.PgDsn()), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return named, nil
}
