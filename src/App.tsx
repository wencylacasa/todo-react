import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import TodoFormModal from "./components/TodoFormModal";
import axios from "axios";
import moment from 'moment'

export type Todo = {
  id: number
  text: string
  completed: boolean
  created_at: string
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>()
  const [formModalVisible, setFormModalVisible] = useState(false)
  const [currentTodo, setCurrentTodo] = useState<Todo|undefined>(undefined)
  const [refresh, setRefresh] = useState(false)

  const fetchTodos = async () => {
    const res = await axios.get('http://localhost:3000/todos')

    setTodos(res.data.todos)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  useEffect(() => {
    if (refresh) {
      fetchTodos()
      setRefresh(false)
    }
  }, [refresh])

  const openTodoModal = (todo?: Todo) => {
    setCurrentTodo(todo)
    setFormModalVisible(true)
  }

  const CompletedColumn = (todo: Todo) => {
    const text = todo.completed ? 'Completed' : 'Not Completed'

    return (
      <p className="text-center">{text}</p>
    )
  }

  const ActionColumn = (todo: Todo) => {
    return (
      <div className="flex gap-2 items-center">
        <Button label="Edit" onClick={() => openTodoModal(todo)} />
        <Button label="Delete" severity="danger" onClick={() => deleteTodo(todo.id)} />
      </div>
    )
  }

  const DateCreatedColumn = (todo: Todo) => {
    return (
      <p className="text-center">{moment(todo.created_at).fromNow()}</p>
    )
  }

  const deleteTodo = async (id: Todo['id']) => {
    await axios.delete(`http://localhost:3000/todos/${id}`)

    await fetchTodos()
    setCurrentTodo(undefined)
  }

  return (
    <div className="bg-slate-900 w-screen h-screen grid place-items-center text-slate-50">
      <div className="border-4 rounded-xl w-3/4 p-8">
        <h1 className="text-4xl font-bold text-center">Todo List</h1>

        <div className="flex justify-end">
          <Button label='Add Todo' severity="success" onClick={() => openTodoModal()} />
        </div>

        <div className="mt-8">
          <DataTable value={todos}>
            <Column field='id' header='ID' />
            <Column field='text' header='Todo' />
            <Column field='completed' body={CompletedColumn} header='Status' />
            <Column field='created_at' header="Date Created" body={DateCreatedColumn} />
            <Column header='Action' body={ActionColumn} />
          </DataTable>
        </div>
      </div>

      <TodoFormModal todo={currentTodo} visible={formModalVisible} setVisible={setFormModalVisible} setRefresh={setRefresh} />
    </div>
  )
}