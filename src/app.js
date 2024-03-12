import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { Ticket } from "./models/Task";
import { generateTestUser, getTicketsFromStorage, addToStorage, kanbanContent, getFromStorage, selectContent, activeCount, isNotZeroCount, deleteFromStorage, editInStorage } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector(".navbar-container-auth-form");
const itemForm = document.querySelector(".item-form");
const authOK = document.querySelector(".navbar-container-auth-ok");
const signOut = document.querySelector(".navbar-container-auth-ok-dropbtn-content-logout__btn");
const adminUsers = document.querySelector(".navbar-container-auth-ok-dropbtn-content-users");
const adminUsersButton = document.querySelector(".navbar-container-auth-ok-dropbtn-content-users__btn");
const adminUsersAdd = document.querySelector(".navbar-container-auth-ok-dropbtn-content-addUser");
const adminUsersAddButton = document.querySelector(".navbar-container-auth-ok-dropbtn-content-addUser__btn");
const popupAddUser = document.querySelector(".addUser");
const adminUsersAddForm = document.querySelector(".addUser-form");
const popupAddUserButton = document.querySelector(".addUser__btn");
const closeAddUser = document.querySelector(".addUser__close");
const countActive = document.querySelector(".footer-count-active");
const countFinished = document.querySelector(".footer-count-finished");
const kanban = document.querySelector(".kanban");
const content = document.querySelector(".content");
const item = document.querySelector(".item");
const closeItem = document.querySelector(".item__close");
const btnEdit = document.querySelector(".btn__save");
const btnDelete = document.querySelector(".btn__delete");
const popup = document.querySelector(".popup");
const selectPopup = document.querySelector(".popup__select");
const closePopup = document.querySelector(".popup__close");
const btnPopup = document.querySelector(".popup__btn");
const deletePopup = document.querySelector(".popup__btn_delete");
const addToBacklog = document.querySelector(".backlog__add");
const addToReady = document.querySelector(".ready__add");
const addToProgress = document.querySelector(".progress__add");
const addToFinished = document.querySelector(".finished__add");
const backlog = document.querySelector(".kanban-parts__backlog");
const ready = document.querySelector(".kanban-parts__ready");
const inProgress = document.querySelector(".kanban-parts__inProgress");
const finished = document.querySelector(".kanban-parts__finished");
const backlogContainer = document.querySelector(".kanban-parts__dr-backlog");
const readyContainer = document.querySelector(".kanban-parts__dr-ready");
const inProgressContainer = document.querySelector(".kanban-parts__dr-inProgress");
const finishedContainer = document.querySelector(".kanban-parts__dr-finished");

let userLogin = null; // для определения пользователя
let head = null; // временная переменная для определения заголовка таски (для редактирования)

backlogContainer.addEventListener('dragover', allowDrop);
backlogContainer.addEventListener('drop', dropBacklog);
readyContainer.addEventListener('dragover', allowDrop);
readyContainer.addEventListener('drop', dropReady);
inProgressContainer.addEventListener('dragover', allowDrop);
inProgressContainer.addEventListener('drop', dropInProgress);
finishedContainer.addEventListener('dragover', allowDrop);
finishedContainer.addEventListener('drop', dropFinished);

function allowDrop(ev) {
  ev.preventDefault();
}

document.addEventListener('dragstart', function(event) {
  if (event.target.classList.contains('kanban-parts-items')) {
    event.dataTransfer.setData("text", event.target.innerHTML);
  }
})

function dropBacklog(ev) {
  ev.preventDefault();
  Ticket.replace(userLogin, ev.dataTransfer.getData("text"), "Backlog");
  backlog.innerHTML = kanbanContent(userLogin, "Backlog");
  ready.innerHTML = kanbanContent(userLogin, "Ready");
  inProgress.innerHTML = kanbanContent(userLogin, "Progress");
  finished.innerHTML = kanbanContent(userLogin, "Finished");
  popup.style.display = "none";
  countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
  countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
  addButtonsStatus(userLogin);
}

function dropReady(ev) {
  ev.preventDefault();
  Ticket.replace(userLogin, ev.dataTransfer.getData("text"), "Ready");
  backlog.innerHTML = kanbanContent(userLogin, "Backlog");
  ready.innerHTML = kanbanContent(userLogin, "Ready");
  inProgress.innerHTML = kanbanContent(userLogin, "Progress");
  finished.innerHTML = kanbanContent(userLogin, "Finished");
  popup.style.display = "none";
  countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
  countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
  addButtonsStatus(userLogin);
}

function dropInProgress(ev) {
  ev.preventDefault();
  Ticket.replace(userLogin, ev.dataTransfer.getData("text"), "Progress");
  backlog.innerHTML = kanbanContent(userLogin, "Backlog");
  ready.innerHTML = kanbanContent(userLogin, "Ready");
  inProgress.innerHTML = kanbanContent(userLogin, "Progress");
  finished.innerHTML = kanbanContent(userLogin, "Finished");
  popup.style.display = "none";
  countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
  countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
  addButtonsStatus(userLogin);
}

