package repository

import (
	"errors"

	"github.com/chess-sol/game/model"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type gameRepository struct {
	*sqlx.DB
}

func NewGameRepository(db *sqlx.DB) GameRepository {
	return &gameRepository{
		DB: db,
	}
}

type GameRepository interface {
	New(game *model.Game) error
	Update(game *model.Game) error
}

func (gameRepository *gameRepository) New(game *model.Game) error {
	id := 0
	err := gameRepository.QueryRow(`INSERT INTO game(name,white_name,black_name,strategy_name,movements) 
									VALUES($1, $2, $3, $4, $5) RETURNING id`,
		game.Name, game.WhiteName, game.BlackName, game.StrategyName, game.Movements).Scan(&id)
	if err != nil {
		return err
	}
	if id == 0 {
		return errors.New("insertion failed")
	}
	game.Id = id
	return nil
}

func (gameRepository *gameRepository) Update(game *model.Game) error {
	_, err := gameRepository.Exec(`UPDATE game 
								   SET name=$1, white_name=$2, black_name=$3,strategy_name=$4,movements=$5 
								   WHERE id = $6`,
		game.Name, game.WhiteName, game.BlackName, game.StrategyName, game.Movements, game.Id)
	if err != nil {
		return err
	}
	return nil
}
