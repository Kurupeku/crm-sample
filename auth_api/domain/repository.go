package domain

import (
	"auth_api/domain/model"
	"context"
)

type StaffRepository interface {
	FindStaffByEmail(ctx context.Context, email string) (*model.Staff, error)
}
