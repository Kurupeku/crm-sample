package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type transactionKey struct{}

var (
	TxKey                                      = transactionKey{}
	database                                   *Database
	dbHost, dbPort, dbUser, dbPassword, dbName string
)

type Database struct {
	*gorm.DB
}

func ConnectDatabase() (*Database, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=UTC",
		dbHost, dbPort, dbUser, dbPassword, dbName,
	)

	var db *gorm.DB
	var err error
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if db != nil && err == nil {
			break
		}

		<-time.After(3 * time.Second)
	}
	if err != nil {
		return nil, err
	}

	database = &Database{db}
	return database, nil
}

func GetDatabase() *Database {
	return database
}

func (db *Database) Transaction(ctx context.Context, fn func(ctx context.Context) error) error {
	tx := db.Begin()
	newCtx := context.WithValue(ctx, TxKey, tx)
	if err := fn(newCtx); err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

func (db *Database) Conn(ctx context.Context) *Database {
	if tx, ok := ctx.Value(TxKey).(*gorm.DB); ok {
		return &Database{tx}
	}

	return db
}

func init() {
	var ok bool
	if dbHost, ok = os.LookupEnv("DB_HOST"); !ok {
		panic("DB_HOST is not set")
	}
	if dbPort, ok = os.LookupEnv("DB_PORT"); !ok {
		panic("DB_PORT is not set")
	}
	if dbUser, ok = os.LookupEnv("DB_USER"); !ok {
		panic("DB_USER is not set")
	}
	if dbPassword, ok = os.LookupEnv("DB_PASSWORD"); !ok {
		panic("DB_PASSWORD is not set")
	}
	if dbName, ok = os.LookupEnv("DB_NAME"); !ok {
		panic("DB_NAME is not set")
	}
}
