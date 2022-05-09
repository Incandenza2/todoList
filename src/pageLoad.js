import {format, isToday, isSameDay, addDays} from "date-fns";



const dom = (function () {
    let addElement = function (elementType, parentNode, classWanted) {
        let elementWanted =  document.createElement(elementType)
        let parent = document.querySelector(parentNode)
        elementWanted.classList.add(classWanted);
        parent.appendChild(elementWanted);
        return elementWanted;
    };
    return {addElement};
})();

//function to set attributes on the input boxes in the form
function setAttributes(element, attributes) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    };
};



const drawProjects = function(currentDay) {
    console.log(projectsModule.projectsArray)
    let projectsBox = document.querySelector(".projectsBox");
    projectsBox.replaceChildren("");
    projectsModule.projectsArray.forEach((project) => {
        console.log(project)
        console.log(project.title.value)
        let projectFile = dom.addElement("div", ".projectsBox", "project");
        projectFile.classList.add(`${project.title.value}`);
        let projectTitle = dom.addElement("div", `.${project.title.value}`, "projectTitle");
        projectTitle.textContent = `${project.title.value}: ` + `${format(currentDay, "PPPP")}`;
        let taskList = dom.addElement("div", `.${project.title.value}`, "taskList");
        project.tasks.value.forEach((element) => {
            let task = dom.addElement("p", ".taskList", "task");
            task.textContent = `${element.description}`;
            task.addEventListener("click", () => {
                task.classList.toggle("completed");
                if (element.completionStatus === "not completed") {
                    element.completionStatus = "completed"
                } else if (element.completionStatus === "completed") {
                    element.completionStatus = "not completed"
                };
                console.log(element.completionStatus);
            })
        })
        let quickAddBox = dom.addElement("div", `.${project.title.value}`, "quickAddBox");
        quickAddBox.setAttribute("id", `${project.title.value}` + "QuickAddBox");
        let quickAddBoxLabel = dom.addElement("label", `#${project.title.value}` + "QuickAddBox", "quickAddBoxLabel");
        quickAddBoxLabel.textContent = "Quick add:"
        let quickAddBoxInput = dom.addElement("input", `#${project.title.value}` + "QuickAddBox", "quickAddBoxInput");
        setAttributes(quickAddBoxInput, {"type": "text", "id": `${project.title.value}` + "QuickAddBoxInput", "placeholder": "single time only", "maxlength": "100"})
        let AddToTodayButton = dom.addElement("button", `#${project.title.value}` + "QuickAddBox", "addButton");
        AddToTodayButton.textContent = "Today";
        let AddToTomorrowButton = dom.addElement("button", `#${project.title.value}` + "QuickAddBox", "addButton");
        AddToTomorrowButton.textContent = "Tomorrow";
        AddToTodayButton.addEventListener("click", () => {
            if (quickAddBoxInput.value.length > 0) {
            let randomTaskId
            for (let i = 0; i < 1; ) {
                randomTaskId = Math.floor(Math.random() * 1000)
                if (tasksModule.allTasks.some((task)=> {task.id === randomTaskId})) {
                    i = 0
                } else {i = 1};
            }
            console.log(currentDay)
            let addedTask = Object.create(tasksModule.taskFactory, {
                "description": {value: `${quickAddBoxInput.value}`},
                "completionStatus" : {value: "not completed", writable: true},
                "date" : {value: `${currentDay}`},
                "periodicity" : {value: "once", writable: true}, 
                "priorityNumber" : {value: "1"},
                "id" : {value: `${randomTaskId}`}
            });

            tasksModule.allTasks.push(addedTask);
            tasksModule.todayTasks.push(addedTask);
            drawProjects(currentDay);
            }

        })
        AddToTomorrowButton.addEventListener("click", () => {
            if (quickAddBoxInput.value.length > 0) {
            let randomTaskId
            for (let i = 0; i < 1; ) {
                randomTaskId = Math.floor(Math.random() * 1000)
                if (tasksModule.allTasks.some((task)=> {task.id === randomTaskId})) {
                    i = 0
                } else {i = 1};
            }
            let tomorrow = addDays(currentDay, 1);
            console.log("tomorrow" + tomorrow)
            let addedTask = Object.create(tasksModule.taskFactory, {
                "description": {value: `${quickAddBoxInput.value}`},
                "completionStatus" : {value: "not completed", writable: true},
                "date" : {value: `${tomorrow}`},
                "periodicity" : {value: "once", writable: true}, 
                "priorityNumber" : {value: "1"},
                "id" : {value: `${randomTaskId}`}
            });

            tasksModule.allTasks.push(addedTask);
            quickAddBoxInput.value = "";    
            console.log(tasksModule.allTasks);
            }

        })
    })
}

/*Factory function for tasks. Task object should have a description which will be laid out on the list, 
a status for completed or not, a day/date so that the code knows when to display as today or not, 
a periodicity status (single time, daily, day of the week; default is single), an optional priority number from 1 to 10.*/

const tasksModule = (function () {
    const taskFactory = function (description, completionStatus, date, periodicity, priorityNumber) {
        this.description = description,
        this.completionStatus = completionStatus,
        this.date = date,
        this.periodicity = periodicity,
        this.priorityNumber = priorityNumber
    };
    const allTasks = [];
    const todayTasks = [];
    return {taskFactory, allTasks, todayTasks};
})();

const projectsModule = (function() {
    let todayProject = {
        "title": {value: "Today"},
        "tasks": {value: tasksModule.todayTasks}
    }
    let projectsArray = [todayProject];
    return {projectsArray};
})();


// temporary created tasks for testing, will remove later since the user will be the one creating the tasks

let pianoTask = Object.create(tasksModule.taskFactory, {
    "description": {value: "Practice piano for 1 hour."},
    "completionStatus" : {value: "not completed", writable: true},
    "date" : {value: ""},
    "periodicity" : {value: "daily", writable: true}, 
    "priorityNumber" : {value: "1"}
});

tasksModule.allTasks.push(pianoTask);
tasksModule.todayTasks.push(pianoTask);





/*Each project/list will have its own array of tasks.   */




const pageLoad = function () {
    let currentDay = new Date();
    let main = dom.addElement("main", "#content", "main")
    let projectsBox = dom.addElement("div", ".main", "projectsBox")
    drawProjects(currentDay);

}

export {pageLoad};

/*The user can quick add a task to TODAY or TOMORROW. 
The user can slow add a task to a SPECIFIC DATE ONCE, or make it DAILY, or WEEKDAY PERIODIC, or EVERY OTHER DAY STARTING FROM SPECIFIC DATE.
There will be a menu for REMOVING PERIODIC TASKS from the allTasks Array.
First time visit will Define the current day, and then on NON first time visits (if there's local storage) 
we will compare the defined current day to the actual current day and if it's different we pull the matching tasks of TODAY out of the allTasks*/