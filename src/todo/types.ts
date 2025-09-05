export type Task = {
    id: string;
    text: string;
    isDone: boolean;
}

export type Filter = "all" | "active" | "done";
