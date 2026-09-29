# StudyFlow

LockIn is a study planner that organizes tasks into Pomodoro-based study sessions with scheduled breaks. I built it to give my studying more structure and make it easier to focus on what to work on next.

 <!--Add a Preview section with a screenshot or demo GIF here!!! -->

## Features

- Create and delete tasks, and update remaining study time and confidence.
- Prioritize tasks by earliest deadline, using lower confidence to break ties.
- Generate study sessions with 25-minute work intervals and scheduled breaks.
- View explanations for scheduled tasks and totals for study time and breaks.
- Save tasks across app restarts using SQLite.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** CSS Modules and Motion
- **Backend:** Python, FastAPI, Pydantic
- **Database:** SQLite
- **Testing:** Python's `unittest`

## Technical Highlights

### Pomodoro-based scheduling

The planner follows the Pomodoro structure: 25-minute work intervals, 5-minute short breaks, and a 15-minute long break after every four completed work intervals.

I adapted this structure to fit multiple tasks into the time available. Short tasks can share a work interval, and the planner only adds a break when there is enough time to study afterward.

### Keeping plans consistent with task changes

Changing tasks or the session length clears the existing plan. Before displaying a new plan, the frontend checks that the request is still current. This prevents a delayed response from showing a schedule based on old inputs.

### Code organization

The backend keeps API endpoints, database operations, and scheduling logic in separate modules. This makes it possible to test the planner without running the server or accessing the database.

The frontend organizes task management and planning into separate features, with the dashboard coordinating updates between them.

## Why I Built This

The idea came while I was working on math homework. I wanted to try the Pomodoro technique to help me focus, but I also kept losing track of what I needed to do next. Having my tasks and a study plan in one place seemed like something I would find useful.

I also wanted more practice with Python and TypeScript. Most of my programming experience is with Lua/Luau through Roblox, and I learn best by building things. LockIn gave me a chance to use those languages in a full-stack web application.

## What I Learned

This project helped me apply concepts I already knew from Lua/Luau in Python and TypeScript. My experience with React Lua carried over to the frontend, and previous projects involving client-server communication helped me understand how the frontend and backend work together.

I got more practice with CSS, which is still an area I'm working on. Comparing web layouts to how I build interfaces in Roblox helped me understand how to arrange and style the app.

Building the planner also made me think through what "priority" should mean. Deadlines were a useful starting point, but I wanted confidence to play a role in deciding what to study next. Finding the right balance is something I'm still working on.

## Development Process

I used AI to help explain unfamiliar concepts, APIs, and modules, often by relating them to my experience with Roblox Lua/Luau. It also assisted with implementation and helped me move faster while working within a limited timeframe.

## Current Limitations and Tradeoffs

### Editing due dates

A task's due date can't currently be changed after it is created. I'd like to add support for editing it in the future.

### Balancing deadlines and confidence

The planner currently prioritizes deadlines first and uses confidence to break ties between tasks with the same due date.

For example, a task for a test tomorrow will come first even if I'm already confident about it and need much more preparation for another test in two days. I'd like to improve how the planner balances urgency and confidence so that the earliest deadline doesn't always take priority.

### Sharing time across tasks

The planner allocates a task's estimated remaining study time before moving on to the next task, unless the session runs out of time. With several tasks and a short session, one task can take up the entire study budget.

This keeps the schedule focused, but it may be less useful when I want to make progress on several subjects. I'm still considering whether to add an option to spread time across tasks. That would require deciding when to move on from unfinished work and how much time each task should receive.
