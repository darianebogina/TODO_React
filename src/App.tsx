import {useState, useEffect, useLayoutEffect, useRef} from 'react'
import './App.css'

type Task = {
    id: string;
    text: string;
}

export function App() {

    const [tasks, setTasks] = useState<Array<Task>>([]);
    const [loading, setLoading] = useState(true);
    const deleteUsed = useRef(false);

    const broadcast = useRef(new BroadcastChannel("test_channel"));
    const addTask = (newText: string) => {
        if (newText.trim() === "") {
            alert("Please enter a new task");
            return;
        }
        const id: string = Math.floor(Math.random() * 1000).toString();
        const newTask = {id, text: newText};
        setTasks(prev => [newTask, ...prev]);
        broadcast.current.postMessage("Update tasks");
    }

    const deleteTask = (idToDelete: string) => {
        deleteUsed.current = true;
        setTasks(prev => prev.filter((task: Task) => task.id !== idToDelete));
        broadcast.current.postMessage("Update tasks");
    };

    // Week 3: day 1
    useEffect(() => {
        if ((deleteUsed.current && tasks.length === 0) || tasks.length !== 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    const updateTasksFromLS = () => {
        const tasksString = localStorage.getItem('tasks');

        if (tasksString) {
            setTasks(JSON.parse(tasksString));
        }
    }

    useEffect(() => {
        console.log("useEffect (Parent)")
        updateTasksFromLS();

        // window.onstorage = () => {
        //     updateTasksFromLS();
        // };

        broadcast.current.addEventListener("message", () => {
            updateTasksFromLS();
        });
        return () => broadcast.current.close();
    }, []);

    useLayoutEffect(() => {
        console.log("useLayoutEffect (Parent)");
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500)

        return () => {
            console.log("useLayoutEffect (Clean-Up Parent)");
            clearTimeout(timer);
        }
    }, [])

    //
    return (
        <>
            <NewTaskForm onAdd={addTask}/>
            {loading ? <p> Loading...</p> : <TasksList taskList={tasks} deleteTask={deleteTask}/>}
        </>
    )
}

const NewTaskForm = ({onAdd}: { onAdd: (newText: string) => void }) => {
    const [newText, setNewText] = useState<string>("");
    useEffect(() => {
        console.log("useEffect (Child)");
        return () => {
            console.log("useEffect (Clean-Up Child)");
        }
    }, []);

    useLayoutEffect(() => {
        console.log("useLayoutEffect (Child)");
        return () => {
            console.log("useLayoutEffect (Clean-Up Child)");
        }
    }, []);

    return (
        <div>
            <h1>ToDo List</h1>
            <div>
                <input type="text" placeholder="Add task" value={newText} onChange={(e) => setNewText(e.target.value)}/>
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
        <li>
            <p>{task.text}</p>
            <button className="delete-btn" onClick={() => onDelete(task.id)}>&#10060;</button>
        </li>
    );
}