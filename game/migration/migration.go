package migration

import (
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func MigrationsUp(migrationFolder string, connectionString string) error {
	path, _ := os.Getwd()
	println(path)
	m, err := migrate.New(migrationFolder, connectionString)
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

func MigrationsDown(migrationFolder string, connectionString string) error {
	m, err := migrate.New(migrationFolder, connectionString)
	if err != nil {
		return err
	}
	if err := m.Down(); err != nil {
		return err
	}
	return nil
}
