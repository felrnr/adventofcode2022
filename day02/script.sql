USE [AdventOfCode2022] 
GO

CREATE SCHEMA [day2]
GO

CREATE TABLE [day2].[input](
    content varchar(50) NULL,
    line_nr INT IDENTITY(1,1) NOT NULL
)
GO

/* Load data from flatfile into column "content" */

WITH parsed as (
    SELECT line_nr
        ,CASE LEFT(content, 1)
            WHEN 'A' THEN 0
            WHEN 'B' THEN 1
            WHEN 'C' THEN 2
        END AS opp
        ,CASE RIGHT(content, 1) 
            WHEN 'X' THEN 0
            WHEN 'Y' THEN 1
            WHEN 'Z' THEN 2
        END AS you
    FROM [day2].[input]
), part1 AS (
    SELECT you+1 AS points_choice
        , 3*((3 + (you+1) - opp) % 3) AS points_result
    FROM parsed
), part2 AS (
    SELECT 1 + (3 + opp + (you-1)) % 3 AS points_choice
        , 3*you AS points_result
    FROM parsed
)
SELECT '1' as part, SUM(points_choice+points_result) AS total_points
FROM part1
UNION
SELECT '2' as part, SUM(points_choice+points_result) AS total_points
FROM part2
;
