import {useState, useEffect, useLayoutEffect,useRef} from 'react'
import './App.css'

type Task = {
    id: string;
    text: string;
}

export function App() {
    const [tasks, setTasks] = useState<Array<Task>>([]);
    const [loading, setLoading] = useState(true);
    const deleteUsed = useRef(false);

    const addTask = (newText: string) => {
        if (newText.trim() === "") {
            alert("Please enter a new task");
            return;
        }
        const id: string = Math.floor(Math.random() * 1000).toString();
        const newTask = {id, text: newText};
        setTasks(prev => [newTask, ...prev]);
    }

    const deleteTask = (idToDelete: string) => {
        deleteUsed.current = true;
        setTasks(prev => prev.filter((task: Task) => task.id !== idToDelete));
    }

    // Week 3: day 1
    useEffect(() => {
        // console.log("useEffect on tasks change")
        if ((deleteUsed.current && tasks.length === 0) || tasks.length !== 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    useEffect(() => {
        console.log("useEffect (Parent)")
        const tasksString = localStorage.getItem('tasks');
        if (tasksString) {
            setTasks(JSON.parse(tasksString));
        }

        return () => {
            console.log("useEffect (Clean-Up Parent)")
        }
    }, []);

    useLayoutEffect(() => {
        console.log("useLayoutEffect (Parent)");
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500)

        return () => {
            console.log("useLayoutEffect (Clean-Up Parent)");
            clearTimeout(timer);}
    }, [])

    //
    return (
        <>
            <NewTaskForm onAdd={addTask}/>
            {loading ? <p> Loading...</p> : <TasksList taskList={tasks} deleteTask={deleteTask} />}
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
