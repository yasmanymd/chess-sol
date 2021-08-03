INSERT INTO strategy (name, movements) 
VALUES
  ('Caro–Kann Defence', 'e2e4,c7c6'),
  ('Ruy Lopez', 'e2e4,e7e5,g1f3,b8c6,f1b5')
ON CONFLICT DO NOTHING;