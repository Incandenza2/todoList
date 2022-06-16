import {format, isToday, isSameDay, isBefore, addDays, parseJSON, getDay, toDate, parseISO, formatISO} from "date-fns";



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

function generateRandomTaskId() {
    let randomTaskId
            for (let i = 0; i < 1; ) {
                randomTaskId = Math.floor(Math.random() * 1000)
                if (tasksModule.allTasks.some((task)=> {task.id === randomTaskId})) {
                    i = 0
                } else {i = 1};
            }
    return randomTaskId;
}

var currentDay;


const drawProjects = function() {
    let busy = 0; // this is for the button checks later on, to make sure you can't click them while the weekday menu is up.
    tasksModule.checkCompletion();
    console.log(projectsModule.projectsArray)
    let projectsBox = document.querySelector(".projectsBox");
    projectsBox.replaceChildren("");
    projectsModule.projectsArray.forEach((project) => {
        let projectFile = dom.addElement("div", ".projectsBox", "project");
        projectFile.classList.add(`${project.title.value}`);
        let projectTop = dom.addElement("div", `.${project.title.value}`, "projectTop")
        let projectTitle = dom.addElement("div", ".projectTop", "projectTitle");
        projectTitle.textContent = `${project.title.value}: ` + `${format(currentDay, "PPPP")}`;
        let taskList = dom.addElement("div", ".projectTop", "taskList");
        project.tasks.value.forEach((element) => {
            let task = dom.addElement("p", ".taskList", "task");
            task.textContent = `${element.description}`;
            if (element.completionStatus === "completed") {task.classList.add("completed")};
            if (element.periodicity === "once") {task.classList.add("periodicityOnce")};
            task.addEventListener("click", () => {
                task.classList.toggle("completed");
                if (element.completionStatus === "not completed") {
                    element.completionStatus = "completed"
                } else if (element.completionStatus === "completed") {
                    element.completionStatus = "not completed"
                };
                console.log(element.id);
                tasksModule.allTasks.find((thing)=> {return thing.id ===  element.id}).completionStatus = element.completionStatus;
                tasksModule.todayTasks.find((thing)=> {return thing.id ===  element.id}).completionStatus = element.completionStatus;
                storageManagement.saveEverything(currentDay);
                tasksModule.checkCompletion();
                console.log(element.completionStatus + element.id);
            })
        })
        let quickAddBox = dom.addElement("div", `.${project.title.value}`, "quickAddBox");
        quickAddBox.setAttribute("id", `${project.title.value}` + "QuickAddBox");
        let quickAddBoxLabel = dom.addElement("label", `#${project.title.value}` + "QuickAddBox", "quickAddBoxLabel");
        quickAddBoxLabel.textContent = "Add task:"
        let quickAddBoxInput = dom.addElement("input", `#${project.title.value}` + "QuickAddBox", "quickAddBoxInput");
        setAttributes(quickAddBoxInput, {"type": "text", "id": `${project.title.value}` + "QuickAddBoxInput", "placeholder": "Ex.: 'Write a TPS report'", "maxlength": "100"})
        let AddToTodayButton = dom.addElement("button", `#${project.title.value}` + "QuickAddBox", "addButton");
        AddToTodayButton.textContent = "Today";
        let AddToTomorrowButton = dom.addElement("button", `#${project.title.value}` + "QuickAddBox", "addButton");
        AddToTomorrowButton.textContent = "Tomorrow";
        AddToTodayButton.addEventListener("click", () => {
            if ((quickAddBoxInput.value.length > 0) && (busy === 0)) {
            let randomTaskId = generateRandomTaskId();
            tasksModule.addTask(quickAddBoxInput.value, formatISO(currentDay), "once", "normal", randomTaskId);
            }

        })
        AddToTomorrowButton.addEventListener("click", () => {
            if ((quickAddBoxInput.value.length > 0) && (busy === 0)) {
            let randomTaskId = generateRandomTaskId();
            let tomorrow = formatISO(addDays(currentDay, 1));
            console.log(tomorrow);
            tasksModule.addTask(quickAddBoxInput.value, tomorrow, "once", "normal", randomTaskId); 
            }

        }
        )
        // ATTENTION, THIS IS A TEMPORARY SPOT TO ADD A DAILY, THE GOAL IS TO HAVE A DIFFERENT MENU. FOR TESTING
        let AddDailyButton = dom.addElement("button", `#${project.title.value}` + "QuickAddBox", "addButton");
        AddDailyButton.textContent = "New Daily";
        AddDailyButton.addEventListener("click", () => {
            if ((quickAddBoxInput.value.length > 0) && (busy === 0)) {
            let randomTaskId = generateRandomTaskId();
            tasksModule.addTask(quickAddBoxInput.value, formatISO(currentDay), "daily", "normal", randomTaskId); 
            };

        }
        )
        // ATTENTION, THIS IS A TEMPORARY SPOT TO ADD A DAILY, THE GOAL IS TO HAVE A DIFFERENT MENU. FOR TESTING

        //This will bring up a Weekday Menu for the user to check which weekdays it means to allocate the task to.
        let AddWeekdayButton = dom.addElement("button", `#${project.title.value}` + "QuickAddBox", "addButton");
        AddWeekdayButton.textContent = "Specify Weekday";
        AddWeekdayButton.addEventListener("click", () => {
            if ((quickAddBoxInput.value.length > 0) && (busy === 0)) {
            busy = 1;
            let taskNameInput = quickAddBoxInput.value;
            let formBox = dom.addElement("form", "#content", "formBox");
            let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            weekdays.forEach((weekday, index) => {
                let checkLabelPair = dom.addElement("div", ".formBox", "checkLabelPair");
                checkLabelPair.classList.add(weekday);
                let checkbox = dom.addElement("input", `.${weekday}`, "checkbox");
                setAttributes(checkbox, {"type": "checkbox", "id": weekday, "name": index, "value": "weekday"})
                let label = dom.addElement ("label", `.${weekday}`, "label");
                label.textContent = weekday
                setAttributes(label, {"for": weekday})
            })
            let submitButton = dom.addElement("button", ".formBox", "submitButton");
            submitButton.textContent = "Submit"
            submitButton.addEventListener("click", () => {
                let chosenWeekdays = [];
                formBox.querySelectorAll(".checkbox").forEach((checkbox) => {
                    if (checkbox.getAttribute("checked") == true);
                    chosenWeekdays.push(checkbox.getAttribute("name"));
                });
                formBox.remove();
                let randomTaskId = generateRandomTaskId();
                tasksModule.addTask(taskNameInput, chosenWeekdays, "weekday", "normal", randomTaskId);
                drawProjects();

            })
            }

        }
        )
    })
}

