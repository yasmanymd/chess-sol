INSERT INTO game (name, white_name, black_name, strategy_name, movements, result) 
VALUES
  ('Game 1', 'Magnus Carlsen', 'Fabiano Caruana', '', '[{"taken":"","position1":"e2","position2":"e4"}]', '1-0'),
  ('Game 2', 'Fabiano Caruana', 'Levon Aronian', 'Petrov', '[{"taken":"","position1":"a2","position2":"a4"}]', '0-1'),
  ('Game 3', 'Levon Aronian', 'Magnus Carlsen', 'Rui Lopez', '[{"taken":"","position1":"b2","position2":"b4"}]', '1/2-1/2')
ON CONFLICT DO NOTHING;