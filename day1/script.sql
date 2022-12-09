WITH parsed as (
	SELECT [Column 0] as content
		, CASE WHEN [Column 0] = '' THEN 1 ELSE 0 END AS separator
		, rid
		, CAST([Column 0] AS INT) as calories
	FROM [AdventOfCode2022].[dbo].[input1]
), groups AS (
	SELECT rid, content, separator, calories, SUM(separator) OVER (ORDER BY rid ASC) AS groupid
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
