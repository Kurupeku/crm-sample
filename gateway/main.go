package main

import (
	"log"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
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

	port := os.Args[1]
	if _, err := strconv.Atoi(port); err != nil {
		log.Fatal("env var PORT must be a uint")
	}

	corsConf := getCorsConfig()
	if err := corsConf.Validate(); err != nil {
		log.Fatal(err)
	}

	engine := gin.Default()
	client := proto.NewAuthClient(conn)
	engine.Use(cors.New(corsConf))
	routerSetup(engine, client)
	engine.Run(":" + port)
}

func getCorsConfig() cors.Config {
	return cors.Config{
		AllowAllOrigins:  true,
		AllowCredentials: true,
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept",
			"Accept-Encoding",
			"Authorization",
		},
	}
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

	r.GET("/health_check", handlers.HealthCheckHandler)
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
