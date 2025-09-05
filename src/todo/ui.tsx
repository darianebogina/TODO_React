import {memo, useState} from "react";
import type {Task, Filter} from "./types.ts";
import {useTasks} from "./model.ts";
import '../App.css'

export function App() {
    const {tasks, loading, addTask, deleteTask} = useTasks();

    const [filter, setFilter] = useState<Filter>("all");

    return (
        <>
            <h1>ToDo List</h1>
            <NewTaskForm onAdd={addTask}/>
            <FilterTasks setFilter={setFilter}/>
            {loading ? <p> Loading...</p> : <TasksList taskList={tasks} deleteTask={deleteTask} filterTask={filter}/>}
        </>
    )
}

const NewTaskForm = ({onAdd}: { onAdd: (newText: string) => void }) => {
    const [newText, setNewText] = useState<string>("");

    return (
        <>
            <div>
                <input type="text" placeholder="Add task" value={newText}
                       onChange={(e) => setNewText(e.target.value)}/>
                <button className="add-btn" onClick={() => {
                    onAdd(newText);
                    setNewText("");
                }}>Add
                </button>
            </div>
        </>
    );
}

const FilterTasks = memo(({setFilter}: { setFilter: (filter: Filter) => void }) => {
    return (
        <div>
            <button onClick={() => setFilter("all")}>All</button>
            <button onClick={() => setFilter("active")}>Active</button>
            <button onClick={() => setFilter("done")}>Done</button>
        </div>
    )
});

const TasksList = ({taskList, deleteTask, filterTask}: {
    taskList: Array<Task>,
    deleteTask: (idToDelete: string) => void,
    filterTask: Filter
}) => {
    return (
        <div>
            <ul>
                {taskList.filter((task) => {
                    if (filterTask === "active") {
                        return !task.isDone;
                    } else if (filterTask === "done") {
                        return task.isDone;
                    } else {
                        return true;
                    }
                }).map(task => (
                    <TaskRow key={task.id} task={task} onDelete={deleteTask}/>
                ))}
            </ul>
        </div>
    );
}

const TaskRow = memo(({task, onDelete}: { task: Task, onDelete: (idToDelete: string) => void }) => {
    return (
        <>
            <li className={task.isDone ? "doneTask" : ""}>
                <p>{task.text}</p>
                {task.isDone ? null
                    : <button className="delete-btn" onClick={() => onDelete(task.id)}>&#10060;</button>}
            </li>
        </>

    );
}, arePropsEqual);

function arePropsEqual(oldProps: { task: Task, onDelete: (id: string) => void },
                       newProps: { task: Task, onDelete: (id: string) => void }) {
    return (
        oldProps.task.id === newProps.task.id &&
        oldProps.task.text === newProps.task.text &&
        oldProps.task.isDone === newProps.task.isDone
    );
}