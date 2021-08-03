CREATE TABLE game(
   id SERIAL PRIMARY KEY,
   name VARCHAR NOT NULL,
   white_name VARCHAR NOT NULL,
   black_name VARCHAR NOT NULL,
   strategy_name VARCHAR NOT NULL,
   movements JSONB NOT NULL DEFAULT '{}'::JSONB
);