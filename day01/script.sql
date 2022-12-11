USE [AdventOfCode2022] 
GO

CREATE SCHEMA [day1]
GO

CREATE TABLE [day1].[input](
    content varchar(50) NULL,
    line_nr INT IDENTITY(1,1) NOT NULL
)
GO

/* Load data from flatfile into column "content" */

WITH parsed as (
    SELECT line_nr
        ,content
        ,CASE WHEN content = '' THEN 1 ELSE 0 END AS separator
        ,CAST(content AS INT) as calories
    FROM [day1].[input]
), groups AS (
    SELECT line_nr, content, separator, calories, SUM(separator) OVER (ORDER BY line_nr ASC) AS groupid
    FROM parsed
), group_totals AS (
    SELECT groupid, SUM(calories) AS total_calories, ROW_NUMBER() OVER (ORDER BY SUM(calories) DESC) as rn
    FROM groups
    GROUP BY groupid
)
SELECT '1' as part, total_calories
FROM group_totals
WHERE rn = 1
UNION
SELECT '2' as part, SUM(total_calories)
FROM group_totals
WHERE rn <= 3
;
