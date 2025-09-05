import {useState} from "react";
import type {Task} from "./types.ts";
import {useTasks} from "./model.ts";
import '../App.css'

export function App() {
    const {tasks, loading, addTask, deleteTask} = useTasks();

    return (
        <>
            <NewTaskForm onAdd={addTask}/>
            {loading ? <p> Loading...</p> : <TasksList taskList={tasks} deleteTask={deleteTask}/>}
        </>
    )
}

const NewTaskForm = ({onAdd}: { onAdd: (newText: string) => void }) => {
    const [newText, setNewText] = useState<string>("");

    return (
        <div>
            <h1>ToDo List</h1>
            <div>
                <input type="text" placeholder="Add task" value={newText}
                       onChange={(e) => setNewText(e.target.value)}/>
                <button className="add-btn" onClick={() => {
                    onAdd(newText);
                    setNewText("");
                }}>Add
                </button>
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
        <>

            <li className={task.isDone ? "doneTask" : ""} >
                <p>{task.text}</p>
                {task.isDone ? null
                    : <button className="delete-btn" onClick={() => onDelete(task.id)}>&#10060;</button>}
            </li>
        </>

    );
}