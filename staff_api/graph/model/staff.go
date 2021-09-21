package model

import (
	"fmt"
	"staff_api/entity"
)

type Staff struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func StaffFromEntity(e *entity.Staff) *Staff {
	return &Staff{
		ID:    fmt.Sprintf("%d", e.ID),
		Name:  e.Name,
		Email: e.Email,
	}
}
