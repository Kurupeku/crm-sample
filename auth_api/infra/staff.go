package infra

import (
	"auth_api/domain"
	"auth_api/domain/model"
	"auth_api/infra/database"
	"context"
	"time"
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

func (s *Staff) Domain() *model.Staff {
	return &model.Staff{
		ID:             s.ID,
		Name:           s.Name,
		Email:          s.Email,
		PasswordDigest: s.PasswordDigest,
		Icon:           s.Icon,
		CreatedAt:      s.CreatedAt,
		UpdatedAt:      s.UpdatedAt,
	}
}

type StaffRepository struct {
	*database.Database
}

func NewStaffRepository(db *database.Database) domain.StaffRepository {
	return &StaffRepository{db}
}

func (r *StaffRepository) FindStaffByEmail(ctx context.Context, email string) (*model.Staff, error) {
	var staff Staff
	if err := r.Conn(ctx).Where(&Staff{Email: email}).First(&staff).Error; err != nil {
		return nil, err
	}

	return staff.Domain(), nil
}
