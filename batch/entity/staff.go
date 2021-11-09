package entity

import (
	"time"
)

type Staff struct {
	ID             uint      `gorm:"primaryKey;autoIncrement" csv:"id"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime"`
	Name           string    `gorm:"not null" csv:"name"`
	Email          string    `gorm:"uniqueIndex;not null" csv:"email"`
	PasswordDigest []byte    `gorm:"not null"`
	Icon           string    `gorm:"type:text" csv:"icon"`
}
