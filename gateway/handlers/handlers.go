package handlers

import (
	"fmt"
	"os"

	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

const defaultPort = "3000"

func GetClientHandler(c *gin.Context) {
	proxyHandler(c, parseURL(os.Getenv("CLIENT_HOST"), defaultPort, ""))
}

func GetMenusHandler(c *gin.Context) {
	proxyHandler(c, parseURL(os.Getenv("INQUIRY_API_HOST"), defaultPort, "/menus"))
}

func PostInquiriesHandler(c *gin.Context) {
	proxyHandler(c, parseURL(os.Getenv("INQUIRY_API_HOST"), defaultPort, "/inquiries"))
}

func PostGraphqlHandler(c *gin.Context) {
	proxyHandler(c, parseURL(os.Getenv("FEDERATION_HOST"), defaultPort, ""))
}

func GetPlayGroundHandler(c *gin.Context) {
	target, err := url.Parse(parseURL(os.Getenv("FEDERATION_HOST"), defaultPort, ""))
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
		req.Header.Set("Accept", "application/json")
	}

	proxy.ServeHTTP(c.Writer, c.Request)
}

func parseURL(host string, port string, path string) string {
	return fmt.Sprintf("http://%s:%s%s", host, port, path)
}
