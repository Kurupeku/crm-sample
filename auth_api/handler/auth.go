package handler

import (
	"context"

	"auth_api/domain"
	"auth_api/proto"
)

type AuthHandler struct {
	service domain.StaffService
	proto.UnimplementedAuthServer
}

func NewAuthHandler(service domain.StaffService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) Authenticate(ctx context.Context, req *proto.AuthenticateRequest) (*proto.AuthenticateResponse, error) {
	email := req.GetEmail()
	password := req.GetPassword()

	return &proto.AuthenticateResponse{
		Authenticated: h.service.IsAuthenticate(ctx, email, password),
	}, nil
}
