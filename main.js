// Get the button and form section
const addTaskBtn = document.getElementById('addTaskBtn');
const taskFormSection = document.getElementById('taskFormSection');
const viewTasksBtn = document.getElementById('viewTasksBtn');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');
const tasksContainer = document.getElementById('tasks-container');
const taskList = document.getElementById('taskList');

viewTasksBtn.addEventListener('click', () => {
    taskFormSection.style.display = 'none';
    taskListSection.style.display = 'block';
    fetch('http://localhost:6754/tasks')
        .then(response => response.json())
        .then(tasks => {
            // Clear the existing task list
            taskList.innerHTML = '';
            // Add each task to the list
            tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group';
                listItem.textContent = `${task.name}: ${task.description}`;
                taskList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Add event listener to show the form when the button is clicked
addTaskBtn.addEventListener('click', () => {
    taskFormSection.style.display = 'block';
});

// Handle form submission
document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskListSection = document.getElementById('taskListSection');
    const taskList = document.getElementById('taskList');

    const task = {
        name: taskName,
        description: taskDescription
    };

    // Send task to the server
    fetch('http://localhost:6754/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => response.text())
    .then(data => {
        console.log('Task saved:', data);
        // Optionally, update the UI here
        taskForm.reset();
        taskFormSection.style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('markTasks').addEventListener('click', () => {
    fetch('http://localhost:6754/tasks')
        .then(response => response.json())
        .then(tasks => {
            const tasksContainer1 = document.getElementById('tasks-container1');
            tasksContainer1.innerHTML = '';  // Clear previous content

            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.innerHTML = `
                    <p><strong>${task.name}</strong>: ${task.description}</p>
                    <p>Status: ${task.status}</p>
                    <select class="status-select">
                        <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                        <option value="Started" ${task.status === 'Started' ? 'selected' : ''}>Started</option>
                        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                `;
                
                const statusSelect = taskElement.querySelector('.status-select');
                statusSelect.addEventListener('change', () => {
                    const newStatus = statusSelect.value;

                    fetch(`http://localhost:6754/tasks/${task.id}/status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ status: newStatus })
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log('Task status updated successfully');
                        } else {
                            console.error('Failed to update task status');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                });

                tasksContainer1.appendChild(taskElement);
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
});

deleteTaskBtn.addEventListener('click', () => {
    fetch('http://localhost:6754/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasksContainer.innerHTML = '';
            tasksContainer.style.display = 'block';
            
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.setAttribute('data-id', task.id);
                taskElement.innerHTML = `
                    <span>${task.name} - ${task.description}</span>
                    <button class="delete-btn">Delete</button>
                `;

                tasksContainer.appendChild(taskElement);

                taskElement.querySelector('.delete-btn').addEventListener('click', () => {
                    const taskId = taskElement.getAttribute('data-id');

                    fetch(`http://localhost:6754/tasks/${taskId}`, {
                        method: 'DELETE',
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log('Task deleted successfully');
                            taskElement.remove();
                        } else if (response.status === 404) {
                            console.error('Task not found');
                        } else {
                            console.error('Failed to delete task');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
});
