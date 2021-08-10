package repository

import (
	"encoding/json"
	"io/ioutil"
	"testing"

	"github.com/chess-sol/game/migration"
	"github.com/chess-sol/game/model"
	"github.com/chess-sol/game/utils"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/types"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/suite"
)

type GameSuite struct {
	suite.Suite
	gameRepository GameRepository
	DB             *sqlx.DB
}

func (gs *GameSuite) SetupSuite() {
	godotenv.Load("../integration.env")

	connectionString := utils.BuildConnectionString()

	if err := migration.MigrationsUp("file://../db/migrations", connectionString); err != nil {
		gs.Nil(err)
	}

	db, err := sqlx.Connect("postgres", connectionString)
	gs.Nil(err)

	content, _ := ioutil.ReadFile("./testdata/game.sql")
	sql := string(content)
	_, err = db.Exec(sql)
	gs.Nil(err)

	gameRepository := NewGameRepository(db)

	gs.gameRepository = gameRepository
	gs.DB = db
}

func (gs *GameSuite) TearDownSuite() {
	if err := migration.MigrationsDown("file://../db/migrations", utils.BuildConnectionString()); err != nil {
		gs.Nil(err)
	}
}

func (gs *GameSuite) TestNew() {
	movements, _ := json.Marshal([]model.Move{
		{Position1: "e2", Position2: "e4"},
	})

	err := gs.gameRepository.New(&model.Game{
		Name:         "Match 1",
		WhiteName:    "Garri Kasparov",
		BlackName:    "Mijail Tal",
		StrategyName: "Defense Caro Kann",
		Movements:    types.JSONText(string(movements)),
		Result:       "1/2-1/2",
	})
	gs.Nil(err)

	res, err := gs.DB.Query(`SELECT COUNT(*) FROM game 
							 WHERE name='Match 1' AND white_name = 'Garri Kasparov' 
							 AND black_name = 'Mijail Tal' 
							 AND strategy_name = 'Defense Caro Kann'
							 AND movements->0->>'position1' = 'e2'
							 AND movements->0->>'position2' = 'e4'
							 AND result = '1/2-1/2'`)
	gs.Nil(err)

	var count int
	for res.Next() {
		err = res.Scan(&count)
		gs.Nil(err)
	}

	gs.Equal(1, count)
}

func (gs *GameSuite) TestUpdate() {
	game := model.Game{}
	err := gs.DB.Get(&game, "SELECT * FROM game LIMIT 1")
	gs.Nil(err)

	movements, _ := json.Marshal([]model.Move{
		{Position1: "f2", Position2: "f4"},
	})

	game.WhiteName = "Leinier Dominguez"
	game.BlackName = "Lazaro Bruzon"
	game.Name = "Updated Game"
	game.StrategyName = ""
	game.Movements = types.JSONText(string(movements))
	game.Result = "1/2-1/2"

	err = gs.gameRepository.Update(&game)
	gs.Nil(err)

	res, err := gs.DB.Query(`SELECT COUNT(*) FROM game 
							 WHERE name='Updated Game' AND white_name = 'Leinier Dominguez' 
							 AND black_name = 'Lazaro Bruzon' 
							 AND strategy_name = ''
							 AND movements->0->>'position1' = 'f2'
							 AND movements->0->>'position2' = 'f4'
							 AND result = '1/2-1/2'`)
	gs.Nil(err)

	var count int
	for res.Next() {
		err = res.Scan(&count)
		gs.Nil(err)
	}

	gs.Equal(1, count)
}

func TestGameSuite(t *testing.T) {
	suite.Run(t, new(GameSuite))
}
