document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const pendingList = document.getElementById("pendingList");
    const completedList = document.getElementById("completedList");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const totalTasksSpan = document.getElementById("totalTasks");
    const clearAllBtn = document.getElementById("clearAll");

    let currentFilter = "all";

    // Load tasks
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        pendingList.innerHTML = "";
        completedList.innerHTML = "";
        
        tasks.forEach((task, index) => {
            if (task.completed) {
                addTaskToDOM(task, index, completedList);
            } else {
                addTaskToDOM(task, index, pendingList);
            }
        });
        
        updateStats();
        updateFilters();
    }

    // Add task to DOM
    function addTaskToDOM(task, index, list) {
        const li = document.createElement("li");
        const dueDate = new Date(task.date);
        const now = new Date();
        const isOverdue = !task.completed && dueDate < now;

        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span class="task-text">${task.text}</span>
                <span class="due-date ${isOverdue ? 'overdue' : ''}">
                    ${formatDate(dueDate)}
                </span>
            </div>
            <div class="task-actions">
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Toggle complete
        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => toggleComplete(index));

        // Delete task
        li.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            removeTask(index);
        });

        list.appendChild(li);
    }

    // Add new task
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        const taskDateTime = taskDate.value;
        
        if (taskText && taskDateTime) {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.push({
                text: taskText,
                date: taskDateTime,
                completed: false
            });
            saveTasks(tasks);
            taskInput.value = "";
            taskDate.value = "";
        } else {
            alert("Please fill both task and deadline fields!");
        }
    });

    // Toggle complete
    function toggleComplete(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
    }

    // Remove task
    function removeTask(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks.splice(index, 1);
        saveTasks(tasks);
    }

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            updateFilters();
        });
    });

    // Update filter visibility
    function updateFilters() {
        const pendingSection = document.querySelector(".pending-tasks");
        const completedSection = document.querySelector(".completed-tasks");
        
        switch(currentFilter) {
            case "all":
                pendingSection.style.display = "block";
                completedSection.style.display = "block";
                break;
            case "pending":
                pendingSection.style.display = "block";
                completedSection.style.display = "none";
                break;
            case "completed":
                pendingSection.style.display = "none";
                completedSection.style.display = "block";
                break;
        }
    }

    // Clear all tasks
    clearAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all tasks?")) {
            localStorage.removeItem("tasks");
            loadTasks();
        }
    });

    // Update statistics
    function updateStats() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        totalTasksSpan.textContent = `Total: ${tasks.length}`;
    }

    // Format date
    function formatDate(date) {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        }).format(date);
    }

    // Save tasks
    function saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }

    loadTasks();
});