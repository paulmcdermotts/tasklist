// variables to reuse
const userInput = document.getElementById("userInput");
const displayTask = document.getElementById("displayTask");
const feedback = document.getElementById('taskFeedback');
const userMessage = document.getElementById("userMessage");
const userButton = document.getElementById("userBtn");
const downArrow = document.getElementById("downArrow");


// function to hide introduction message
function hideMessage() {
    userMessage.style.display = "none";
    downArrow.style.display = "none";
}

// add task function
function addTask() {
    const taskInput = document.getElementById('userInput').value.trim();

    if (taskInput !== "") {
        // create a task element with a unique ID
        const task = {
            id: Date.now(),
            task: taskInput,
            completed: false
        };
        // create task element and display it
        const listItem = createTaskElement(task); // uses createTaskElement function
        displayTask.appendChild(listItem);

        // save the task to the local storage
        saveToLocalStorage(task);

        // clear the input field
        userInput.value = "";
    } else {
        feedback.textContent = "Please enter a task";
        setTimeout(() => feedback.textContent = "", 2000)
    }
}


// create the element
function createTaskElement(task) {
    const listItem = document.createElement('li');
    listItem.textContent = task.task; // Access the task content from the object
    listItem.className = 'listItem';
    listItem.setAttribute('data-id', task.id); // set the ID as a data attribute

    // checkbox for completing task
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'taskCheckbox';
    checkbox.checked = task.completed; // set the checkbox state based on task.completed
    if (task.completed) {
        listItem.classList.add('completed') // add completed if task is done
    }
    checkbox.addEventListener('change', function () {
        listItem.classList.toggle('completed', this.checked);

        // update the specific tasks completed status in local storage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.map(t => {
            if (t.id === task.id) {
                return { ...t, completed: this.checked }; // update completed property
            }
            return t; // keep other tasks unchanged
        });
        // save updated tasks back to local storage
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    });


    // add remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.className = 'removeButton';
    removeButton.addEventListener('click', function () {
        listItem.remove();
        removeTaskFromLocalStorage(task.id);
    });

    // append elements to the page
    listItem.appendChild(checkbox);
    listItem.appendChild(removeButton);
    return listItem;
}




// get tasks from local storage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || []; // retrieves the current items in local storage
}

// save tasks to local storage
function saveToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage(); // function called to retrieve the current state of local storage
    tasks.push(task); // add new task with unique ID to the array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // save updated array to local storage
}

// function to load tasks stored in local storage
function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        const listItem = createTaskElement(task);
        displayTask.appendChild(listItem);
    });
}

// remove a task from local storage
function removeTaskFromLocalStorage(id) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== id); // remove task with matching ID
    localStorage.setItem('tasks', JSON.stringify(tasks)); // save updated tasks array to local storage
}



// allow user to add task and hide introduction message with enter button
userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
        hideMessage();
    }
})

// event listener for when user clicks the add task button for the first time
userButton.addEventListener("click", hideMessage);


// load the tasks stored in the local storage
window.onload = loadTasks;