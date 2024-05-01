(function() {
  // Globals
const todoList = document.querySelector("#todo-list");
const userSelect = document.querySelector("#user-todo");
const form = document.querySelector("form")
let todos = [];
let users = [];


// Attach Event
document.addEventListener("DOMContentLoaded", initApp);
form.addEventListener("submit", handelSubmit)


// Basic logic
function getUserName(userId) {
  const user = users.find((us) => us.id === userId);
  return user.name;
}

function printTodo({userId, id, title, completed }) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = id;
  li.innerHTML = `<span>${title} <i>by</i>  <b>${getUserName(
    userId
  )}</b></span>`;

const status = document.createElement('input');
status.type = "checkbox";
status.checked = completed;
status.addEventListener ("change", handelTodoChange)

const close = document.createElement('span');
close.innerHTML = '&times';
close.className = 'close';
close.addEventListener('click', handelClose)
  
li.prepend(status);
li.append(close);
todoList.prepend(li);
}

function createUserOption(user) {
  const option = document.createElement("option");
  option.value = user.id;
  option.innerText = user.name;

  userSelect.append(option);
}

function removeTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);

  const todo = todoList.querySelector(`[data-id="${todoId}"]`);
  todo.querySelector("input").removeEventListener("change", handelTodoChange);
  todo.querySelector(".close").removeEventListener("click", handelClose);

  todo.remove();
}

function alertError(error) {
  alert(error.massage)
  
}


// Event Logic
function initApp() {
  Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
    [todos, users] = values;
    todos.forEach((todo) => printTodo(todo));
    users.forEach((user) => createUserOption(user));
  });
}

function handelSubmit(e) {
  e.preventDefault(handelSubmit);

  console.log(form.todo.value);
  console.log(form.user.value);

  createTodo({
    userId: Number(form.user.value),
    title: form.todo.value,
    completed: false,
  });
}

function handelTodoChange() {
  const todoId = this.parentElement.dataset.id  
  const completed = this.checked

  toggleTodoComplete(todoId, completed)
}

function handelClose() {
    const todoId = this.parentElement.dataset.id; 
    deleteTodo(todoId) 
}


// async Logic
 async function getAllTodos() {
  try {
     const response = await fetch(
       "https://jsonplaceholder.typicode.com/todos?_limit=30"
     );
     const data = await response.json();

     return data;  
  } catch (error) {
    alertError(error);
  }   
}

 async function getAllUsers() {
  try {
       const response = await fetch(
         "https://jsonplaceholder.typicode.com/users"
       );
       const data = await response.json();

       return data;  
  } catch (error) {
    alertError(error);
  }      
}

async function createTodo(todo){
  try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(todo),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newTodo = await response.json();

      printTodo(newTodo);
    
  } catch (error) {
    alertError(error);
  }

}

 async function toggleTodoComplete(todoId, completed) {
  try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ completed: completed }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error("Failed to connect with the server! Please try later");
      }
  } catch (error) {
    alertError(error);
  }
 }
  
 async function deleteTodo(todoId) {
  try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // const data = await response.json();
      // console.log(data)
      if (response.ok) {
        removeTodo(todoId);
      } else {
        throw new Error("Failed to connect with the server! Please try later");
      }
  } catch (error) {
    alertError(error);
  }
 }



})()