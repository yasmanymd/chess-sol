package model

type Strategy struct {
	Id        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	Movements string `json:"movements" db:"movements"`
}
