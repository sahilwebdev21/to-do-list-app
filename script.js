document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            addTaskToDOM(task, index);
        });
    }

    // Add task to the DOM
    function addTaskToDOM(task, index) {
        console.log("Adding task:", task); // Debugging
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add("completed");
        }
        
        // Toggle complete
        li.addEventListener("click", () => {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks[index].completed = !tasks[index].completed;
            saveTasks(tasks);
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            removeTask(index);
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // Add new task
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.push({ text: taskText, completed: false });
            saveTasks(tasks);
            taskInput.value = "";
        }
    });

    // Remove task
    function removeTask(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.splice(index, 1);
        saveTasks(tasks);
    }

    // Save tasks to local storage
    function saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }

    loadTasks();
});
