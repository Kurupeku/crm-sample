package entity

import (
	"time"
)

type Staff struct {
	ID             uint      `gorm:"primaryKey;autoIncrement"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime"`
	Name           string    `gorm:"not null"`
	Email          string    `gorm:"uniqueIndex;not null"`
	PasswordDigest []byte    `gorm:"not null"`
}
