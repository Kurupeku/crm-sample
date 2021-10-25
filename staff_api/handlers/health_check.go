package handlers

import (
	"encoding/json"
	"net/http"
)

type Health struct {
	Status int    `json:"status"`
	Result string `json:"result"`
}

func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	health := Health{
		Status: http.StatusOK,
		Result: "success",
	}

	res, err := json.Marshal(health)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}
