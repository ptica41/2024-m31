export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const getTicketsFromStorage = function (login='admin', status) {
  let tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  let data = [];
  if (login == 'admin') {
    for (let ticket of tickets) {
      if (ticket.status == status) {
        data.push(ticket);
      }
    }
  } else {
    for (let ticket of tickets) {
      if (ticket.login == login && ticket.status == status) {
        data.push(ticket);
      }
    }
  }
  return data;
}

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const editInStorage = function (login='admin', oldHead, newHead, newBody, key) {
  let keys = getFromStorage(key);
  if (login == 'admin') {
    for (let el of keys) {
      if (el.head == oldHead) {
        el.head = newHead;
        el.body = newBody;
      }
    }
  } else {
    for (let el of keys) {
      if (el.head == oldHead && el.login == login) {
        el.head = newHead;
        el.body = newBody;
      }
    }
  }
  localStorage.setItem(key, JSON.stringify(keys));
}

export const deleteFromStorage = function (login='admin', head, key) {
  let keys = getFromStorage(key);
  let data = [];
  if (login == 'admin') {
    for (let el of keys) {
      if (el.head != head) {
        data.push(el)
      }
    }
  } else {
    for (let el of keys) {
      if (el.login != login) {
        data.push(el)
      } else if (el.head != head) {
        data.push(el)
      }
    }
  }
  localStorage.setItem(key, JSON.stringify(data));
}

export const generateTestUser = function (User) {
  localStorage.clear();
  const testUser = new User("test", "qwerty123");
  User.save(testUser);
  const adminUser = new User("admin", "qwerty123");
  User.save(adminUser);
};

export const kanbanContent = function (login, status) {
  if (login == 'admin') {

  }
  let tickets = getTicketsFromStorage(login, status);
  let data = '';
  for (let ticket of tickets) {
    data += `<li class="kanban-parts-items" draggable="true">${ticket.head}</li>`;
  }
  return data;
}

export const selectContent = function (login, status) {
  let tickets = getTicketsFromStorage(login, status);
  let data = '';
  let num = 1;
  for (let ticket of tickets) {
    data += `<option value="${num++}">${ticket.head}</option>`;
  }
  return data;
}

export const activeCount = function (userLogin='admin') {
  let count = {};
  count['active'] = 0;
  count['finished'] = 0;
  let keys = getFromStorage("tickets");
  if (userLogin == 'admin') {
    for (let key of keys) {
      if (key.status != "Finished") {
          count['active']++;
      } 
      else if (key.status == "Finished") {
        count['finished']++;
      }
    }
  } else {
    for (let key of keys) {
      if (key.status != "Finished" && key.login == userLogin) {
          count['active']++;
      } 
      else if (key.status == "Finished" && key.login == userLogin) {
        count['finished']++;
      }
    }
  }

  return count;
}

export const isNotZeroCount = function(userLogin='admin', status) {
  if (userLogin == 'admin') {
    for (let el of getFromStorage("tickets")) {
      if (el.status == status) {
        return true;
      }
    }
  } else {
    for (let el of getFromStorage("tickets")) {
      if (el.status == status && el.login == userLogin) {
        return true;
      }
    }
  }
  return false;
}