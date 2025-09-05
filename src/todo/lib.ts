import type {Task} from "./types";

export const createTask = (text: string): Task => {
    const id = Math.floor(Math.random() * 1000).toString();
    const isDone = false;
    return {id, text, isDone};
};

export const saveTasks = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const loadTasks = (): Task[] => {
    const tasksString = localStorage.getItem('tasks');

    if (tasksString) {
        return JSON.parse(tasksString)
    } else {
        return [];
    }
};