/*Factory function for tasks. Task object should have a description which will be laid out on the list, 
a status for completed or not, a day/date so that the code knows when to display as today or not, 
a periodicity status (single time, daily, day of the week; default is single), an optional priority, normal or high.*/

const tasksModule = (function () {
    const taskFactory = function (description, completionStatus, date, periodicity, priority, id) {
        this.description = description,
        this.completionStatus = completionStatus,
        this.date = date,
        this.periodicity = periodicity,
        this.priority = priority,
        this.id = id
    };
    let allTasks = [];
    let todayTasks = [];

    const retrieveAllTasks = function () {
        if (JSON.parse(localStorage.getItem("allTasks")) != null){
            allTasks = JSON.parse(localStorage.getItem("allTasks"));
            console.log("allTasks retrieved")
        };
        return allTasks
    }
    const retrieveTodayTasks = function () {
        if (JSON.parse(localStorage.getItem("todayTasks")) != null){
            todayTasks = JSON.parse(localStorage.getItem("todayTasks"));
            console.log("TodayTasks retrieved")
        };
        return todayTasks
    }

    const addTask = function (description, date, periodicity, priority, id) {
        let addedTask = Object.create(taskFactory, {
            "description": {value: `${description}`, enumerable: true},
            "completionStatus" : {value: "not completed", writable: true, enumerable: true},
            "date" : {value: `${date}`, writable: true, enumerable: true},
            "periodicity" : {value: `${periodicity}`, writable: true, enumerable: true}, 
            "priority" : {value: `${priority}`, writable: true, enumerable: true},
            "id" : {value: `${id}`, enumerable: true}
        });
        tasksModule.allTasks.push(addedTask)
        if (isSameDay(parseISO(date), currentDay)) {tasksModule.todayTasks.push(addedTask)}
        storageManagement.saveEverything(currentDay);
        drawProjects();
        
    }

    const checkCompletion = function() {
        let completionCount = 0;
        if (tasksModule.todayTasks.length > 0) {
            tasksModule.todayTasks.forEach((task) => {
                if (task.completionStatus === "completed") {
                    completionCount++
                };
            })
            let completionRate = (completionCount / tasksModule.todayTasks.length) * 100;
            if (completionRate == 0) {document.body.className = ""
            } else if ((completionRate > 0) && (completionRate <= 20)) {document.body.className = "one"
            } else if ((completionRate > 20) && (completionRate <= 40)) {document.body.className = "three"
            } else if ((completionRate > 40) && (completionRate <= 60)) {document.body.className = "five"
            } else if ((completionRate > 60) && (completionRate <= 80)) {document.body.className = "seven"
            } else if ((completionRate > 80) && (completionRate <= 100)) {document.body.className = "nine"}
            if ((completionRate == 100) && (document.querySelector(".completionBox") == undefined))   {
                let completionBox = dom.addElement("div", ".rightMain", "completionBox");
                let completionMessage = dom.addElement("p", ".completionBox", "completionMessage");
                if (tasksModule.todayTasks.length == 1) {completionMessage.textContent = "Nice, you did a thing."
                } else if (tasksModule.todayTasks.length < 5) {
                completionMessage.textContent = `Not bad. Doing ${tasksModule.todayTasks.length} things is better than nothing.`
                } else if (tasksModule.todayTasks.length < 9) {
                    completionMessage.textContent = `Awesome. You did plenty today.`
                } else if (tasksModule.todayTasks.length < 20) {
                    completionMessage.textContent = `Wow! You've done so much! Or you're just testing me to see if I react to higher numbers of tasks, in which case you really should value your time better. `
                } else if (tasksModule.todayTasks.length >= 20) {
                    completionMessage.textContent = "Seriously, fuck off, holy shit."
                } 
            } else if ((completionRate != 100) && (document.querySelector(".completionBox") != undefined) && (document.querySelector(".completionBox") != null)) {
                let completionBox = document.querySelector(".completionBox");
                completionBox.remove();
            }
        }
    }
    return {taskFactory, allTasks, todayTasks, addTask, retrieveAllTasks, retrieveTodayTasks, checkCompletion};
})();

