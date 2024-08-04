(function () {

    const updateTimeAndGreeting = () => {
        
        const date_now = new Date(); 
        
        const date = date_now.toDateString();
        const time = date_now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true}).toUpperCase();
        const hours = date_now.getHours();
        
        const greeting =  hours < 5 || hours >= 21 ? 'Good Night'
        : hours < 12 ? 'Good Morning' 
        : hours < 15 ? 'Good Afternoon' 
        : 'Good Evening';
        
        const date_day_field = document.getElementById('date-day');
        date_day_field.innerText = date;
        
        const time_field = document.getElementById('time');
        time_field.innerText = time;
        
        const time_based_greeting_field = document.getElementById('time-based-greeting');
        time_based_greeting_field.innerText = greeting;
    };

    updateTimeAndGreeting();

    const startNewDay = () => {

        // logic to reset the work data for the new day

        const userDataObject = JSON.parse(localStorage.getItem('user'));

        if (userDataObject !== null) {

            const workDataObject = userDataObject.workData;

            workDataObject.work_sessions = [];
            workDataObject.tasks.numeric_data.total = 0;
            workDataObject.tasks.numeric_data.completed = 0;
            workDataObject.tasks.numeric_data.pending = 0;
            workDataObject.tasks.numeric_data.delayed = 0;
            workDataObject.tasks.list = [];

            localStorage.setItem('user', JSON.stringify(userDataObject));
        }
    }
    
    setInterval(() => {

        updateTimeAndGreeting();

        const last_reset_date = localStorage.getItem('last_reset_date');
        const current_date = new Date().getDate().toString();

        if (last_reset_date !== null && last_reset_date !== current_date) {

            console.log('New Day! Data Reset...new date = '+new Date().getDate()+" old date = "+last_reset_date);

            // reset the data for the new day

            startNewDay();

            // update the last reset date

            localStorage.setItem('last_reset_date', current_date);
        }

    }, 1000 * 30); // 30 instead of 60 to increase precision
    
    if(localStorage.getItem('user') === null) {
    
        // logic to pop up create account modal

        // const create_profile_btn = document.getElementById('create-profile-btn');
        const app_container = document.getElementById('app-container');

        const task_pop_up_outer_container = document.getElementsByClassName('task-pop-up-outer-container')[1];

        const task_pop_up_inner_containers = document.getElementsByClassName('task-pop-up-inner-container');
        const set_up_profile_pop_up_inner_container = task_pop_up_inner_containers[1];

        const task_pop_up_modify_task_btns = document.getElementsByClassName('task-pop-up-modify-task-btn');
        const set_up_profile_card_btn = task_pop_up_modify_task_btns[1];

        const task_title_inputs = document.getElementsByClassName('task-title-input');
        const set_up_profile_username_input = task_title_inputs[1];

        app_container.style.position = "fixed";
        task_pop_up_outer_container.style.display = "flex";
        set_up_profile_pop_up_inner_container.style.display = "block";

        set_up_profile_username_input.addEventListener('input', () => {

            if (set_up_profile_username_input.value.trim() === "") {

                set_up_profile_card_btn.disabled = true;

            } else {

                set_up_profile_card_btn.disabled = false;
            }
        });
                
        set_up_profile_card_btn.addEventListener('click', () => {

            // when the user clicks on the create profile button

            const username = set_up_profile_username_input.value.trim();

            localStorage.setItem('user', JSON.stringify({
    
                firstname: username,
            
                workData: {
            
                    work_sessions:
            
                        [
                        
                        ],
                    
                    tasks: {
                
                        numeric_data: {
                
                            total: 0,
                            completed: 0,
                            pending: 0,
                            delayed: 0,
                        },
                
                        list:
                
                            [
    
                            ]
                    }
                }
            }));

            localStorage.setItem('last_reset_date', new Date().getDate());

            app_container.style.position = "static";
            task_pop_up_outer_container.style.display = "none";
            set_up_profile_pop_up_inner_container.style.display = "none";

            window.location.reload('./index.html');
        });

    } else {

        const userDataObject = JSON.parse(localStorage.getItem('user'));

        const greeting_user_firstname_field = document.getElementById('greeting-user-firstname');
        greeting_user_firstname_field.innerText = userDataObject.firstname;
    }

})();

const updateStartedAtMessage = () => {

    const workSessionObject = JSON.parse(localStorage.getItem('work_session'));

    const started_at_field = document.getElementById('time-started-at');

    if (workSessionObject === null || workSessionObject.started_at === null) {
        
        started_at_field.innerText = 'No Session Ongoing';

    } else {
        
        const started_at = workSessionObject.started_at;
        started_at_field.innerText = `Started at ${started_at.toUpperCase()}`;
    }
};

