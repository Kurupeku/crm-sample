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
	ssl      bool
}

func newMeta() *Meta {
	host := os.Getenv("DB_HOST")
	if host == "" {
		log.Fatal("env 'DB_HOST' is required")
	}

	user := os.Getenv("DB_USER")
	if user == "" {
		log.Fatal("env 'DB_USER' is required")
	}

	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		log.Fatal("env 'DB_PASSWORD' is required")
	}

	port := os.Getenv("DB_PORT")
	if port == "" {
		log.Fatal("env 'DB_PORT' is required")
	}

	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "staff_" + os.Getenv("GO_ENV")
	}

	var ssl bool
	if s := os.Getenv("DB_SSL"); s == "true" {
		ssl = true
	}

	return &Meta{
		host:     host,
		user:     user,
		password: password,
		port:     port,
		dbname:   dbname,
		ssl:      ssl,
	}
}

func (m *Meta) sslmode() string {
	if m.ssl {
		return "require"
	}

	return "disable"
}

func (m *Meta) pgDsn() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Tokyo",
		m.host, m.user, m.password, m.dbname, m.port, m.sslmode(),
	)
}

func (m *Meta) pgDsnWithoutDBName() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s port=%s sslmode=%s TimeZone=Asia/Tokyo",
		m.host, m.user, m.password, m.port, m.sslmode(),
	)
}

func connect(m *Meta) (*gorm.DB, error) {
	switch database {
	case "postgres":
		return connectOrCreatePostgresDatabase(m)
	}

	return nil, errors.New("const 'database' is unmatched in method connect")
}

func Connect() (*gorm.DB, error) {
	m := newMeta()

	db, err := connect(m)
	if err != nil {
		return nil, err
	}

	d = db

	return db, nil
}

func GetDB() *gorm.DB {
	return d
}

func connectOrCreatePostgresDatabase(m *Meta) (*gorm.DB, error) {
	named, err := gorm.Open(postgres.Open(m.pgDsn()), &gorm.Config{})
	if err != nil {
		public, _ := gorm.Open(postgres.Open(m.pgDsnWithoutDBName()), &gorm.Config{})
		public.Exec(fmt.Sprintf("CREATE DATABASE %s;", m.dbname))

		named, err = gorm.Open(postgres.Open(m.pgDsn()), &gorm.Config{})
		if err != nil {
			return nil, err
		}
	}

	return named, nil
}
