// Seleção de elementos
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const searchInput = document.querySelector('#search-input');
const eraseBtn = document.querySelector('#erase-button');
const filterBtn = document.querySelector('#filter-select');

let oldInputValue;
//funções
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement('div');
  todo.classList.add('todo');

  //o titulo da nova tarefa é o parametro texto que vem do input.value
  const todoTitle = document.createElement('h3');
  todoTitle.innerText = text;
  //adicionar o h3 titulo dentro da div
  todo.appendChild(todoTitle);

  //botao de tarefa finalizada
  const doneBtn = document.createElement('button');
  //adicionar classe para o botao
  doneBtn.classList.add('finish-todo');
  //adicionar o icone dentro do botao
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  //adicionar o doneBtn dentro da div
  todo.appendChild(doneBtn);

  //Botao de edição
  const editBtn = document.createElement('button');
  //adicionar classe para o botao
  editBtn.classList.add('edit-todo');
  //adicionar o icone dentro do botao
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  //adicionar o editBtn dentro da div
  todo.appendChild(editBtn);

  //Botao de delete
  const deleteBtn = document.createElement('button');
  //adicionar classe para o botao
  deleteBtn.classList.add('remove-todo');
  //adicionar o icone dentro do botao
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  //adicionar o deleteBtn dentro da div
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  //se done for diferente de zero todo recebe a classe de done
  if (done) {
    todo.classList.add('done');
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);
  todoInput.value = '';
};

/*   //adiciona a tarefa e seus botoes na div geral que compoe a tarefa
  todoList.appendChild(todo);

  //após adicionar uma nova tarefa ele limpa o campo input
  todoInput.value = '';

  //apos limpar o campo input ele foca novamente no campo para uma nova digitação
  todoInput.focus(); */

//funcao criada para esconder os campos desnecessarios na hora de edição
const toggleForms = () => {
  editForm.classList.toggle('hide');
  todoForm.classList.toggle('hide');
  todoList.classList.toggle('hide');
};

const updateTodo = (text) => {
  const allTodo = document.querySelectorAll('.todo');
  allTodo.forEach((todo) => {
    //pegando o titulo do todo atual do foreach
    let todoTitle = todo.querySelector('h3');

    //confirma se é igual ao texto anterior e altera para o novo texto
    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll('.todo');

  switch (filterValue) {
    case 'all':
      todos.forEach((todo) => (todo.style.display = 'flex'));

      break;

    case 'done':
      todos.forEach((todo) =>
        todo.classList.contains('done')
          ? (todo.style.display = 'flex')
          : (todo.style.display = 'none'),
      );

      break;

    case 'todo':
      todos.forEach((todo) =>
        !todo.classList.contains('done')
          ? (todo.style.display = 'flex')
          : (todo.style.display = 'none'),
      );

      break;

    default:
      break;
  }
};

//eventos
todoForm.addEventListener('submit', (e) => {
  //evitar que a pagina de reload
  e.preventDefault();

  //pegar o valor que o usuario digitar (Adicione a sua tarefa:)
  const inputValue = todoInput.value;
  //validacao pro usuario nao criar uma tarefa vazia
  if (inputValue) {
    //salvar a nova tarefa
    saveTodo(inputValue);
  }
});

//pega qual foi o elemento clicado dentro do body
document.addEventListener('click', (e) => {
  //variavel recebe o elemento clicado
  const targetEl = e.target;

  //vai pegar o elemento pai DIV mais proximo que encapsula o elemento dentro
  const parentEl = targetEl.closest('div');

  let todoTitle;

  //condição criada para verificar se existe um tituto
  if (parentEl && parentEl.querySelector('h3')) {
    todoTitle = parentEl.querySelector('h3').innerText || '';
  }

  if (targetEl.classList.contains('finish-todo')) {
    //condição para o botao finish
    //adiciona ou retira da div a classe done para finalizar tarefa
    parentEl.classList.toggle('done');

    updateTodoStatusLocalStorage(todoTitle);
  }

  //condição para o botao remove
  if (targetEl.classList.contains('remove-todo')) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  //condição para o botao edit
  if (targetEl.classList.contains('edit-todo')) {
    toggleForms();
    //variaveis salvando o valor para serem mostradas no campo de edição
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

//botao de cancelar volta para a tela principal
cancelEditBtn.addEventListener('click', (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    //atualizar a edição
    updateTodo(editInputValue);
  }

  toggleForms();
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem('todos', JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem('todos', JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null,
  );

  localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null,
  );

  localStorage.setItem('todos', JSON.stringify(todos));
};

loadTodos();
