package route

import (
	"encoding/json"
	"net/http"

	"github.com/chess-sol/game/model"
	"github.com/chess-sol/game/repository"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
)

func NewHandler(game repository.GameRepository, strategy repository.StrategyRepository) *Handler {
	h := &Handler{
		Mux:      chi.NewMux(),
		game:     game,
		strategy: strategy,
	}

	h.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
	h.Use(middleware.Logger)

	h.Post("/game", h.NewGame())
	h.Post("/strategy", h.GetStrategyBy())
	h.Post("/search", h.GetBy())
	h.Get("/games", h.GetAll())

	return h
}

type Handler struct {
	*chi.Mux
	game     repository.GameRepository
	strategy repository.StrategyRepository
}

func (h *Handler) NewGame() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var game model.Game
		err := json.NewDecoder(r.Body).Decode(&game)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = h.game.New(&game)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		render.JSON(w, r, game)
	}
}

func (h *Handler) GetStrategyBy() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var strategyRequest GetStrategyByRequest
		err := json.NewDecoder(r.Body).Decode(&strategyRequest)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		strategy, err := h.strategy.GetBy(strategyRequest.Movements)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		render.JSON(w, r, strategy)
	}
}

func (h *Handler) GetBy() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request GetByRequest
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		games, err := h.game.GetBy(request.PlayerName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		render.JSON(w, r, games)
	}
}

func (h *Handler) GetAll() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		games, err := h.game.GetAll()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		render.JSON(w, r, games)
	}
}
