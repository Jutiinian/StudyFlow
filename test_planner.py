# .venv/bin/python -m unittest discover -v

import unittest
from datetime import date

from planner import Task, allocate_plan


class PlannerTests(unittest.TestCase):
    def test_sixty_minute_session_has_no_trailing_break(self):
        today = date(2026, 9, 27)
        tasks = [
            Task(
                id=1,
                title="Read chapter 4",
                due=today,
                remaining=100,
                confidence=3,
            )
        ]

        blocks = allocate_plan(tasks, today, 60)
        actual = [(block.kind, block.minutes) for block in blocks]

        self.assertEqual(
            actual,
            [
                ("study", 25),
                ("break", 5),
                ("study", 25),
            ],
        )

    def test_short_tasks_share_a_work_interval(self):
        today = date(2026, 9, 27)
        tasks = [
            Task(
                id=1,
                title="Study for Math Quiz",
                due=today,
                remaining=10,
                confidence=3,
            ),
            Task(
                id=2,
                title="Study for C++ Test",
                due=date(2026, 9, 28),
                remaining=30,
                confidence=3,
            ),
        ]

        blocks = allocate_plan(tasks, today, 60)
        actual = [(block.kind, block.task_id, block.minutes) for block in blocks]

        self.assertEqual(
            actual,
            [
                ("study", 1, 10),
                ("study", 2, 15),
                ("break", None, 5),
                ("study", 2, 15),
            ],
        )

    def test_session_budget_boundaries(self):
        today = date(2026, 9, 27)
        tasks = [
            Task(
                id=1,
                title="Long assignment",
                due=today,
                remaining=200,
                confidence=3,
            )
        ]

        cases = [
            (1, [1]),
            (25, [25]),
            (26, [25]),
            (30, [25]),
            (31, [25, 5, 1]),
            (115, [25, 5, 25, 5, 25, 5, 25]),
            (130, [25, 5, 25, 5, 25, 5, 25]),
            (131, [25, 5, 25, 5, 25, 5, 25, 15, 1]),
        ]

        for budget, expected_minutes in cases:
            with self.subTest(budget=budget):
                blocks = allocate_plan(tasks, today, budget)

                self.assertEqual(
                    [block.minutes for block in blocks],
                    expected_minutes,
                )
                self.assertLessEqual(
                    sum(block.minutes for block in blocks),
                    budget,
                )
                self.assertEqual(blocks[-1].kind, "study")

    def test_earlier_deadline_takes_priority_over_confidence(self):
        today = date(2026, 9, 27)
        tasks = [
            Task(
                id=2,
                title="Later task",
                due=date(2026, 9, 28),
                remaining=60,
                confidence=1,
            ),
            Task(
                id=1,
                title="Urgent task",
                due=today,
                remaining=50,
                confidence=5,
            ),
        ]

        blocks = allocate_plan(tasks, today, 60)
        actual = [(block.kind, block.task_id, block.minutes) for block in blocks]

        self.assertEqual(
            actual,
            [
                ("study", 1, 25),
                ("break", None, 5),
                ("study", 1, 25),
            ],
        )

    def test_lower_confidence_wins_when_due_dates_match(self):
        today = date(2026, 9, 27)
        tasks = [
            Task(
                id=1,
                title="First task",
                due=today,
                remaining=10,
                confidence=5,
            ),
            Task(
                id=2,
                title="Second task",
                due=today,
                remaining=10,
                confidence=1,
            ),
        ]

        blocks = allocate_plan(tasks, today, 20)
        actual = [(block.kind, block.task_id, block.minutes) for block in blocks]

        self.assertEqual(
            actual,
            [
                ("study", 2, 10),
                ("study", 1, 10),
            ],
        )


if __name__ == "__main__":
    unittest.main()
