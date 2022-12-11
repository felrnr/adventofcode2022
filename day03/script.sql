USE [AdventOfCode2022]
GO

CREATE SCHEMA [day3]
GO

CREATE TABLE [day3].[input](
    content varchar(50) NULL,
    line_nr INT IDENTITY(1,1) NOT NULL
)
GO

CREATE FUNCTION day3.item_priority (@charcode INT) RETURNS INT
BEGIN
    RETURN CASE
        WHEN @charcode >= ASCII('a') THEN 1 + @charcode - ASCII('a')
        ELSE 27 + @charcode - ASCII('A')
    END
END
GO

/* Load data from flatfile into column "content" */

WITH items_separated AS (
    SELECT line_nr, content, SUBSTRING(content, 1, 1) as c, 1 as n, ASCII(SUBSTRING(content, 1, 1)) AS charcode
    FROM day3.input
    UNION ALL
    SELECT line_nr, content, SUBSTRING(content, n+1, 1) AS c, n+1 as n, ASCII(SUBSTRING(content, n+1, 1)) AS charcode
    FROM items_separated
    WHERE n < len(content)
), compartiments AS (
    SELECT DISTINCT line_nr, charcode, FLOOR(2*(n-1) / len(content)) AS compartiment
    FROM items_separated
), part1 AS (
    SELECT line_nr, charcode
    FROM compartiments
    GROUP BY line_nr, charcode
    HAVING COUNT(compartiment) = 2
), groups AS (
    SELECT DISTINCT FLOOR((line_nr-1) / 3) AS group_nr
        ,(line_nr - 1) % 3 AS rucksack_nr
        ,charcode
    FROM items_separated
), part2 AS (
    SELECT group_nr, charcode
    FROM groups
    GROUP BY group_nr, charcode
    HAVING COUNT(rucksack_nr) = 3
)
SELECT '1' AS part, SUM(day3.item_priority(charcode)) AS prio_sum FROM part1
UNION
SELECT '2' AS part, SUM(day3.item_priority(charcode)) FROM part2
;
