import {useRef, useState, useEffect, useLayoutEffect} from "react";
import {createTask, saveTasks, loadTasks} from "./lib";
import type {Task} from "./types";

export function useTasks() {
    const [tasks, setTasks] = useState<Array<Task>>([]);
    const [loading, setLoading] = useState(true);
    const deleteUsed = useRef(false);

    const broadcast = useRef(new BroadcastChannel("test_channel"));

    const addTask = (newText: string) => {
        if (newText.trim() === "") {
            alert("Please enter a new task");
            return;
        }
        const newTask = createTask(newText);

        setTasks(prev => [newTask, ...prev]);
        broadcast.current.postMessage("Update tasks");
    }

    const deleteTask = (idToDelete: string) => {
        deleteUsed.current = true;
        setTasks(prev => {
            const taskToDelete = prev.find((task) => task.id === idToDelete);
            taskToDelete!.isDone = true;
            return [...prev];
        });
        broadcast.current.postMessage("Update tasks");
    };

    useEffect(() => {
        if ((deleteUsed.current && tasks.length === 0) || tasks.length !== 0) {
            saveTasks(tasks);
        }
    }, [tasks]);

    const updateTasksFromLS = () => {
        setTasks(loadTasks);
    }

    useEffect(() => {
        updateTasksFromLS();

        broadcast.current.addEventListener("message", () => {
            updateTasksFromLS();
        });
        return () => broadcast.current.close();
    }, []);

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500)

        return () => {
            clearTimeout(timer);
        }
    }, [])
    return {tasks, loading, addTask, deleteTask};
}