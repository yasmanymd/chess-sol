package model

type Strategy struct {
	Id        int    `json:"-" db:"id"`
	Name      string `json:"name" db:"name"`
	Movements string `json:"-" db:"movements"`
}
