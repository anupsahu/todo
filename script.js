"use strict;";

class Todo {
  id = 0;
  todo = [];

  //Selecting Elements
  clear = document.querySelector(".clear");
  dateElement = document.getElementById("date");
  list = document.getElementById("list");
  input = document.getElementById("input");

  CHECK = "fa-check-circle";
  UNCHECK = "fa-circle-thin";
  LINE_THROUGH = "lineThrough";

  constructor() {
    this.restoreState();
    //Date
    const today = new Date();
    this.dateElement.innerHtml = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    this.addEventListeners();
  }

  completeTask(event) {
    const element = event.target;
    const id = parseInt(element.id);
    element.classList.toggle(this.CHECK);
    element.classList.toggle(this.UNCHECK);
    element.parentNode
      .querySelector(".text")
      .classList.toggle(this.LINE_THROUGH);

    this.todo.map((todo) => {
      if (todo.id === id) todo.done = !todo.done;
    });
    this.saveState();
  }

  removeTask(event) {
    const element = event.target;
    const id = parseInt(element.id);
    element.parentNode.parentNode.removeChild(element.parentNode);

    this.todo.map((todo) => {
      if (todo.id === id) todo.delete = true;
    });

    this.saveState();
  }

  addEventListeners() {
    var self = this;
    //Add Todo
    this.input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        const todo = input.value;
        if (todo) {
          let obj = {
            id: self.id++,
            value: todo,
            done: false,
            delete: false,
          };
          self.todo.push(obj);
          self.addTodo(obj);
          self.saveState();
        }
        self.input.value = "";
      }
    });

    //Clear task
    this.clear.addEventListener("click", function () {
      sessionStorage.clear();
      self.id = 0;
      self.todo = [];
      self.list.innerHTML = "";
    });
  }

  addTodo(todo) {
    if (!todo.delete) {
      const check = todo.done ? this.CHECK : this.UNCHECK;
      const line = todo.done ? this.LINE_THROUGH : "";
      const item = `<li class="item">
            <i class="fa ${check} co" id="${todo.id}" onclick="todo.completeTask(event)" ></i>
            <p class="text ${line}">${todo.value}</p>
            <i class="fa fa-trash-o de" id="${todo.id}" onclick="todo.removeTask(event)"></i>
          </li>`;
      this.list.insertAdjacentHTML("beforeend", item);
    }
  }

  saveState() {
    let state = {
      id: this.id,
      todo: this.todo,
    };
    sessionStorage.setItem("todo", JSON.stringify(state));
  }

  restoreState() {
    let state = sessionStorage.getItem("todo");
    if (state) {
      state = JSON.parse(state);
      this.id = state.id;
      this.todo = state.todo;

      this.todo.map((todo) => {
        this.addTodo(todo);
      });
    }
  }
}

var todo = new Todo();
