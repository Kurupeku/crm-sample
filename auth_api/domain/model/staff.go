package model

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type Staff struct {
	ID             uint
	Name           string
	Email          string
	PasswordDigest []byte
	Icon           string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func (s *Staff) IsAuthenticated(email string, password string) bool {
	if s == nil {
		return false
	}

	return s.Email == email && s.comparePassword(password) == nil
}

func (s *Staff) comparePassword(p string) error {
	if bcrypt.CompareHashAndPassword(s.PasswordDigest, []byte(p)) != nil {
		return errors.New("パスワードが正しくありません")
	}

	return nil
}
