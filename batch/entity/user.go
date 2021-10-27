package entity

import (
	"time"
)

type User struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
	CompanyName string    `csv:"company_name,omitempty"`
	Name        string    `gorm:"not null" csv:"name"`
	Email       string    `gorm:"not null" csv:"email"`
	Tel         string    `gorm:"not null" csv:"tel"`
	Address     Address
}

type Address struct {
	ID         uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime"`
	UserID     uint
	PostalCode string `gorm:"not null" csv:"postal_code"`
	Prefecture string `gorm:"not null" csv:"prefecture"`
	City       string `gorm:"not null" csv:"city"`
	Street     string `gorm:"not null" csv:"street"`
	Building   string `csc:"building,omitempty"`
}