const projectsModule = (function() {
    let projectsArray = [];
    // this function will just run once on the first time a user opens the page
    const initializeTodayProject = function () {
        let todayProject = {
            "title": {value: "Today", writable: true},
            "tasks": {value: tasksModule.todayTasks, writable: true}
        }
        projectsArray.push(todayProject)
    }
    const retrieveProjectsArray = function() {
        JSON.parse(localStorage.getItem("projectsArray")).forEach((project) => {
            projectsArray.push(project)
            console.log(projectsArray);
        });
        return projectsArray
    }

    const refreshTodayProject = function() {
        projectsArray[0].tasks.value = tasksModule.todayTasks;
    };
    return {projectsArray, initializeTodayProject, retrieveProjectsArray, refreshTodayProject};
})();

const storageManagement = (function() {
    const initialize = function(currentDay) {
        if (!localStorage.getItem("currentDay")) {
            currentDay = new Date();
            projectsModule.initializeTodayProject();
            saveEverything(currentDay);
        } else {
            currentDay = parseJSON(JSON.parse(localStorage.getItem("currentDay")))
            if (isToday(currentDay)) {
                tasksModule.allTasks = tasksModule.retrieveAllTasks();
                tasksModule.todayTasks = tasksModule.retrieveTodayTasks();
                projectsModule.projectsArray = projectsModule.retrieveProjectsArray().map((x) => x);
                projectsModule.refreshTodayProject();
                console.log("this totally happens")
            //parse allTasks and todayTasks array and establish them in the page.
            } else if (!isToday(currentDay)) {
                currentDay = new Date();
                //localStorage.setItem("currentDay", JSON.stringify(currentDay));
                tasksModule.allTasks = tasksModule.retrieveAllTasks();
                tasksModule.allTasks.forEach((task, index) => {
                    console.log(isBefore(parseISO(task.date), currentDay));
                    if (task.periodicity === "daily") {
                        task.completionStatus = "not completed"
                        tasksModule.todayTasks.push(task);
                    } else if (task.periodicity === "weekday") {
                        if (task.date.includes(getDay(currentDay))) {
                            task.completionStatus = "not completed"
                            tasksModule.todayTasks.push(task);
                        }
                    } else if ((task.periodicity === "once") && (task.completionStatus === "not completed")) {
                        console.log("Logging the isBefore check")
                        console.log((isBefore(parseISO(task.date), currentDay)));
                        console.log("Logging the isSameDay check")
                        console.log((isSameDay(parseISO(task.date), currentDay)));
                        console.log("logging task.date" + parseISO(task.date) + "then logging currentDay" + currentDay)
                        if ((isBefore(parseISO(task.date), currentDay)) || (isSameDay(parseISO(task.date), currentDay))) {
                        tasksModule.todayTasks.push(task);
                        }
                    } else if ((task.periodicity === "once") && (task.completionStatus === "completed")) {
                        tasksModule.allTasks.splice(index, 1);
                    }
                })
                projectsModule.projectsArray = projectsModule.retrieveProjectsArray().map((x) => x);
                projectsModule.refreshTodayProject();
                saveEverything(currentDay);
            

            //we redefine currentDay AND we pull the tasks from allTasks, and generate a new todayTasks by 
            //grabbing all daily Tasks, grabbing all tasks whose weekday matches, grabbing all "once" tasks that are
            //not completed AND for which the date is before currentDay
            }
         } return currentDay
    }

    const saveEverything = function(currentDay) {
        localStorage.setItem("currentDay", JSON.stringify(currentDay));
        localStorage.setItem("allTasks", JSON.stringify(tasksModule.allTasks));
        localStorage.setItem("todayTasks", JSON.stringify(tasksModule.todayTasks))
        localStorage.setItem("projectsArray", JSON.stringify(projectsModule.projectsArray));
    }
    return {initialize, saveEverything}
})();

