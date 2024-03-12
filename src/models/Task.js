import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";

export class Ticket extends BaseModel {
    constructor(login, head, body, status) {
        super();
        this.login = login;
        this.head = head;
        this.body = body;
        this.status = status;
        this.storageKey = "tickets";
    }
  
    static save(login, ticket) {
        for (let el of getFromStorage(ticket.storageKey)) {
            if (el.head == ticket.head && el.login == login) {
                alert ('Таска с таким заголовком уже существует!');
                return false;
            } 
        };
        try {
            addToStorage(ticket, ticket.storageKey);
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }

    static replace(login, head, newStatus) {
        let keys = getFromStorage("tickets");
        if (login == 'admin') {
            for (let key of keys) {
                if (key.head == head) {
                    key.status = newStatus;
                } 
            };
        } else {
            for (let key of keys) {
                if (key.head == head && key.login == login) {
                    key.status = newStatus;
                } 
            };
        }
        localStorage.setItem("tickets", JSON.stringify(keys));
    }
  }