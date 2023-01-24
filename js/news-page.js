document.addEventListener('DOMContentLoaded', () => {
    create_news()
})

function create_news(){
    fetch("http://localhost:8888/news/get", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            for (let i = 0; i < data.length; i++){
                let userAuthorities = data[i].role
                let additionalContent
                switch (userAuthorities) {
                    case ('ROLE_USER'):
                        additionalContent = `
                        <div class="inside_flex" id="id-${data[i].id}">
                            <h1 class="title" id="title-${i}">${data[i].title}</h1>
                            <p class="paragraph" id="par-${i}">${data[i].text}</p>
                            <img alt="pibov" class="img" id="img-${i}" src="${data[i].image_path}">
                            <span class="time" id="time-${i}">Дата публикации: ${data[i].creation_data}</span>
                        </div>`
                        document.getElementById('div_flex_news').innerHTML += additionalContent
                        document.getElementById(`img-${i}`).setAttribute('src', data[i].image_path.slice(data[i].image_path.indexOf("images") - 1))
                        break
                    case ('ROLE_MODERATOR'):
                        path = data[i].image_path.slice(data[i].image_path.indexOf("images") - 1)
                        additionalContent = `
                        <div class="inside_flex" id="id-${data[i].id}">
                            <h1 class="title" id="title-${i}">${data[i].title}</h1>
                            <p class="paragraph" id="par-${i}">    ${data[i].text}</p>
                            <img alt="pibov" class="img" id="img-${i}">
                            <span class="time" id="time-${i}">Дата публикации: ${data[i].creation_data}</span>
                            <button id="button-${i}">Изменить</button>
                        </div>`
                        document.getElementById('div_flex_news').innerHTML += additionalContent
                        document.getElementById(`img-${i}`).setAttribute('src', data[i].image_path.slice(data[i].image_path.indexOf("images") - 1))
                        break
                    case ('ROLE_ADMIN'):
                        additionalContent = `
                        <div class="inside_flex" id="id-${data[i].id}">
                            <h1 class="title" id="title-${i}">${data[i].title}</h1>
                            <p class="paragraph" id="par-${i}">    ${data[i].text}</p>
                            <img alt="pibov" class="img" id="img-${i}">
                            <span class="time" id="time-${i}">Дата публикации: ${data[i].creation_data}</span>
                            <button id="button-${i}">Изменить</button>
                        </div>`
                        document.getElementById('div_flex_news').innerHTML += additionalContent
                        document.getElementById(`img-${i}`).setAttribute('src', data[i].image_path.slice(data[i].image_path.indexOf("images") - 1))
                        break
                    default:
                        break
                }
            }
            addEvents(data)
        }
    }) 
}



function addEvents(data){
    for(let i = 0; i < data.length; i++){
        document.getElementById(`button-${i}`).addEventListener('click', () => {
            document.getElementById(`id-${data[i].id}`).innerHTML = `
            <input class="title" id="title-${i}" value="${data[i].title}"></input>
            <span id="title_err" name="error_span"></span>
            <textarea class="paragraph" id="par-${i}">${data[i].text}</textarea>
            <span id="text_err" name="error_span"></span>
            <img alt="pibov" class="img" id="img-${i}">
            <input type="file" id="file-${i}">
            <span id="file_err" name="error_span"></span>
            <span class="time" id="time-${i}">Дата публикации: ${data[i].creation_data}</span>
            <button id="change-${i}">Подтвердить изменения</button>
            <button id="delete-${i}">Удалить новость</button>
            `
            document.getElementById(`img-${i}`).setAttribute('src', data[i].image_path.slice(data[i].image_path.indexOf("images") - 1))
            AddEventsSendUpdate(data, i)
        })   
    }
}


function AddEventsSendUpdate(data, i) {
    
    document.getElementById(`change-${i}`).addEventListener('click', () => {
        update_error_span()
        const upload_avatar_url = `http://localhost:8888/news/update/${data[i].id}`
        let image = document.getElementById(`file-${i}`).files[0]
        if (image === undefined){
            image = new File([""], "")
        }
        let formData = new FormData()
        formData.append(`title`, document.getElementById(`title-${i}`).value)
        formData.append(`text`, document.getElementById(`par-${i}`).value)
        formData.append('image', image)
        fetch(upload_avatar_url, {
            method: 'PUT',
            body: formData,
            headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
        }).then(async response => {
            if (response.ok) {
                alert("Новость обновлена")
                location.reload();
            } else if (response.status == 400) {
                let data = await response.json()
                let fields = Object.keys(data)
                let errors = Object.values(data)
                for (let i = 0; i < fields.length; i++) {
                    document.getElementById(`${fields[i]}_err`).innerHTML = errors[i]
                    document.getElementById(`${fields[i]}_err`).style.color = "red"
                }   
            } else if (response.status == 500){
                document.getElementById("file_err").innerHTML = "Формат файла не поддерживается"
                document.getElementById("file_err").style.color = "red"
            }
        })
    })

    document.getElementById(`delete-${i}`).addEventListener('click', () => {
        const upload_avatar_url = `http://localhost:8888/news/delete/${data[i].id}`
        fetch(upload_avatar_url, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
        }).then(async response => {
            if (response.ok) {
                alert("Новость удалена")
                location.reload();
            }    
        })
    })
    
}

function update_error_span(){
    for (let i = 0; i <  document.getElementsByName("error_span").length; i++) {
        document.getElementsByName("error_span")[i].innerHTML = ""
        document.getElementsByName("error_span")[i].style.color = "white"
    }   
}