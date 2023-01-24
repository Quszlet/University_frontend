document.addEventListener('DOMContentLoaded', () => {
    workloadTable('delete-buttons', 'change-buttons', 'download-buttons')
})

function CreateModTabel(Data){
    let caption_table = `
    <tr>
        <td>Id вопроса</td>
        <td>Имя пользователя</td>
        <td>Фамилия пользователя</td>
        <td>Email пользователя</td>
        <td>Сообщение</td>
        <td>Файл</td>
        <td></td>
    </tr>`
    for (let i = 0; i < Data.length; i++) {
        let additionalHtml = `
        <tr>
            <td>${Data[i].id}</td>
            <td><input class="table_input" id='table_firstName-${[i]}' value='${Data[i].first_name}'></td>
            <td><input class="table_input" id='table_lastName-${[i]}' value='${Data[i].last_name}'></td>
            <td><input class="table_input" id='table_email-${[i]}' value='${Data[i].email}'></td>
            <td><textarea class="table_input" id='table_full_text-${[i]}'>${Data[i].full_text}</textarea></td>
            <td><button id="download-${i}" class="download-buttons">Загрузить</button></td>
            <td><button id="change-${i}" class="change-buttons">Изменить</button></td>
            <td><button id="delete-${i}" class="delete-buttons">Удалить</button></td>
        </tr>`
        caption_table += additionalHtml
    }
    return caption_table
}

function workloadTable(...buttonTypes){
    const url_get_form = 'http://localhost:8888/form/get/all'
    fetch(url_get_form, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            document.getElementById("moder-table").innerHTML = CreateModTabel(data)
            for (let i = 0; i < buttonTypes.length; i++) {
                addEventsToButtonsMod(buttonTypes[i], data)
            }
        } else if (response.status == 403) {
            document.location.replace('../html/profile.html')
        }
    })
}

function addEventsToButtonsMod(buttonType, usersData) {
    switch (buttonType) {
        case 'delete-buttons':
            for (let i = 0; i < usersData.length; i++) {
                document.getElementById(`delete-${i}`).addEventListener('click', () => {
                    let delete_url = `http://localhost:8888/form/delete/${usersData[i].id}`
                    fetch(delete_url, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    }).then(async response => {
                        if (response.ok) {
                            let data = await response.json()
                            alert(`Пользователь с id=${data.message} был удален из базы данных`)
                           workloadTable('delete-buttons', 'change-buttons', 'download-buttons')
                        }
                    })
                })
            }
            break
            case 'change-buttons':
                for (let i = 0; i < usersData.length; i++) {
                    document.getElementById(`change-${i}`).addEventListener('click', () => {
                        let change_url = `http://localhost:8888/form/change/${usersData[i].id}`
                        let requestBody = {
                            "first_name": document.getElementById(`table_firstName-${[i]}`).value,
                            "last_name": document.getElementById(`table_lastName-${[i]}`).value,
                            "email": document.getElementById(`table_email-${[i]}`).value,
                            "full_text": document.getElementById(`table_full_text-${[i]}`).value
                        }
                        fetch(change_url, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                            },
                            body: JSON.stringify(requestBody)
                        }).then(async response => {
                            if (response.ok) {
                                let data = await response.json()
                                alert(`Данные пользователя с id = ${usersData[i]}  изменены!`)
                                workloadTable('delete-buttons', 'change-buttons', 'download-buttons')
                            }
                        })
                    })
                }
                break
                case 'download-buttons':
                    for (let i = 0; i < usersData.length; i++) {
                        document.getElementById(`download-${i}`).addEventListener('click', () => {
                            let download_url = `http://localhost:8888/form/get/${usersData[i].id}`
                            let type = ""
                            fetch(download_url, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                                },
                            }).then(async response => {
                                if (response.ok) {
                                        type = await response.json();
                                        
                                    }
                                })
                            let downdload_url = `http://localhost:8888/form/download/${usersData[i].id}`
                            fetch(downdload_url, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                                },
                            }).then(async response => {
                                if (response.ok) {
                                    let blob = await response.blob()
                                    if (blob.size == 0){
                                        alert("Прикрепленный файл отсутствует!")
                                    } else {
                                        let link = document.createElement('a');
                                        console.log(type)
                                        blob = blob.slice(0, blob.size, type.typeFile)
                                        link.download = "file"
                                        link.href = URL.createObjectURL(blob);

                                        link.click();
                                        
                                        URL.revokeObjectURL(link.href)        
                                    }
                                }
                                })
                            })
                            
                    }    
        default:
            break
    }
}