class ToDo {
    constructor() {
        this.tasks = this.loadTasksFromLocalStorage();
    }

    loadTasksFromLocalStorage() {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    }

    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask() {
        const button = document.querySelector('#add-todo');
        const input = document.querySelector('#input');
        const date = document.querySelector('#date');
        const todoContainer = document.querySelector('#todos');

        button.addEventListener('click', () => {
            const taskDescription = input.value.trim();
            const taskDate = date.value;
            
            if (taskDescription === '') {
                alert('Task description cannot be empty!');
                return;
            }

            if (taskDate === '') {
                alert('Task date cannot be empty!');
                return;
            }

            const task = {
                description: taskDescription,
                dueDate: taskDate,
            };

            this.tasks.push(task);
            this.saveTasksToLocalStorage();
            this.displayTasks(todoContainer);
            input.value = '';
        });
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasksToLocalStorage();
        this.displayTasks(document.querySelector('#todos'));
    }

    highlightText(taskDescription, filter) {
        if (!filter) return taskDescription;
        const regex = new RegExp(`(${filter})`, 'gi');
        return taskDescription.replace(regex, `<span class="highlight">$1</span>`);
    }

    displayTasks(todoContainer, filter = '') {
        todoContainer.innerHTML = '';

        const filteredTasks = this.tasks.filter(task => 
            task.description.toLowerCase().includes(filter.toLowerCase())
        );

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('todo-item');
            const highlightedDescription = this.highlightText(task.description, filter);
            taskItem.innerHTML = `
               <div class="todo-right">
                <input class="checkbox" type="checkbox" />
                <p class="todo-text">${highlightedDescription}</p>
                <span> - Due: ${task.dueDate}</span>
               </div>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;

            todoContainer.appendChild(taskItem);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const taskIndex = e.target.getAttribute('data-index');
                this.removeTask(taskIndex);
            });
        });
    }

    checkCheckbox() {
        try {
         const todoContainer = document.querySelector('#todos');
         const checkbox = document.querySelector('.checkbox');
 
         checkbox.addEventListener('change', () => {
             if (checkbox.checked) {
                 todoContainer.style.textDecoration = 'line-through';
             } else {
                 todoContainer.style.textDecoration = 'none';
             }
         });
        } catch (error) {
         console.log(error)
        }
     }

    changeTask() {
        const todoContainer = document.querySelector('#todos');
        todoContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('todo-text')) {
                const taskElement = event.target;
                const index = Array.from(todoContainer.children).indexOf(taskElement.closest('.todo-item'));
                const input = document.createElement('input');
                input.type = 'text';
                input.value = taskElement.textContent;
    
                taskElement.replaceWith(input);
                input.focus();
    
                input.addEventListener('blur', () => {
                    this.tasks[index].description = input.value;
                    this.saveTasksToLocalStorage();
                    this.displayTasks(todoContainer);
                });
    
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        input.blur();
                    }
                });
            }
        });
    }
    
    searchTasks() {
        const searchInput = document.querySelector('.search input');
        const todoContainer = document.querySelector('#todos');
        
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.trim();
            this.displayTasks(todoContainer, filter);
        });
    }

    init() {
        const todoContainer = document.querySelector('#todos');
        this.displayTasks(todoContainer);
        this.checkCheckbox();
        this.addTask();
        this.changeTask();
        this.searchTasks();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const todo = new ToDo();
    todo.init();
});