function dropFinished(ev) {
  ev.preventDefault();
  Ticket.replace(userLogin, ev.dataTransfer.getData("text"), "Finished");
  backlog.innerHTML = kanbanContent(userLogin, "Backlog");
  ready.innerHTML = kanbanContent(userLogin, "Ready");
  inProgress.innerHTML = kanbanContent(userLogin, "Progress");
  finished.innerHTML = kanbanContent(userLogin, "Finished");
  popup.style.display = "none";
  countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
  countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
  addButtonsStatus(userLogin);
}

generateTestUser(User);

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  if (authUser(login, password)) {
    if (login == 'admin') {
      adminUsers.style.display = "block";
      adminUsersAdd.style.display = "block";
    } else {
      adminUsers.style.display = "none";
      adminUsersAdd.style.display = "none";
    }
    userLogin = login;
    content.style = "display: none;";
    
    kanban.style = "display: flex;";
    // backlog.innerHTML = "Backlog";
    // backlog.innerHTML += `<div class="kanban-parts__add"><a href="#" class="backlog__add">+ Add card</a></div>`

    authOK.style = "display: flex;";
    loginForm.style = "display: none;";
    document.querySelector(".navbar-container-auth-ok__hello").innerHTML = `Здравствуйте, ${login}!`;
    countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
    countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
    addButtonsStatus(userLogin);
    backlog.innerHTML = kanbanContent(userLogin, "Backlog");
    ready.innerHTML = kanbanContent(userLogin, "Ready");
    inProgress.innerHTML = kanbanContent(userLogin, "Progress");
    finished.innerHTML = kanbanContent(userLogin, "Finished");
  }
  else alert('Доступ запрещен!');
  content.innerHTML = noAccessTemplate;
});

signOut.addEventListener("click", (event) => {
  loginForm.style = "display: block;";
  authOK.style = "display: none;";
  kanban.style = "display: none;";
  countActive.innerHTML = ``;
  countFinished.innerHTML = ``;
  content.style = "display: flex;";
  content.innerHTML = "Please Sign In to see your tasks!";
});

itemForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(itemForm);
  const title = formData.get("title");
  head = title;
  const text = formData.get("text");
  const status = 'Backlog';
  const ticket = new Ticket(userLogin, title, text, status);
  if (title) {
    Ticket.save(userLogin, ticket);
  }
  else {
    alert('Заголовок не может быть пустым!');
  }
  item.style = "display: none;";
  backlog.innerHTML = kanbanContent(userLogin, "Backlog");
  ready.innerHTML = kanbanContent(userLogin, "Ready");
  itemForm.reset();
  countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
  countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
  addButtonsStatus(userLogin);
})

closeItem.addEventListener("click", (event) => {
  item.style = "display: none;";
  itemForm.reset();
})

addToBacklog.addEventListener("click", (event) => {
  item.style = "display: flex;";
  itemForm.button.style = "display: block;";
  btnEdit.style.display = "none";
  btnDelete.style.display = "none";
});

btnEdit.addEventListener("click", (event) => {
  editInStorage(userLogin, head, itemForm.title.value, itemForm.text.value, "tickets");
  item.style = "display: none;";
  backlog.innerHTML = kanbanContent(userLogin, "Backlog");
  ready.innerHTML = kanbanContent(userLogin, "Ready");
  inProgress.innerHTML = kanbanContent(userLogin, "Progress");
  finished.innerHTML = kanbanContent(userLogin, "Finished");
  itemForm.reset();
  countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
  countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
  addButtonsStatus(userLogin);
})

btnDelete.addEventListener("click", (event) => {
  deleteFromStorage(userLogin, itemForm.title.value, "tickets");
  item.style = "display: none;";
  backlog.innerHTML = kanbanContent(userLogin, "Backlog");
  ready.innerHTML = kanbanContent(userLogin, "Ready");
  inProgress.innerHTML = kanbanContent(userLogin, "Progress");
  finished.innerHTML = kanbanContent(userLogin, "Finished");
  itemForm.reset();
  countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
  countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
  addButtonsStatus(userLogin);
})

addToReady.addEventListener("click", function(e) {
  selectPopup.innerHTML = selectContent(userLogin, "Backlog");
  popup.style.display = "flex";
  deletePopup.style.display = "none";
  btnPopup.style.display = "block";
  btnPopup.classList = "popup__btn popup__btn-addToReady item-form-input__btn";
})

addToProgress.addEventListener("click", function(e) {
  selectPopup.innerHTML = selectContent(userLogin, "Ready");
  popup.style.display = "flex";
  btnPopup.style.display = "block";
  deletePopup.style.display = "none";
  btnPopup.classList = "popup__btn popup__btn-addToProgress item-form-input__btn";
})

addToFinished.addEventListener("click", function(e) {
  selectPopup.innerHTML = selectContent(userLogin, "Progress");
  popup.style.display = "flex";
  deletePopup.style.display = "none";
  btnPopup.style.display = "block";
  btnPopup.classList = "popup__btn popup__btn-addToFinished item-form-input__btn";
})

