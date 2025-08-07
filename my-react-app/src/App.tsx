// import {useState} from 'react'
import './App.css'

export function App() {
    // const [count, setCount] = useState(0)

    return (
        <>
            <NewTaskForm/>
            <TasksList tasks={["Three", "Four"]}/>
        </>
    )
}

const NewTaskForm = () => {
    return (
        <div>
            <h1>ToDo List</h1>
            <div>
                <input type="text" placeholder="Add task"/>
                <button>Add</button>
            </div>
        </div>
    );
}

const TasksList = ({tasks}: { tasks: Array<string> }) => {
    return (
        <div>
            <ul>
                <li>
                    <TaskRow task={tasks[0]}/>
                </li>
                <li>
                    <TaskRow task={tasks[1]}/>
                </li>
            </ul>
        </div>
    );
}

const TaskRow = ({task}: { task: string }) => {
    return (
        <>
            <p>{task}</p>
            <button>Delete</button>
        </>
    );
}