// temporary created tasks for testing, will remove later since the user will be the one creating the tasks

/*let pianoTask = Object.create(tasksModule.taskFactory, {
    "description": {value: "Practice piano for 1 hour."},
    "completionStatus" : {value: "not completed", writable: true},
    "date" : {value: ""},
    "periodicity" : {value: "daily", writable: true}, 
    "priorityNumber" : {value: "1"}
});

tasksModule.allTasks.push(pianoTask);
tasksModule.todayTasks.push(pianoTask);*/





/*Each project/list will have its own array of tasks.   */




const pageLoad = function () {
    currentDay = storageManagement.initialize(currentDay);

    
    //function to check if it's the first ever arrival
    //if it's first arrival, define currentDay, generate "today" project and set it to local storage.
    // if it's not first arrival, check the currentDay from storage against new Date(), and if it is, 
    // generate a new "todayTasks" with all the daily + otherwise date / weekday defined tasks in "allTasks". 
    // For example something like (tasks.forEach : if periodicity === daily, task.date = currenDay)
    let leftMain = dom.addElement("div","#content", "leftMain");
    let main = dom.addElement("main", "#content", "main");
    let rightMain = dom.addElement("div","#content","rightMain");
    let projectsBox = dom.addElement("div", ".main", "projectsBox")
    drawProjects();

}

export {pageLoad};

/*The user can quick add a task to TODAY or TOMORROW. 
The user can slow add a task to a SPECIFIC DATE ONCE, or make it DAILY, or WEEKDAY PERIODIC, or EVERY OTHER DAY STARTING FROM SPECIFIC DATE.
There will be a menu for REMOVING PERIODIC TASKS from the allTasks Array.
First time visit will Define the current day, and then on NON first time visits (if there's local storage) 
we will compare the defined current day to the actual current day and if it's different we pull the matching tasks of TODAY out of the allTasks*/