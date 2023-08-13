package main

import (
	"auth_api/handler"
	"auth_api/infra"
	"auth_api/infra/database"
	"auth_api/proto"
	"auth_api/usecase"
	"fmt"
	"log"
	"net"
	"os"

	"google.golang.org/grpc"
)

const grpcPort = "50051"

var (
	dbName string
)

func main() {
	srv := grpc.NewServer()
	ah := injectAuthHandler()
	proto.RegisterAuthServer(srv, ah)

	listener, err := net.Listen("tcp", ":"+grpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	if err := srv.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func injectAuthHandler() *handler.AuthHandler {
	db, err := database.Connect(dbName)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	repo := infra.NewStaffRepository(db)
	service := usecase.NewStaffService(repo)
	return handler.NewAuthHandler(service)
}

func init() {
	env, ok := os.LookupEnv("GO_ENV")
	if !ok {
		env = "development"
		os.Setenv("GO_ENV", env)
	}
	dbName = fmt.Sprintf("staff_%s", env)
}
