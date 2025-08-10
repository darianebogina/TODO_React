import {useState} from 'react'
import './App.css'

type Task = {
    id: string;
    text: string;
}

export function App() {
    const [tasks, setTasks] = useState<Array<Task>>([]);

    const addTask = (newText: string) => {
        if (newText.trim() === "") {
            alert("Please enter a new task");
        }
        const id: string = Math.floor(Math.random() * 1000).toString();
        const newTask = {id, text: newText};
        setTasks(prev => [newTask, ...prev]);
    }

    const deleteTask = (idToDelete: string) => {
        setTasks(prev => prev.filter((task: Task) => task.id !== idToDelete));
    }

    return (
        <>
            <NewTaskForm onAdd={addTask}/>
            <TasksList taskList={tasks} deleteTask={deleteTask}/>
        </>
    )
}

const NewTaskForm = ({onAdd}: { onAdd: (newText: string) => void }) => {
    const [newText, setNewText] = useState<string>("");
    return (
        <div>
            <h1>ToDo List</h1>
            <div>
                <input type="text" placeholder="Add task" onChange={(e) => setNewText(e.target.value)}/>
                <button onClick={() => onAdd(newText)}>Add</button>
            </div>
        </div>
    );
}

const TasksList = ({taskList, deleteTask}: { taskList: Array<Task>, deleteTask: (idToDelete: string) => void }) => {
    return (
        <div>
            <ul>
                {taskList.map(task => (
                    <TaskRow key={task.id} task={task} onDelete={deleteTask}/>
                ))}
            </ul>
        </div>
    );
}

const TaskRow = ({task, onDelete}: { task: Task, onDelete: (idToDelete: string) => void }) => {
    return (
        <li>
            <p>{task.text}</p>
            <button onClick={() => onDelete(task.id)}>&#10060;</button>
        </li>
    );
}
