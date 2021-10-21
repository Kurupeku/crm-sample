package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"

	"gateway/handlers"
	"gateway/middleware"
	"gateway/proto"
)

func main() {
	if os.Getenv("GO_ENV") == "" {
		os.Setenv("GO_ENV", "development")
	}

	conn, err := grpc.Dial(os.Getenv("STAFF_AUTH_HOST"), grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect staff_api tcp: %v", err)
	}
	defer conn.Close()

	client := proto.NewAuthClient(conn)

	engine := gin.Default()
	routerSetup(engine, client)
	engine.Run(":2000")
}

func routerSetup(r *gin.Engine, cc proto.AuthClient) {
	authMiddleware, err := middleware.AuthMiddleware(cc)
	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}

	errInit := authMiddleware.MiddlewareInit()
	if errInit != nil {
		log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
	}

	api := r.Group("/api")
	{
		api.GET("/menus", handlers.GetMenusHandler)
		api.POST("/inquiries", handlers.PostInquiriesHandler)
		api.POST("/login", authMiddleware.LoginHandler)

		auth := api.Group("/")
		{
			auth.GET("/refresh_token", authMiddleware.RefreshHandler)
			auth.Use(authMiddleware.MiddlewareFunc())
			auth.GET("/graphql", handlers.GetPlayGroundHandler)
			auth.POST("/graphql", handlers.PostGraphqlHandler)
		}
	}
}
