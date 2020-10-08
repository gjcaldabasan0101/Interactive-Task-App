const taskList = document.querySelector('.task-list');

//event to create input for new task
document.querySelector('#task-btn').addEventListener('click', (e) => {

  //create new element 
  const inputRow = document.createElement('tr');
  inputRow.id="input-row"
  inputRow.innerHTML = `
  <th> 
    <button type="submit" class="btn btn-default task-completed">
      <span class="far fa-circle text-primary delete">
      </span>
    </button>
  </th>
  <th>
    <input type="text" class="form-control" id="task">
  </th>
  `;

  //append the created element
  document.querySelector('#task-head').appendChild(inputRow);

  //focus method for the input element
  document.querySelector("#task").focus();
})

// Task Class
let Task = class {
  constructor(todo, taskId, status){
    this.taskId = taskId
    this.todo = todo;
    this.status =  status
  }
}

//Localstorage class
let Store = class {
  //Get item from the localstorage
  static getItem() {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
      tasks = [];
    }else {
      tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
  }

  //Add item to the localstorage
  static addItem(task){
    const tasks = Store.getItem();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

//class for generating new id
let TaskId = class{
  //generating random number
  static random(){
    let random = Math.floor(Math.random() * (1999 - 1000) +1);
    return random;
  }

  //checking if the generated number is not existing
  static id() {
    const items = Store.getItem();
    let rand = this.random();
    
    if(items.length == 0) {
      return rand;
    }
    else if(items.length != 0) {
      for(let i = 0; i < items.length ; i++){
        let item = items[i];

        //generated another number if the generated already exist.
        while(item.taskId == rand){
          rand = this.random();
        }
      }
      return rand;
    }
  }
}
// Ui class : Holds all the UI Tasks
let UI = class {

  //Display the tasks stored from the localstorage    
  static displayTasks() {
    const tasks = Store.getItem();
    tasks.forEach((task) => {

      if(task.status == 'incomplete') {
        UI.addToTaskList(task);
      }
    });
  }

  static displayCompleteTasks(){
    const tasks = Store.getItem();
    tasks.forEach((task) => {

      if(task.status == 'complete')  {
        const complete = tasks.filter(({status}) => status == 'complete').length;
        UI.compTask(complete);
      }
    });
  }

  //create a new element for the task
  static addToTaskList(task) {
    const list = document.querySelector('#task-body');
    const row = document.createElement('tr');
    
    row.id="task-row";

    row.innerHTML = `
      <td>
        <button class="btn btn-default task-completed sm-0">
          <span class="far fa-circle text-primary delete circle">
          </span>
        </button>
      </td>
      <td class="task-info">${task.todo}</td>
      <td class="task-id">${task.taskId}</td>
    `;

    list.insertBefore(row, list.firstElementChild);
  }

  //clear the input value after submit
  static clearForm() {
    document.querySelector('#task').value = '';
  }
  
  //remove the input element after submit
  static removeTaskForm(){
    document.querySelector('#input-row').remove();
  }

  //remove the task 
  static doneTask(el) {
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.parentElement.remove();
    }
  }
  //mark task as complete
  static completeTask(task1) {
    const newTask = Store.getItem();
    newTask.forEach((task) =>{
      if(task.taskId == task1){
        task.status = "complete";
      }
        
    });
    localStorage.setItem('tasks', JSON.stringify(newTask));

    }

    static compTask(task){
      const footer = document.querySelector('.footer-visible');
      footer.innerHTML = `
        <div class="footer-container">
          <label class="label-comp ml-3 mt-3">Completed (${task})</label>
          <button class="btn btn-default mr-4 mt-2 arrow-up"><span class="fas fa-chevron-up"></span></button>
        </div>
      `
    }
  
  //change the circle icon to check 
  static checkOver(el){
    if(el.classList.contains('circle')){
      el.className = "fas fa-check circle text-success delete"
    }
  }

  //change the check icon to circle
  static checkOut(el){
    if(el.classList.contains('circle')){
      el.className = "far fa-circle text-primary circle"
    }
  }
}

//Event for displaying the task
document.addEventListener('DOMContentLoaded', UI.displayTasks);

document.addEventListener('DOMContentLoaded', UI.displayCompleteTasks);

//Submit event for new task
document.addEventListener('submit', (e) => {

  e.preventDefault();

  const taskId = TaskId.id();
  const task = document.querySelector('#task').value;
  const status = "incomplete";

  const newTask = new Task(task, taskId, status);

  UI.addToTaskList(newTask);

  Store.addItem(newTask);

  UI.clearForm();

  UI.removeTaskForm();
})

//Event for removing done task
document.querySelector('#task-body').addEventListener('click', (e) => {
  
  UI.doneTask(e.target);

  UI.completeTask(e.target.parentElement.parentElement.parentElement.lastElementChild.textContent);

  UI.displayCompleteTasks();

})

//Change icon to check when mouse hover the icon
document.querySelector('#task-body').addEventListener('mouseover', (e) => {
  const parent = e.target;

  UI.checkOver(parent);


})

//Change back the icon when mouse is hover out
document.querySelector('#task-body').addEventListener('mouseout', (e) => {
  const parent = e.target;
  UI.checkOut(parent)
})



