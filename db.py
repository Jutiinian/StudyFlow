import sqlite3

DATABASE_NAME = 'lockin.db'

def init_db() -> None:
	connection = sqlite3.connect(DATABASE_NAME)
	cursor = connection.cursor()

	cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            due TEXT NOT NULL,
            remaining INTEGER NOT NULL,
            confidence INTEGER NOT NULL
        )
    """)

	connection.commit()

	connection.close()

def create_task(title: str, due: str, remaining: int, confidence: int) -> int:
	connection = sqlite3.connect(DATABASE_NAME)
	cursor = connection.cursor()

	cursor.execute(
		"""
		INSERT INTO tasks (title, due, remaining, confidence)
		VALUES (:title, :due, :remaining, :confidence)
		""",
		{"title": title, "due": due, "remaining": remaining, "confidence": confidence}
	)

	connection.commit()

	# Grab the id AUTOINCREMENT just assigned after commit
	new_id = cursor.lastrowid

	connection.close()

	assert new_id is not None
	return new_id

# Returns raw tuples straight from SQLite
def get_all_tasks() -> list[tuple]:
	connection = sqlite3.connect(DATABASE_NAME)
	cursor = connection.cursor()

	cursor.execute("SELECT * FROM tasks")
	rows = cursor.fetchall()

	connection.close()

	return rows

def update_task(task_id: int, new_remaining: int, new_confidence: int) -> bool:
	connection = sqlite3.connect(DATABASE_NAME)
	cursor = connection.cursor()

	cursor.execute(
		"""
		UPDATE tasks
		SET remaining = :remaining, confidence = :confidence
		WHERE id = :task_id
		""",
		{"task_id": task_id, "remaining": new_remaining, "confidence": new_confidence}
	)

	# cursor.rowcount tells how many rows most recent execute() call actually affected
	row_updated = cursor.rowcount > 0

	connection.commit()

	connection.close()

	return row_updated

def delete_task(task_id) -> bool:
	connection = sqlite3.connect(DATABASE_NAME)
	cursor = connection.cursor()

	cursor.execute(
		"""
		DELETE FROM tasks
		WHERE id = :task_id
		""",
		{"task_id": task_id}
	)

	row_deleted = cursor.rowcount > 0

	connection.commit()

	connection.close()

	return row_deleted
