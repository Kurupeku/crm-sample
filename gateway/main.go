package main

import (
	"github.com/gin-gonic/gin"

	"gateway/handlers"
)

func main() {
	engine := gin.Default()
	routerSetup(engine)
	engine.Run(":3000")
}

func routerSetup(r *gin.Engine) {
	r.GET("/", handlers.GetClientHandler)
	api := r.Group("/api")
	{
		api.GET("/menus", handlers.GetMenusHandler)
		api.POST("/inquiries", handlers.PostInquiriesHandler)

		api.POST("/login", handlers.PostLoginHandler)
		api.POST("/graphql", handlers.PostGraphqlHandler)
	}
}
