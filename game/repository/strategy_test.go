package repository

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"testing"

	"github.com/chess-sol/game/service"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type StrategySuite struct {
	suite.Suite
	strategyRepository StrategyRepository
	DB                 *sqlx.DB
}

func (ss *StrategySuite) SetupSuite() {
	godotenv.Load("../integration.env")

	if err := service.MigrationsUp("file://../db/migrations"); err != nil {
		ss.Nil(err)
	}

	db, err := sqlx.Connect("postgres", service.BuildConnectionString())
	ss.Nil(err)

	content, _ := ioutil.ReadFile("./testdata/strategy.sql")
	sql := string(content)
	_, err = db.Exec(sql)
	ss.Nil(err)

	strategyRepository := NewStrategyRepository(db)

	ss.strategyRepository = strategyRepository
	ss.DB = db
}

func (ss *StrategySuite) TearDownSuite() {
	if err := service.MigrationsDown("file://../db/migrations"); err != nil {
		ss.Nil(err)
	}
}

type strategyTestCase struct {
	Movements string `json:"movements"`
	Expected  string `json:"expected"`
}

func (ss *StrategySuite) TestGet() {
	fStrategy, _ := ioutil.ReadFile("testdata/strategy.json")
	dataTestCases := []strategyTestCase{}
	json.Unmarshal([]byte(fStrategy), &dataTestCases)

	for idx, tc := range dataTestCases {
		ss.T().Run(ss.T().Name()+fmt.Sprint(idx), func(t *testing.T) {
			res, err := ss.strategyRepository.GetBy(tc.Movements)
			if tc.Expected == "" {
				assert.Nil(t, res)
			} else {
				assert.Nil(t, err)
				assert.Equal(t, tc.Expected, res.Name)
			}
		})
	}
}

func TestStrategySuite(t *testing.T) {
	suite.Run(t, new(StrategySuite))
}
