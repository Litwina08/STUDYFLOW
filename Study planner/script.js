const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const progress = document.getElementById("progress");
const circleText = document.getElementById("circleText");
const message = document.getElementById("message");

const themeButton = document.getElementById("themeButton");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
let subjects = JSON.parse(localStorage.getItem("studySubjects")) || [];

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {

        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">
                ${task.completed ? "✓ " : ""}
                ${task.text}
            </span>
            <button class="delete">Delete</button>
        `;

        li.querySelector(".task-text").addEventListener("click", function() {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            displayTasks();
        });

        li.querySelector(".delete").addEventListener("click", function() {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        taskList.appendChild(li);
    });

    updateProgress();

    const taskCount = document.getElementById("taskCount");

    if (taskCount) {
        taskCount.textContent =
            tasks.length +
            (tasks.length === 1 ? " task" : " tasks");
    }
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function updateProgress() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    let percent = 0;

    if (total > 0) {
        percent = Math.round((completed / total) * 100);
    }

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    progress.textContent = percent + "%";
    circleText.textContent = percent + "%";

    const circle = document.querySelector(".progress-circle");

    if (circle) {
        const degrees = percent * 3.6;

        circle.style.background =
            `conic-gradient(
                #3155d9 ${degrees}deg,
                #e8ebf2 ${degrees}deg
            )`;
    }

    if (percent === 0) {
        message.textContent = "Let's get started!";
    } else if (percent < 50) {
        message.textContent = "Good start! Keep going!";
    } else if (percent < 100) {
        message.textContent = "Great job! Almost there!";
    } else {
        message.textContent = "Amazing! All tasks completed!";
    }
}

function saveSubjects() {
    localStorage.setItem(
        "studySubjects",
        JSON.stringify(subjects)
    );
}

function displaySubjects() {
    const subjectList = document.getElementById("subjectList");
    const subjectCount = document.getElementById("subjectCount");

    if (!subjectList) return;

    subjectList.innerHTML = "";

    subjects.forEach(function(subject, index) {

        const div = document.createElement("div");
        div.className = "subject";

        div.innerHTML = `
            <strong>${subject}</strong>
            <small>My study subject</small>
            <button class="subject-delete">Delete</button>
        `;

        div.querySelector(".subject-delete").addEventListener(
            "click",
            function() {
                subjects.splice(index, 1);
                saveSubjects();
                displaySubjects();
            }
        );

        subjectList.appendChild(div);
    });

    if (subjectCount) {
        subjectCount.textContent =
            subjects.length +
            (subjects.length === 1 ? " subject" : " subjects");
    }
}

const subjectInput = document.getElementById("subjectInput");
const addSubjectButton = document.getElementById("addSubjectButton");

function addSubject() {
    const subject = subjectInput.value.trim();

    if (subject === "") {
        alert("Please enter a subject!");
        return;
    }

    if (subjects.some(function(item) {
        return item.toLowerCase() === subject.toLowerCase();
    })) {
        alert("This subject already exists!");
        return;
    }

    subjects.push(subject);
    subjectInput.value = "";

    saveSubjects();
    displaySubjects();
}

if (addSubjectButton) {
    addSubjectButton.addEventListener("click", addSubject);
}

if (subjectInput) {
    subjectInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addSubject();
        }
    });
}

themeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeButton.textContent = "Light Mode";
    } else {
        themeButton.textContent = "Dark Mode";
    }
});


/* STUDY TIMER */

const timerDisplay = document.getElementById("timerDisplay");
const startTimer = document.getElementById("startTimer");
const pauseTimer = document.getElementById("pauseTimer");
const resetTimer = document.getElementById("resetTimer");
const timerInfo = document.getElementById("timerInfo");
const timerMode = document.getElementById("timerMode");

let timeLeft = 25 * 60;
let timer = null;
let isRunning = false;
let isBreak = false;

function updateTimerDisplay() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}

startTimer.addEventListener("click", function() {

    if (isRunning) return;

    isRunning = true;

    timer = setInterval(function() {

        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {

            clearInterval(timer);
            timer = null;
            isRunning = false;

            if (!isBreak) {

                alert(
                    "Study session complete! Take a 5 minute break."
                );

                isBreak = true;
                timeLeft = 5 * 60;

                timerMode.textContent = "Break Time";
                timerInfo.textContent = "Relax for 5 minutes";

            } else {

                alert(
                    "Break finished! Ready to study?"
                );

                isBreak = false;
                timeLeft = 25 * 60;

                timerMode.textContent = "Study Session";
                timerInfo.textContent = "Focus for 25 minutes";
            }

            updateTimerDisplay();
        }

    }, 1000);
});

pauseTimer.addEventListener("click", function() {

    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }

    isRunning = false;
});

resetTimer.addEventListener("click", function() {

    clearInterval(timer);

    timer = null;
    isRunning = false;
    isBreak = false;
    timeLeft = 25 * 60;

    timerMode.textContent = "Study Session";
    timerInfo.textContent = "Focus for 25 minutes";

    updateTimerDisplay();
});


/* START WEBSITE */

displayTasks();
displaySubjects();
updateTimerDisplay();
