package repository

import (
	"github.com/chess-sol/game/model"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type strategyRepository struct {
	*sqlx.DB
}

func NewStrategyRepository(db *sqlx.DB) StrategyRepository {
	return &strategyRepository{
		DB: db,
	}
}

type StrategyRepository interface {
	GetBy(movements string) (*model.Strategy, error)
}

func (strategyRepository *strategyRepository) GetBy(movements string) (*model.Strategy, error) {
	strategy := model.Strategy{}
	err := strategyRepository.Get(&strategy, "SELECT * FROM strategy WHERE movements=$1 ", movements)
	if err != nil {
		return nil, err
	}

	return &strategy, nil
}
