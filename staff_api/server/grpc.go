package server

import (
	"context"
	"log"
	"net"

	"staff_api/database"
	"staff_api/entity"
	"staff_api/proto"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc"
)

const grpcPort = "50051"

type gsv struct {
	proto.UnimplementedAuthServer
}

func (*gsv) Authenticate(ctx context.Context, req *proto.AuthenticateRequest) (*proto.AuthenticateResponse, error) {
	email := req.GetEmail()
	password := req.GetPassword()

	authenticated := false
	var staff entity.Staff
	db := database.GetDB()
	if count := db.First(&staff, entity.Staff{Email: email}).RowsAffected; count > 0 {
		err := bcrypt.CompareHashAndPassword(staff.PasswordDigest, []byte(password))
		if err == nil {
			authenticated = true
		}
	}

	return &proto.AuthenticateResponse{
		Authenticated: authenticated,
	}, nil
}

func RunGrpc() {
	listener, err := net.Listen("tcp", ":"+grpcPort)

	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	srv := grpc.NewServer()

	proto.RegisterAuthServer(srv, &gsv{})
	if err := srv.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
