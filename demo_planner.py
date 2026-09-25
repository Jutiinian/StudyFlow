from datetime import date, timedelta
from planner import Task, days_until_due, deadline_group, task_priority, prioritize_tasks

today_date = date.today()

test = Task(
	title="Get Yoonchae Phone number",
	due=date(2026, 9, 21),
	remaining=45,
	confidence=2,
)

print(test.title, test.due, test.remaining, test.confidence)
print(days_until_due(test, today_date))

# Goes from -1 to 8 (9 does not run)
for i in range(-1, 9):
	this_task = Task(
		title=f"Task {i}",
		due=timedelta(days=i) + today_date,
		remaining=45,
		confidence=2
	)

	print("Days until due: ", days_until_due(this_task, today_date), " | ", "Group: ", deadline_group(this_task, today_date))

taskA: Task = Task(
	title="Task A",
	due=date(2026, 9, 25),
	remaining=30,
	confidence=4,
)

taskB: Task = Task(
	title="Task B",
	due=date(2026, 9, 26),
	remaining=30,
	confidence=1,
)

taskC: Task = Task(
	title="Task C",
	due=date(2026, 9, 24),
	remaining=30,
	confidence=5,
)

print(task_priority(taskA, today_date))
print(task_priority(taskB, today_date))
print(task_priority(taskC, today_date))

testList: list[Task] = [taskA, taskB, taskC, Task(
	title="Task D",
	due=date(2026, 9, 24),
	remaining=0,
	confidence=5
)]
sorted_test_list = prioritize_tasks(testList, today_date)

print(sorted_test_list)
