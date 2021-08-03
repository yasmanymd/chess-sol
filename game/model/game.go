package model

import (
	"github.com/jmoiron/sqlx/types"
)

type Game struct {
	Id           int            `json:"id" db:"id"`
	Name         string         `json:"name" db:"name"`
	WhiteName    string         `json:"whiteName" db:"white_name"`
	BlackName    string         `json:"blackName" db:"black_name"`
	StrategyName string         `json:"strategyName" db:"strategy_name"`
	Movements    types.JSONText `json:"movements" db:"movements"`
}
