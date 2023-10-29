INSERT INTO
    "public"."Category" ("Id", "Value")
VALUES (
        '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
        'General'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        '9f818c77-9918-4f9c-b9ae-fee5eb1cd8b6',
        'Chuck Norris can play Mozart with his cordless phone.',
        '2023-10-29 19:02:11.405627+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        '6d68a76e-c2b7-4fb8-aa2d-7327a3c048f1',
        'Some people can slide down stair banisters. Chuck Norris can slide UP down escalators.',
        '2023-10-29 19:02:32.371008+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        'aaf4becf-d9cb-4453-9044-4eed7ee8c934',
        'The only reason the world will end is because, Chuck Norris will retire.',
        '2023-10-29 19:02:53.519318+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        '2222bc4c-3894-45bb-9049-d8398bf13ac2',
        'Mickey Mouse wears Chuck Norris ears.',
        '2023-10-29 19:03:15.014387+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        'a2261653-4eb2-497f-a766-d7ff1485854c',
        'The reason why babies cry when they are born is because they know they''ve been brought into the same world as Chuck Norris',
        '2023-10-29 19:03:47.761101+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        'e4c295bc-2c43-4560-b937-2cc06e482e4d',
        'Teacher says every time a bell rings Chuck Norris kills an angel.',
        '2023-10-29 19:04:27.630483+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        'a0025152-dbe0-4b3c-a997-672ff3554b45',
        'Chuck Norris is the alpha and the omega. And all those other fruity letters.',
        '2023-10-29 19:05:00.919849+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        'd7d0ae4b-283c-4017-b71c-d17ad0860cd4',
        'Why do so many rock stars die at age 27? Chuck Norris.',
        '2023-10-29 19:05:21.07833+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        '8301e1c0-a17a-4fe5-a603-ad3a7b223f29',
        'Fact: The closest a fist has ever come to Chuck Norris'' face is when he eats. In fact, there''s a Hollywood legend that when Chuck Norris eats a hot dog, they have to slow the film down just so you can see it.',
        '2023-10-29 19:05:38.291046+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

INSERT INTO
    "public"."Jokes" ("Id", "Value", "CreatedAt")
VALUES (
        '742524ce-3f94-47b6-9f0d-8ab2ef14dec0',
        'Chuck Norris is made of 94% perspiration, 4% electricity and 2% butterscotch ripple.',
        '2023-10-29 19:01:39.414984+00'
    ) ON CONFLICT ("Id")
DO NOTHING;

-- Insert 1

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    '742524ce-3f94-47b6-9f0d-8ab2ef14dec0'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = '742524ce-3f94-47b6-9f0d-8ab2ef14dec0'
    );

-- Insert 2

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    '9f818c77-9918-4f9c-b9ae-fee5eb1cd8b6'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = '9f818c77-9918-4f9c-b9ae-fee5eb1cd8b6'
    );

-- Insert 3

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    '6d68a76e-c2b7-4fb8-aa2d-7327a3c048f1'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = '6d68a76e-c2b7-4fb8-aa2d-7327a3c048f1'
    );

-- Insert 4

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    'aaf4becf-d9cb-4453-9044-4eed7ee8c934'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = 'aaf4becf-d9cb-4453-9044-4eed7ee8c934'
    );

-- Insert 5

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    '2222bc4c-3894-45bb-9049-d8398bf13ac2'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = '2222bc4c-3894-45bb-9049-d8398bf13ac2'
    );

-- Insert 6

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    'a2261653-4eb2-497f-a766-d7ff1485854c'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = 'a2261653-4eb2-497f-a766-d7ff1485854c'
    );

-- Insert 7

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    'e4c295bc-2c43-4560-b937-2cc06e482e4d'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = 'e4c295bc-2c43-4560-b937-2cc06e482e4d'
    );

-- Insert 8

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    'a0025152-dbe0-4b3c-a997-672ff3554b45'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = 'a0025152-dbe0-4b3c-a997-672ff3554b45'
    );

-- Insert 9

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    'd7d0ae4b-283c-4017-b71c-d17ad0860cd4'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = 'd7d0ae4b-283c-4017-b71c-d17ad0860cd4'
    );

-- Insert 10

INSERT INTO
    "public"."CategoryJoke" ("CategoriesId", "JokesId")
SELECT
    '4a10598e-08b5-4d15-b1a3-cec55bcbb194',
    '8301e1c0-a17a-4fe5-a603-ad3a7b223f29'
WHERE NOT EXISTS (
        SELECT 1
        FROM
            "public"."CategoryJoke"
        WHERE
            "CategoriesId" = '4a10598e-08b5-4d15-b1a3-cec55bcbb194'
            AND "JokesId" = '8301e1c0-a17a-4fe5-a603-ad3a7b223f29'
    );