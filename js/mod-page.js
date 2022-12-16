document.addEventListener('DOMContentLoaded', () => {
    workloadTable()
})

function CreateModTabel(Data){
    let caption_table = `
    <tr>
        <td>Id вопроса</td>
        <td>Имя пользователя</td>
        <td>Фамилия пользователя</td>
        <td>Email пользователя</td>
        <td>Сообщение</td>
        <td>Файл 1</td>
        <td>Файл 2</td>
        <td></td>
    </tr>`
    for (let i = 0; i < Data.length; i++) {
        let additionalHtml = `
        <tr>
            <td>${Data[i].id}</td>
            <td><input class="table_input" id='table_firstName' value='${Data[i].first_name}'></td>
            <td><input class="table_input" id='table_lastName' value='${Data[i].last_name}'></td>
            <td><input class="table_input" id='table_email' value='${Data[i].email}'></td>
            <td><input class="table_input" id='table_full_text' value='${Data[i].full_text}'></td>
            <td>${Data[i].file_first_path}</td>
            <td>${Data[i].file_second_path}</td>
            <td><button id="delete-${i}" class="delete-buttons">Удалить</button></td>
        </tr>`
        caption_table += additionalHtml
    }
    return caption_table
}

function workloadTable(){
    const url_get_form = 'http://localhost:8080/form/get/all'
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
        } else if (response.status == 403) {
            document.location.replace('../html/profile.html')
        }
    })
}