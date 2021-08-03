package model

type Move struct {
	Position1  string `json:"position1"`
	Position2  string `json:"position2"`
	TakenPiece string `json:"taken"`
}
