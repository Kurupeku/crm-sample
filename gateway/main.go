package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"gateway/handlers"
	"gateway/middleware"
	"gateway/proto"
)

var (
	authHost string
	corsConf = cors.Config{
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
)

func main() {
	conn, err := grpc.Dial(
		authHost,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	if err != nil {
		log.Fatalf("could not connect staff_api tcp: %v", err)
	}
	defer conn.Close()

	if err := corsConf.Validate(); err != nil {
		log.Fatal(err)
	}

	engine := gin.Default()
	client := proto.NewAuthClient(conn)
	engine.Use(cors.New(corsConf))
	routerSetup(engine, client)
	if err := engine.Run(":2000"); err != nil {
		log.Fatal(err)
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

func init() {
	var ok bool
	if _, ok = os.LookupEnv("GO_ENV"); !ok {
		os.Setenv("GO_ENV", "development")
	}

	authHost, ok = os.LookupEnv("AUTH_HOST")
	if !ok {
		log.Fatal("$AUTH_HOST is not set")
	}
}
