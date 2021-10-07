package handlers

import (
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

func GetClientHandler(c *gin.Context) {
	proxyHandler(c, "http://client:3000")
}

func GetMenusHandler(c *gin.Context) {
	proxyHandler(c, "http://inquiry_api:3000/menus")
}

func PostInquiriesHandler(c *gin.Context) {
	proxyHandler(c, "http://inquiry_api:3000/inquiries")
}

func PostGraphqlHandler(c *gin.Context) {
	proxyHandler(c, "http://federation:3000")
}

func GetPlayGroundHandler(c *gin.Context) {
	target, err := url.Parse("http://federation:3000")
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
