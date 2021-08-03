INSERT INTO game (name, white_name, black_name, strategy_name, movements) 
VALUES
  ('Game 1', 'Magnus Carlsen', 'Fabiano Caruana', '', '[{"taken":"","position1":"e2","position2":"e4"}]'),
  ('Game 2', 'Fabiano Caruana', 'Levon Aronian', 'Petrov', '[{"taken":"","position1":"a2","position2":"a4"}]'),
  ('Game 3', 'Levon Aronian', 'Magnus Carlsen', 'Rui Lopez', '[{"taken":"","position1":"b2","position2":"b4"}]')
ON CONFLICT DO NOTHING;