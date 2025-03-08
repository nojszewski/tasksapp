async function getData() {
    const response = await fetch(`http://localhost:3000/tasks/${user}`)
    const data = await response.json()
    return data
}

getData().then(data => {
    const table = document.querySelector('#table')
    const row = table.insertRow(0)
    const th1 = row.insertCell(0)
    const th2 = row.insertCell(1)
    const th3 = row.insertCell(2)

    th1.textContent = 'Zadanie'
    th2.textContent = 'Termin'
    th3.textContent = 'Akcje'

    if (data.length === 0) {
        const row = table.insertRow()
        const cell1 = row.insertCell(0)
        cell1.colSpan = 3
        cell1.textContent = 'Wszystkie zadania zostały zrobione! 😉'
        cell1.style.textAlign = 'center'
    }

    data.forEach(task => {
        const row = table.insertRow()
        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)

        cell1.style.width = '40%'
        cell2.style.width = '10%'
        cell3.style.width = '10%'

        const today = new Date()
        const deadlineDate = new Date(task.deadline)
        const timeDiff = deadlineDate - today
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

        if (daysDiff < 3) {
            cell1.classList.add('deadline')
            cell2.classList.add('deadline')
        }

        cell1.textContent = task.name
        cell2.textContent = task.deadline

        const editIcon = '<i class="fa-regular fa-pen-to-square icon"></i>'
        const deleteIcon = '<i class="fa-solid fa-trash icon"></i>'

        cell3.innerHTML = `<a href="#" id="edit">${editIcon}</a><a href="#" id="delete">${deleteIcon}</a>`

        row.appendChild(cell1)
        row.appendChild(cell2)
        row.appendChild(cell3)

        const id = task.id
        const editBtn = document.querySelector('#edit')
        const deleteBtn = document.querySelector('#delete')

        editBtn.addEventListener('click', async () => {
            const newName = prompt('Podaj nową nazwę zadania', task.name)
            const newDeadline = prompt('Podaj nowy termin zadania', task.deadline)

            if (newName && newDeadline) {
                const req = await fetch(`http://localhost:3000/edit-task/${id}/${newName}/${newDeadline}`)
                location.reload()
            } else {
                alert('Wypełnij wszystkie pola')
            }
        })

        deleteBtn.addEventListener('click', async () => {
            if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
                const req = await fetch(`http://localhost:3000/delete-task/${id}`)
                location.reload()
            }
        })
    })
})

document.querySelector('#changeTheme').addEventListener('click', () => {
    const theme = document.querySelector('#theme')

    if (theme.href.includes('light.css')) {
        theme.href = 'dark.css'
        localStorage.setItem('theme', 'dark.css')
    } else {
        theme.href = 'light.css'
        localStorage.setItem('theme', 'light.css')
    }
})

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme')
    const theme = document.querySelector('#theme')
    if (savedTheme) {
        theme.href = savedTheme
    } else {
        theme.href = 'light.css'
    }
})

document.querySelector('#addNewTask').addEventListener('click', async () => {
    const name = document.querySelector('#name').value
    const deadline = document.querySelector('#deadline').value

    if (name && deadline) {
        const req = await fetch(`http://localhost:3000/add-task/${name}/${deadline}/${user}`)
        location.reload()
    } else {
        alert('Wypłenij wszystkie pola')
    }
})