package server

import (
	"context"
	"log"
	"net"

	"staff_api/entity"
	"staff_api/proto"

	"google.golang.org/grpc"
)

const grpcPort = "50051"

type gsv struct {
	proto.UnimplementedAuthServer
}

func (*gsv) Authenticate(ctx context.Context, req *proto.AuthenticateRequest) (*proto.AuthenticateResponse, error) {
	email := req.GetEmail()
	password := req.GetPassword()

	var staff entity.Staff
	return &proto.AuthenticateResponse{
		Authenticated: staff.IsAuthenticated(email, password),
	}, nil
}

func RunGrpc(ctx context.Context, port string) {
	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	srv := grpc.NewServer()

	proto.RegisterAuthServer(srv, &gsv{})
	if err := srv.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
