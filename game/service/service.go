package service

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/chess-sol/game/repository"
	"github.com/chess-sol/game/route"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
)

func BuildConnectionString() string {
	host := os.Getenv("POSTGRESQL_HOST")
	port := os.Getenv("POSTGRESQL_PORT")
	dbname := os.Getenv("POSTGRESQL_DBNAME")
	user := os.Getenv("POSTGRESQL_USER")
	pass := os.Getenv("POSTGRESQL_PASSWORD")
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pass, host, port, dbname)
}

func MigrationsUp(migrationFolder string) error {
	path, _ := os.Getwd()
	println(path)
	m, err := migrate.New(migrationFolder, BuildConnectionString())
	if err != nil {
		return err
	}
	if err := m.Up(); err != nil {
		if err.Error() != "no change" {
			return err
		}
	}
	return nil
}

func MigrationsDown(migrationFolder string) error {
	m, err := migrate.New(migrationFolder, BuildConnectionString())
	if err != nil {
		return err
	}
	if err := m.Down(); err != nil {
		return err
	}
	return nil
}

func Run() {
	godotenv.Load()
	if err := MigrationsUp("file://db/migrations"); err != nil {
		log.Fatal(err)
		return
	}

	db, err := sqlx.Connect("postgres", BuildConnectionString())
	if err != nil {
		log.Fatal(err)
	}

	h := route.NewHandler(
		repository.NewGameRepository(db),
		repository.NewStrategyRepository(db),
	)

	log.Fatal(http.ListenAndServe(":5000", h))
}
