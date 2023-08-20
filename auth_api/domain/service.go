package domain

import "context"

type StaffService interface {
	IsAuthenticate(ctx context.Context, email, password string) bool
}
