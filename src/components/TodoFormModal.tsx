import { Dialog } from 'primereact/dialog'
import type { Todo } from '../App'
import { InputText } from 'primereact/inputtext'
import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios'

type TodoFormModalType = {
    todo?: Todo
    visible: boolean
    setVisible: (visible: boolean) => void
    setRefresh: (refresh: boolean) => void
}

export default function TodoFormModal({ todo, visible, setVisible, setRefresh }: TodoFormModalType) {
    const [todoText, setTodoText] = useState<string>()
    const [todoCompleted, setTodoCompleted] = useState<boolean>(false)

    useEffect(() => {        
        setTodoText(todo?.text)
        setTodoCompleted(!!todo?.completed)
    }, [todo])

    const hideModal = () => {
        setRefresh(true)
        setVisible(false)
    }

    const submit = async () => {
        await axios.post('http://localhost:3000/todos', {
            id: todo?.id,
            text: todoText,
            completed: todoCompleted ? 1 : 0,
        })

        hideModal()
    }

    return (
        <Dialog header='Todo Form' visible={visible} onHide={() => hideModal()}>
            <div className='flex flex-col gap-4 mt-4'>
                <InputText placeholder="Todo" value={todoText} onChange={(e) => setTodoText(e.target.value)} />
                <div>Completed: <Checkbox checked={todoCompleted} onChange={() => setTodoCompleted(!todoCompleted)}></Checkbox></div>
                <Button label="Submit" onClick={() => submit()} />
            </div>
        </Dialog>
    )
}