closePopup.addEventListener("click", (event) => {
  popup.style = "display: none;";
})

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('kanban-parts-items')) {
    head = event.target.innerHTML;
    let data = [];
    let tickets = getFromStorage("tickets");
    for (let ticket of tickets) {
      if (ticket.login = userLogin) {
        data.push(ticket);
      }
    }
    for (let ticket of data) {
      if (ticket.head == event.target.innerHTML) {
        itemForm.title.value = ticket.head;
        itemForm.text.value = ticket.body;
        itemForm.button.style = "display: none;";
        btnEdit.style.display = "block";
        btnDelete.style.display = "block";
      }
    }
    item.style = "display: flex;";
  }
  if (event.target.classList.contains('popup__btn-addToReady')) {
    Ticket.replace(userLogin, getSelectValue(), "Ready");
    backlog.innerHTML = kanbanContent(userLogin, "Backlog");
    ready.innerHTML = kanbanContent(userLogin, "Ready");
    inProgress.innerHTML = kanbanContent(userLogin, "Progress");
    finished.innerHTML = kanbanContent(userLogin, "Finished");
    popup.style.display = "none";
    countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
    countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
    addButtonsStatus(userLogin);
  }
  if (event.target.classList.contains('popup__btn-addToProgress')) {
    Ticket.replace(userLogin, getSelectValue(), "Progress");
    backlog.innerHTML = kanbanContent(userLogin, "Backlog");
    ready.innerHTML = kanbanContent(userLogin, "Ready");
    inProgress.innerHTML = kanbanContent(userLogin, "Progress");
    finished.innerHTML = kanbanContent(userLogin, "Finished");
    popup.style.display = "none";
    countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
    countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
    addButtonsStatus(userLogin);
  }
  if (event.target.classList.contains('popup__btn-addToFinished')) {
    Ticket.replace(userLogin, getSelectValue(), "Finished");
    backlog.innerHTML = kanbanContent(userLogin, "Backlog");
    ready.innerHTML = kanbanContent(userLogin, "Ready");
    inProgress.innerHTML = kanbanContent(userLogin, "Progress");
    finished.innerHTML = kanbanContent(userLogin, "Finished");
    popup.style.display = "none";
    countActive.innerHTML = `Active tasks: ${activeCount(userLogin)['active']}`;
    countFinished.innerHTML = `Finished tasks: ${activeCount(userLogin)['finished']}`;
    addButtonsStatus(userLogin);
  }
});

function getSelectValue () {
  let selectValue = selectPopup.options[selectPopup.selectedIndex];
  return selectValue.innerHTML;
}

function addButtonsStatus (userLogin) {
  if (userLogin == 'admin') {
    addToBacklog.style.display = "none";
  } else {
    addToBacklog.style.display = "block";
  }

  if (isNotZeroCount(userLogin, "Backlog")) {
    addToReady.style = "color: #000000; cursor: pointer; ";
  }
  else {
    addToReady.style = "color: #888; pointer-events: none;";
  }
  if (isNotZeroCount(userLogin, "Ready")) {
    addToProgress.style = "color: #000000; cursor: pointer;";
  }
  else {
    addToProgress.style = "color: #888; pointer-events: none;";
  }
  if (isNotZeroCount(userLogin, "Progress")) {
    addToFinished.style = "color: #000000; cursor: pointer;";
  }
  else {
    addToFinished.style = "color: #888; pointer-events: none;";
  }
}

adminUsersButton.addEventListener('click', (event) => {
  let users = getFromStorage('users');
  selectPopup.innerHTML = '';
  let num = 1;
  for (let user of users) {
    if (user.login != 'admin') {
      selectPopup.innerHTML += `<option value="${num++}">${user.login}</option>`;
    }
  }
  popup.style.display = "flex";
  btnPopup.style.display = "none";
  deletePopup.style.display = "block";
})

deletePopup.addEventListener('click', (event) => {
  let users = getFromStorage('users');
  let data = [];
  for (let user of users) {
    if (user.login != getSelectValue()) {
      data.push(user)
    }
  }
  localStorage.setItem('users', JSON.stringify(data));
  popup.style = "display: none;";
  addButtonsStatus(userLogin);
})

adminUsersAddButton.addEventListener('click', (event) => {
  popupAddUser.style.display = "block";
})

closeAddUser.addEventListener("click", (event) => {
  popupAddUser.style = "display: none;";
  adminUsersAddForm.reset();
})

popupAddUserButton.addEventListener('click', (event) => {
  event.preventDefault();
  const formData = new FormData(adminUsersAddForm);
  const login = formData.get("login");
  const password = formData.get("password");
  for (let user of getFromStorage('users')) {
    if (user.login == login) {
      alert('Пользователь с таким логином уже существует!');
      popupAddUser.style = "display: none;";
      adminUsersAddForm.reset();
    }
  }
  const user = new User(login, password);
  User.save(user);

  popupAddUser.style = "display: none;";
  adminUsersAddForm.reset();
})