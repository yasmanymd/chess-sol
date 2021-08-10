package service

import (
	"log"
	"net/http"

	"github.com/chess-sol/game/migration"
	"github.com/chess-sol/game/repository"
	"github.com/chess-sol/game/route"
	"github.com/chess-sol/game/utils"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
)

func Run() {
	godotenv.Load()

	connectionString := utils.BuildConnectionString()

	if err := migration.MigrationsUp("file://db/migrations", connectionString); err != nil {
		log.Fatal(err)
		return
	}

	db, err := sqlx.Connect("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	h := route.NewHandler(
		repository.NewGameRepository(db),
		repository.NewStrategyRepository(db),
	)

	log.Fatal(http.ListenAndServe(":5000", h))
}
