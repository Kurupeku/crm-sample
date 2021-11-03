package handlers

import (
	"fmt"
	"os"

	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

type Health struct {
	Status int    `json:"status"`
	Result string `json:"result"`
}

func HealthCheckHandler(c *gin.Context) {
	health := Health{
		Status: http.StatusOK,
		Result: "success",
	}
	c.JSON(200, health)
}

func GetMenusHandler(c *gin.Context) {
	proxyHandler(c, parseURL(os.Getenv("INQUIRY_API_HOST"), "/menus"))
}

func PostInquiriesHandler(c *gin.Context) {
	proxyHandler(c, parseURL(os.Getenv("INQUIRY_API_HOST"), "/inquiries"))
}

func PostGraphqlHandler(c *gin.Context) {
	proxyHandler(c, parseURL(os.Getenv("FEDERATION_HOST"), ""))
}

func GetPlayGroundHandler(c *gin.Context) {
	target, err := url.Parse(parseURL(os.Getenv("FEDERATION_HOST"), ""))
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	proxy.Director = func(req *http.Request) {
		req.Header = c.Request.Header
		req.Host = target.Host
		req.URL.Scheme = "http"
		req.URL.Host = target.Host
		req.URL.Path = target.Path
	}

	proxy.ServeHTTP(c.Writer, c.Request)
}

func proxyHandler(c *gin.Context, urlString string) {
	target, err := url.Parse(urlString)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	proxy.Director = func(req *http.Request) {
		req.Header = c.Request.Header
		req.Host = target.Host
		req.URL.Scheme = "http"
		req.URL.Host = target.Host
		req.URL.Path = target.Path
		req.Header.Set("Content-Type", "application/json")
		// req.Header.Set("Accept", "application/json")
	}

	c.Writer.Header().Del("Access-Control-Allow-Origin")

	proxy.ServeHTTP(c.Writer, c.Request)
}

func parseURL(host string, path string) string {
	return fmt.Sprintf("http://%s%s", host, path)
}
