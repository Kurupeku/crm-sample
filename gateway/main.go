package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"gateway/handlers"
	"gateway/middleware"
)

func main() {
	engine := gin.Default()

	routerSetup(engine)
	engine.Run(":3000")
}

func routerSetup(r *gin.Engine) {
	r.GET("/", handlers.GetClientHandler)

	authMiddleware, err := middleware.AuthMiddleware()
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
			auth.POST("/graphql", handlers.PostGraphqlHandler)
		}
	}

	// r.NoRoute(handlers.GetClientHandler)
}
