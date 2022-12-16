document.addEventListener('DOMContentLoaded', () => {
    const avatar_url = 'http://localhost:8080/avatar/get'
    const data_url = 'http://localhost:8080/auth/profile'

    reloadAvatar(avatar_url)

    let userAuthorities
    fetch(data_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            document.getElementById('first-name').textContent = data.firstName
            document.getElementById('last-name').textContent = data.lastName
            document.getElementById('session-count').textContent = data.loginsCount
            document.getElementById('date-and-time').textContent = data.dateAndTime
            userAuthorities = data.role
            let role = document.getElementById('role')
            let additionalContent
            switch (userAuthorities) {
                case ('[ROLE_USER]'):
                    role.textContent = '(Пользователь)'
                    role.style.color = '#080707'
                    additionalContent = `
                    <tr>
                         <td><button  type="button" class="normal-button" id="user-button" onclick="pageRedict('form-page')">Оставить заявку</button></td>
                    </tr>`
                    document.getElementById('table_button').innerHTML += additionalContent
                    break
                case ('[ROLE_MODERATOR]'):
                    role.textContent = '(Модератор)'
                    role.style.color = '#3cc74a'
                    additionalContent = `
                    <tr>
                         <td><button  type="button" class="normal-button" id="user-button" onclick="pageRedict('form-page')">Оставить заявку</button></td>
                    </tr>
                    <tr>
                        <td><button class="normal-button" id="mod-button">Управление новостями</button></td>
                    </tr>`
                    document.getElementById('table_button').innerHTML += additionalContent
                    break
                case ('[ROLE_ADMIN]'):
                    role.textContent = '(Администратор)'
                    role.style.color = '#e00d23'
                    additionalContent = `
                        <tr>
                            <td><button type="button" class="normal-button" id="user-button" onclick="pageRedict('form-page')">Оставить заявку</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="normal-button" id="mod-button" onclick="pageRedict('mod-page')">Просмотр заявок</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="normal-button" id="mod-button">Управление новостями</button></td>
                        </tr>
                        <tr>
                            <td><button type="button" class="normal-button" id="admin-button" onclick="pageRedict('admin-page')">Управление пользователями</button></td>
                        </tr>`
                    document.getElementById('table_button').innerHTML += additionalContent
                    break
                default:
                    break
            }
        }
    })
})

function exit() {
    const logout_url = 'http://localhost:8080/auth/profile'
    fetch(logout_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(response => {
        if (response.ok) {
            document.location.replace('../index.html')
        }
    })
}

function send_photo() {
    const upload_avatar_url = 'http://localhost:8080/avatar/send'
    let image = document.getElementById('photo').files[0]
    let formData = new FormData()
    formData.append('image', image)
    fetch(upload_avatar_url, {
        method: 'PUT',
        body: formData,
        headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
    }).then(async response => {
        if (response.ok) {
            const avatar_url = 'http://localhost:8080/avatar/get'
            reloadAvatar(avatar_url)
        } else if (response.status == 406) {
            let data = await response.json()
            let element = document.getElementById('avatar-err')
            element.classList.remove('hide')
            element.textContent = data.message
        } else if (response.status == 417) {
            let data = await response.json()
            let element = document.getElementById('avatar-err')
            element.classList.remove('hide')
            element.textContent = data.message
        }
    })
}

function reloadAvatar(url) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(async response => {
        if (response.ok) {
            let data = await response.json()
            document.getElementById('avatar').setAttribute('src', data.message.slice(data.message.indexOf("images") - 1))
        } else {
            let data = await response.json()
            document.getElementById('avatar-err').textContent = data.message;
        }
    })
}