const convertTime = (totalSeconds) => {

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${hours} : ${minutes} : ${seconds}`;
};

const convertTimeStringToSeconds = (timeString) => {

    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds;
};

let total_duration = 0;

const updateTimerTime = () => {

    total_duration += 1;
    
    const time_elapsed_doing_work_field = document.getElementById('time-elapsed-doing-work');
    time_elapsed_doing_work_field.innerText = convertTime(total_duration);
};

const setWorkingTimer = () => {

    const workingTimerIntervalID = setInterval(updateTimerTime, 1000);
    
    return workingTimerIntervalID;
};

let workingTimerIntervalID;

const play_pause_btn_container = document.getElementById('play-pause-btn-container');
const play_pause_btn = document.querySelector('.working-timer-control-btns > #play-pause-btn-container > #play-pause-btn');

const work_status_field = document.querySelector('#work-status');
const dot_lottie_player = document.querySelector('.work-status-container > dotlottie-player');

const playSession = () => {

    // logic to play the timer

    workingTimerIntervalID = setWorkingTimer();
        
    play_pause_btn.classList.remove('fa-play', 'play-btn');
    play_pause_btn.classList.add('fa-pause', 'pause-btn');
    play_pause_btn_container.style.backgroundColor = '#db2424';
    dot_lottie_player.style.filter = "hue-rotate(0deg)";
    work_status_field.innerText = 'Work Session Ongoing';
};

const pauseSession = () => {

    // logic to pause the timer

    clearInterval(workingTimerIntervalID);

    play_pause_btn.classList.remove('fa-pause', 'pause-btn');
    play_pause_btn.classList.add('fa-play', 'play-btn');
    play_pause_btn_container.style.backgroundColor = ' #00ac5c';
    dot_lottie_player.style.filter = "hue-rotate(220deg)";
    work_status_field.innerText = 'Work Session Paused';
};

play_pause_btn_container.addEventListener('click', () => {

    if(play_pause_btn.classList.contains('fa-play', 'play-btn')) {

        playSession();

    } else {

        pauseSession();
    }
});

const enablePlayPauseBtn = () => {

    play_pause_btn_container.style.pointerEvents = 'all';
    play_pause_btn_container.style.opacity = '1';
    play_pause_btn_container.style.cursor = 'pointer';
};

const disablePlayPauseBtn = () => {

    play_pause_btn_container.style.pointerEvents = 'none';
    play_pause_btn_container.style.opacity = '0.5';
    play_pause_btn_container.style.cursor = 'not-allowed';
};

disablePlayPauseBtn();

const start_end_session_btn = document.querySelector('.working-timer-control-btns > #start-end-work-btn');

const startWorkSession = () => {

    enablePlayPauseBtn();

    playSession();

    localStorage.setItem("work_session", JSON.stringify({

        started_at: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true}),
        ended_at : null,
        effective_duration: 0
    }));

    start_end_session_btn.style.backgroundColor = "#db2424";
};

const endWorkSession = () => {

    disablePlayPauseBtn();

    pauseSession();

    const workSessionObject = JSON.parse(localStorage.getItem("work_session"));
    
    workSessionObject.ended_at = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true});
    // workSessionObject.effective_duration = convertTime(total_duration);
    workSessionObject.effective_duration = total_duration;

    localStorage.setItem("work_session", JSON.stringify(workSessionObject));

    start_end_session_btn.style.backgroundColor = "#00ac5c;";

    total_duration = 0;

    const time_elapsed_doing_work_field = document.getElementById('time-elapsed-doing-work');
    time_elapsed_doing_work_field.innerText = "00 : 00 : 00";

    work_status_field.innerText = 'No Session Ongoing';

    renderTotalWorkDuration();
};

const storeWorkSession = () => {

    const userDataObject = JSON.parse(localStorage.getItem("user"));

    if (userDataObject !== null) {

        const workSessions = userDataObject.workData.work_sessions;
        userDataObject.workData.work_sessions = [...workSessions, JSON.parse(localStorage.getItem("work_session"))];
    
        localStorage.setItem("user", JSON.stringify(userDataObject));
    }
};

start_end_session_btn.addEventListener('click', () => {

    if (start_end_session_btn.innerText === "Start Session") {

        // start an object to store the work session data in the local storage

        startWorkSession();
        updateStartedAtMessage();

        start_end_session_btn.innerText = "End Session";
    }
    else {

        // end the session

        endWorkSession();
        storeWorkSession();
        updateStartedAtMessage();

        start_end_session_btn.innerText = "Start Session";
    }
});

const addMoreSubtaskBtn = document.getElementById('add-more-subtask-button');

const addSubtaskField = () => {

    const subtaskListItem = document.createElement("li");
    const subtaskField = document.createElement("input");

    subtaskField.type = "text";
    subtaskField.className = "subtask-field";

    subtaskListItem.appendChild(subtaskField);
    
    const subtasksList = document.getElementById('subtasks-list');
    subtasksList.appendChild(subtaskListItem);
};

addMoreSubtaskBtn.addEventListener('click', addSubtaskField);
addMoreSubtaskBtn.addEventListener('keydown', (event) => {

    if (event.key === "Enter" || event.key === " ") {
        console.log("Enter key pressed");
        addSubtaskField();
    }
});

const add_task_btn = document.getElementById('add-task-btn');
const app_container = document.getElementById('app-container');

const task_pop_up_outer_container = document.getElementsByClassName('task-pop-up-outer-container')[0];

const task_pop_up_inner_containers = document.getElementsByClassName('task-pop-up-inner-container');
const create_task_pop_up_inner_container = task_pop_up_inner_containers[0];
const set_up_profile_pop_up_inner_container = task_pop_up_inner_containers[1];

const task_pop_up_modify_task_btns = document.getElementsByClassName('task-pop-up-modify-task-btn');
const create_task_card_btn = task_pop_up_modify_task_btns[0];
const set_up_profile_card_btn = task_pop_up_modify_task_btns[1];

const cancel_btns = document.getElementsByClassName('cancel-btn');
const create_task_cancel_btn = cancel_btns[0];
// const set_up_profile_cancel_btn = cancel_btns[1];

// const task_content_textareas = document.getElementsByClassName('task-content-textarea');
// const create_task_content_textarea = task_content_textareas[0];
// const update_task_content_textarea = task_content_textareas[1];

const task_title_inputs = document.getElementsByClassName('task-title-input');
const create_task_title_input = task_title_inputs[0];
const set_up_profile_username_input = task_title_inputs[1];

// const update_task_hidden_pid_field = document.getElementById('pid');

add_task_btn.addEventListener('click', () => {

    app_container.style.position = "fixed";
    task_pop_up_outer_container.style.display = "flex";
    create_task_pop_up_inner_container.style.display = "block";
});

const start_time_input = document.getElementById('start-time');
const end_time_input = document.getElementById('end-time');

const checkIfTaskInputEmpty = () => {

    const start_time = start_time_input.value;
    const end_time = end_time_input.value;

    if(create_task_title_input.value === "" || start_time === "" || end_time === "") {

        create_task_card_btn.disabled = true;
    }
    else {

        create_task_card_btn.disabled = false;
    }
};

create_task_title_input.addEventListener('input', checkIfTaskInputEmpty);
start_time_input.addEventListener('input', checkIfTaskInputEmpty);
end_time_input.addEventListener('input', checkIfTaskInputEmpty);

create_task_cancel_btn.addEventListener('click', () => {

    app_container.style.position = "static";
    task_pop_up_outer_container.style.display = "none";
    create_task_pop_up_inner_container.style.display = "none";
});

// update_task_cancel_btn.addEventListener('click', () => {

//     app_container.style.position = "static";
//     task_pop_up_outer_container.style.display = "none";
//     update_task_pop_up_inner_container.style.display = "none";
// });

const pauseAllOtherTasksExceptSelected = (selected_task_id) => {

    const pause_btns = Array.from(document.getElementsByClassName('task-pause-btn'));

    pause_btns.forEach((pause_btn) => {

        console.log(pause_btn.id.split('-')[2]);

        if (pause_btn.id.split('-')[2] !== selected_task_id) {

            pause_btn.classList.remove('fa-pause', 'task-pause-btn');
            pause_btn.classList.add('fa-play', 'task-play-btn');
        }
    });
};

const renderSelectedTask = (event) => {

    const selected_task_id = event.target.id.split('-')[2];
    
    const play_pause_btn = document.getElementById(`play-pause_btn-${selected_task_id}`);
    const current_task_status_field = document.getElementById('current-task-status');

    if (play_pause_btn.classList.contains('fa-play', 'task-play-btn')) {

        play_pause_btn.classList.remove('fa-play', 'task-play-btn');
        play_pause_btn.classList.add('fa-pause', 'task-pause-btn');

        current_task_status_field.innerText = "Ongoing";

        pauseAllOtherTasksExceptSelected(selected_task_id);
        
    } else {
        
        play_pause_btn.classList.remove('fa-pause', 'task-pause-btn');
        play_pause_btn.classList.add('fa-play', 'task-play-btn');
        
        current_task_status_field.innerText = "Paused";

        return;
    }

    const userDataObject = JSON.parse(localStorage.getItem('user'));

    if (userDataObject !== null) {

        // find the task object with the selected task id

        let selected_task;

        const tasksList = userDataObject.workData.tasks.list;

        tasksList.forEach((task) => {

            if (task.tID === selected_task_id) {

                selected_task = task;

                return;
            };
        });
        
        // extract the information from the selected task object

        const current_task_name_field = document.getElementById('current-task-name');
        current_task_name_field.innerText = `Task : ${selected_task.name}`;

        const subtasks_html_list = document.getElementById('sub-tasks');
        subtasks_html_list.innerHTML = "";

        const subtasks = selected_task.subtasks;

        const numeric_data = subtasks.numeric_data;
        const substaskObjects_list = subtasks.list;

        // update the current active task container with the selected task details
        
        substaskObjects_list.forEach((subtaskObject) => {

            const subtask_checkbox = document.createElement("input");

            subtask_checkbox.type = "checkbox";
            subtask_checkbox.className = "subtask-checkbox";
            subtask_checkbox.checked = subtaskObject.status === "completed" ? true : false;

            subtask_checkbox.addEventListener('click', () => {

                if (subtaskObject.status === "completed") {

                    subtaskObject.status = "incomplete";

                    if (numeric_data.completed > 0) {

                        numeric_data.completed--;
                    }

                    console.log("numeric_data.completed > 0 : ", numeric_data.completed > 0);

                } else {

                    subtaskObject.status = "completed";

                    if (numeric_data.completed < numeric_data.total) {

                        numeric_data.completed++;
                    }

                    console.log("numeric_data.completed < numeric_data.total : ", numeric_data.completed < numeric_data.total);
                }

                console.log(subtasks.numeric_data);

                selected_task.subtasks.numeric_data = numeric_data;
                selected_task.subtasks.list[subtaskObject.subtaskID] = subtaskObject;

                localStorage.setItem('user', JSON.stringify(userDataObject));
            });

            const subtasks_list_item = document.createElement("li");
            subtasks_list_item.className = `subtasks-list-item ${subtaskObject.status}`;
            subtasks_list_item.innerText = subtaskObject.name;
            subtasks_list_item.id = `${subtaskObject.subtaskID}:${subtaskObject.parentTaskID}`;

            const subtask_wrapper = document.createElement("div");
            subtask_wrapper.className = "subtask-wrapper";

            subtask_wrapper.appendChild(subtask_checkbox);
            subtask_wrapper.appendChild(subtasks_list_item);
            
            subtasks_html_list.appendChild(subtask_wrapper);
        });
    }
}

const renderTasks = () => {

    const todays_tasks_container = document.getElementById('todays-tasks-container');

    const all_tasks_container = document.getElementById('all-tasks-container');

    const userDataObject = JSON.parse(localStorage.getItem("user"));

    if (userDataObject !== null) {

        const tasksList = userDataObject.workData.tasks.list;

        const taskContainers = tasksList.map((taskObject) => {

            // extract the information from the task object

            const task_id = taskObject.tID;

            const task_status = taskObject.status;

            const scheduled_time_object = taskObject.scheduled_time;
            const start_time = scheduled_time_object.start;
            const end_time = scheduled_time_object.end;

            const completion_status = taskObject.completion_status;

            const task_name = taskObject.name;

            const subtasks_object = taskObject.subtasks;

            const subtasks_numeric_data = subtasks_object.numeric_data;
            const total_subtasks = subtasks_numeric_data.total;
            const completed_subtasks = subtasks_numeric_data.completed;

            let progress_percentage;

            if (total_subtasks === 0) {

                progress_percentage = 0;

            } else
            {
                progress_percentage = (completed_subtasks / total_subtasks) * 100;
            }

            // create all the elements for the task container

            const task_container = document.createElement("div");
            task_container.className = 'task-container';

            const task_control_container = document.createElement("div");
            task_control_container.className = "task-control-container";

            const task_play_pause_btn_container = document.createElement("div");
            task_play_pause_btn_container.className = "task-play-pause-btn-container";

            const task_play_pause_btn = document.createElement("i");
            const task_play_pause_btn_classnames = task_status === "paused" ? ["fa-solid", "fa-play", "task-play-btn", "task-control-btn"] : ["fa-solid", "fa-pause", "task-pause-btn", "task-control-btn"];
            task_play_pause_btn.classList.add(...task_play_pause_btn_classnames);
            task_play_pause_btn.id = `play-pause_btn-${task_id}`;

            task_play_pause_btn.addEventListener('click', renderSelectedTask);
            
            // task_container.addEventListener('click', (event) => {

            //     const target = event.target.closest('.task-control-btn');
            
            //     if (target) {

            //         event.target = target;

            //         // Call your function with the new target

            //         renderSelectedTask(event);
            //     }
            // });

            const task_duration_container = document.createElement("div");
            task_duration_container.className = "task-duration-container";

            const scheduled_time_container = document.createElement("div");
            scheduled_time_container.innerText = "Scheduled Time";

            const task_time_container = document.createElement("task-time");
            task_time_container.className = "task-time";

            const clock_icon = document.createElement("i");
            clock_icon.classList.add("fa-regular", "fa-clock");

            const start_time_container = document.createElement("span");
            start_time_container.className = "start-time";
            start_time_container.innerText = start_time;

            const end_time_container = document.createElement("span");
            end_time_container.className = "end-time";
            end_time_container.innerText = end_time;

            const task_details_container = document.createElement("div");
            task_details_container.className = "task-details-container";

            const task_name_container = document.createElement("div");
            task_name_container.className = "task-name";
            task_name_container.innerText = task_name;

            const task_progress_indicator = document.createElement("div");
            task_progress_indicator.className = "ldBar task-progress-indicator";

            task_progress_indicator.setAttribute("data-value", progress_percentage);

            task_progress_indicator.setAttribute("data-stroke-width", "5");
            task_progress_indicator.setAttribute("data-preset", "line");
            task_progress_indicator.style.width = "20%";
            task_progress_indicator.style.height = "25px";
            task_progress_indicator.setAttribute("data-transition-in", "ease");

            const task_status_container = document.createElement("div");
            task_status_container.classList.add("task-status-container");
            
            const task_status_indicator = document.createElement("div");
            task_status_indicator.classList.add("task-status-indicator");
            task_status_indicator.classList.add(`${completion_status}-status`);

            const task_deadline_container = document.createElement("div");
            task_deadline_container.classList.add("task-deadline");
            task_deadline_container.classList.add(`${completion_status}-deadline`);
            task_deadline_container.innerText = completion_status[0].toUpperCase() + completion_status.slice(1, completion_status.length); // or exact time information

            // adding the elements to the respective parent elements in the DOM

            task_play_pause_btn_container.appendChild(task_play_pause_btn);

            task_time_container.appendChild(clock_icon);
            task_time_container.appendChild(document.createTextNode(" "));
            task_time_container.appendChild(start_time_container);
            task_time_container.appendChild(document.createTextNode(" - "));
            task_time_container.appendChild(end_time_container);

            task_duration_container.appendChild(scheduled_time_container);
            task_duration_container.appendChild(task_time_container);

            task_control_container.appendChild(task_play_pause_btn_container);
            task_control_container.appendChild(task_duration_container);

            task_status_container.appendChild(task_status_indicator);
            task_status_container.appendChild(task_deadline_container);

            task_details_container.appendChild(task_name_container);
            task_details_container.appendChild(task_progress_indicator);
            task_details_container.appendChild(task_status_container);            

            task_container.appendChild(task_control_container);
            task_container.appendChild(task_details_container);

            return task_container;
        });

        if (tasksList.length === 0) 
        {
            todays_tasks_container.style.overflow = "hidden";

            all_tasks_container.innerHTML = "";
            all_tasks_container.classList.add("empty");
            
            // empty task list message container

            // <div id="empty-tasklist-message-container">
            //     <h3>No Tasks Added Today! Plan Your Day Now and let your productivity Sprout!</h3>
            //     <i class="fa-solid fa-list-check" id="list-icon"></i>
            // </div>

            const empty_tasklist_message_container = document.createElement("div");
            empty_tasklist_message_container.id = "empty-tasklist-message-container";

            const empty_tasklist_message = document.createElement("h3");
            empty_tasklist_message.innerText = "No Tasks Added Today! Plan Your Day Now and let your productivity Sprout! 🌱";

            const list_icon = document.createElement("i");
            list_icon.id = "list-icon";
            list_icon.classList.add("fa-solid", "fa-list-check");

            empty_tasklist_message_container.appendChild(empty_tasklist_message);
            empty_tasklist_message_container.appendChild(list_icon);

            all_tasks_container.appendChild(empty_tasklist_message_container);
        }
        else 
        {
            todays_tasks_container.style.overflow = "auto";

            // clearing the existing container content

            all_tasks_container.innerHTML = "";
            all_tasks_container.classList.remove("empty");

            // adding the the task containers to the all tasks container

            taskContainers.forEach((taskContainer) => {

                all_tasks_container.appendChild(taskContainer);
            })

            // all_tasks_container.append(...taskContainers); // here, it conflicts with append() of loading-bar.js
        }
    }
}

create_task_card_btn.addEventListener('click', () => {

    const create_task_title_input = document.getElementsByClassName('task-title-input')[0].value;
    const start_time = document.getElementById('start-time').value;
    const end_time = document.getElementById('end-time').value;
    const subtask_fields = Array.from(document.getElementsByClassName('subtask-field'));

    let subtask_names = subtask_fields.map(subtask_field => {

        if (subtask_field.value.trim() !== "") {

            return subtask_field.value.trim();
        }
    });

    subtask_names = subtask_names.filter((subtask) => {

        return subtask !== undefined;
    });

    const start_time_hrs = start_time.split(':')[0];
    const start_time_mins = start_time.split(':')[1];

    const end_time_hrs = end_time.split(':')[0];
    const end_time_mins = end_time.split(':')[1];

    const start_time_12_hour_format = start_time_hrs > 12 ? `${start_time_hrs - 12}:${start_time_mins}  PM` : `${start_time} AM`;
    const end_time_12_hour_format = Number(end_time.split(':')[0]) > 12 ? `${end_time_hrs - 12}:${end_time_mins} PM` : `${end_time} AM`;

    // logic to add task to DOM and update the local storage object
    
    const userDataObject = JSON.parse(localStorage.getItem('user'));
    
    if(userDataObject != null) {
        
        let tasksObject = userDataObject.workData.tasks;

        tasksObject.numeric_data.total++;
        tasksObject.numeric_data.pending++;

        let subtasks = {

            numeric_data: {

                total: 0,
                completed: 0
            },

            list:

                [

                ]
        };

        const newTaskObject = {
    
            status: 'paused',
    
            scheduled_time: {
    
                start: start_time_12_hour_format,
                end: end_time_12_hour_format
            },
    
            completion_status: 'pending',
    
            name: create_task_title_input,

            tID: `task${tasksObject.numeric_data.total}`, 
    
            subtasks: {
                
                numeric_data: {
    
                    total: 0,
                    completed: 0
                },
    
                list: subtask_names.map(subtask => {
                
                    return {
    
                        name: subtask,
                        status: 'incomplete',
                        subtaskID: `subtask${subtasks.numeric_data.total}`,
                        parentTaskID: `task${tasksObject.numeric_data.total}`
                    }
                })

            }
        };
        
        newTaskObject.subtasks.numeric_data.total = newTaskObject.subtasks.list.length;

        // let tasksObject = userDataObject.workData.tasks;

        // tasksObject.numeric_data.total++;
        // tasksObject.numeric_data.pending++;

        // newTaskObject.tID = `task${tasksObject.numeric_data.total}`;
        
        let taskList = tasksObject.list;
        
        taskList = [...taskList, newTaskObject];
        
        tasksObject.list = taskList;
        
        userDataObject.workData.tasks = tasksObject;

        localStorage.setItem('user', JSON.stringify(userDataObject))
    }

    renderTasks();

    app_container.style.position = "static";
    task_pop_up_outer_container.style.display = "none";
    create_task_pop_up_inner_container.style.display = "none";
});

renderTasks();

const total_work_duration_indicator = document.getElementById('total-work-duration-indicator');

const renderTotalWorkDuration = () => {

    const userDataObject = JSON.parse(localStorage.getItem('user'));

    if (userDataObject !== null) {

        const work_sessions = userDataObject.workData.work_sessions;

        const total_work_duration = work_sessions.reduce((work_duration, currWorkSessionObject) => {

            return work_duration + currWorkSessionObject.effective_duration;

        }, 0);

        const percentage_of_hours_worked = total_work_duration / 86400 * 100;

        total_work_duration_indicator.setAttribute("data-value", percentage_of_hours_worked);
    }

};

renderTotalWorkDuration();