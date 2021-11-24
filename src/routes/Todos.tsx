import React, { useEffect, useState } from "react";
import { setTitle } from '../utility/common';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { SET_TODOS } from "../redux/todos/todos.actions";

type TodoType = {
    id: number,
    userId: number,
    title: string,
    completed: boolean
}

type RootState = { // temp > normally needs to be in common area
    todos: TodosStateType
}

type TodosStateType = {
    inProgress: boolean,
    todos: TodoType[]
}

type TodosParamsType = {
    id: string
}

const Todos: React.FC = () => {
    // local state
    //const [todos, setTodos] = useState<TodoType[]>([]);
    const [inProgress, setInProgress] = useState<boolean>(false);

    // redux state
    const todos: TodoType[] = useSelector<RootState, TodoType[]>(state => state.todos.todos);
    const dispatch = useDispatch();

    const params = useParams<TodosParamsType>(); // accessing URL params
    const pageType: 'detail' | 'list' = params.id ? 'detail' : 'list';
    console.log(params, pageType);

    // todo detail object
    let todo: TodoType | undefined;
    if (pageType === 'detail') {
        todo = todos.find((value) => value.id === (parseInt(params.id) || -1));
        console.log("todo detail:", todo);
    }

    useEffect(() => { // component did mount equivalent
        console.log("use effect > set");
        setTitle("Todos");

        if (todos.length === 0) { // if we have data already in redux > don't call service again, use redux state
            setInProgress(true);
            fetch('https://jsonplaceholder.typicode.com/todos')
                .then(response => {
                    if (response.ok) return response.json();
                    return Promise.reject(response);
                })
                .then(json => { // success
                    //setTodos(json);
                    dispatch({ type: SET_TODOS, payload: { todos: json } })
                }).catch(function (error) { // failure
                    console.log(error);
                }).finally(function () { // always
                    console.log("request stopped (success or fail)");
                    setInProgress(false);
                });
        }
        return () => {
            console.log("use effect > unset");
            setTitle(null);
        }
        // eslint-disable-next-line
    }, [])

    return (
        <>
            {inProgress ? (
                <div>Getting todos from API...</div>
            ) : (
                <>
                    {pageType === 'list' && ( // mode => list
                        <>
                            <h2>Todos ({todos.length})</h2>

                            {todos.length > 0 ? (
                                <table style={{ width: '100%', borderSpacing: 3 }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left' }}>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>User</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {todos.map((todo) =>
                                            <tr key={todo.id} style={{ backgroundColor: (todo.completed ? '#beffbe' : '#ffd5c5') }}>
                                                <td>{todo.id}</td>
                                                <td>
                                                    <a href={"#/todo/" + todo.id} style={{ color: 'dodgerblue' }}>{todo.title}</a>
                                                </td>
                                                <td>{todo.userId}</td>
                                                <td style={{ color: (todo.completed ? 'green' : 'red') }}>{todo.completed ? 'COMPLETED' : 'ONGOING'}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : null}
                        </>
                    )}

                    {pageType === 'detail' && ( // mode => detail
                        <>
                            <h2>Todo #{todo?.id}</h2>

                            <code><pre>{JSON.stringify(todo, null, 2)}</pre></code>
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default Todos