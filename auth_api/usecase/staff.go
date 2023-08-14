package usecase

import (
	"auth_api/domain"
	"context"
)

type StaffService struct {
	domain.StaffRepository
}

func NewStaffService(repo domain.StaffRepository) *StaffService {
	return &StaffService{repo}
}

func (s *StaffService) IsAuthenticate(ctx context.Context, email, password string) bool {
	staff, err := s.FindStaffByEmail(ctx, email)
	if err != nil {
		return false
	}

	return staff.IsAuthenticated(email, password)
}
