from datetime import date, timedelta
from planner import Task, StudyBlock, days_until_due, deadline_group, task_priority, prioritize_tasks

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
	remaining=10,
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

block_length = min(30, sorted_test_list[0].remaining, 25)
block_length2 = min(20, sorted_test_list[1].remaining, 25)
block_length3 = min(40, sorted_test_list[2].remaining, 25)

new_block = StudyBlock(
	title=sorted_test_list[0].title,
	minutes=block_length,
	explanation=f"TIme needed because due at {sorted_test_list[0].due} and confidence of {sorted_test_list[0].confidence}"
)

new_block2 = StudyBlock(
	title=sorted_test_list[1].title,
	minutes=block_length2,
	explanation=f"TIme needed because due at {sorted_test_list[1].due} and confidence of {sorted_test_list[1].confidence}"
)

new_block3 = StudyBlock(
	title=sorted_test_list[2].title,
	minutes=block_length3,
	explanation=f"TIme needed because due at {sorted_test_list[2].due} and confidence of {sorted_test_list[2].confidence}"
)

print(new_block)
print(new_block2)
print(new_block3)
