document.getElementById('button_regist').addEventListener('click', e => {
    document.querySelectorAll('.errors').forEach(element => element.classList.add('hide'))
    document.querySelectorAll('.pole').forEach(element => element.classList.remove('error-class'))

    let requestBody = {
        "firstName": document.getElementById('type_name').value,
        "lastName": document.getElementById('type_surname').value,
        "email": document.getElementById('type_email').value,
        "password": document.getElementById('type_password').value
    }
    console.log(requestBody);
    const url = 'http://localhost:8080/auth/signup';

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody)
    }).then(async response => {
        if (response.ok) {
            Switch_login_regist("login");
        } else if (response.status == 400) {
            let data = await response.json()
            let fields = Object.keys(data)
            let errors = Object.values(data)
            for (let i = 0; i < fields.length; i++) {
                let errorEl = document.getElementById(`${fields[i]}-err1`)
                errorEl.textContent = errors[i]
                errorEl.style.color = "black"
            }
        } else if (response.status == 406) {
            let data = await response.json()
            let errorEl = document.getElementById(`${Object.keys(data)[0]}-err1`)
            errorEl.textContent = Object.values(data)[0];
            errorEl.classList.remove('hide')
            document.getElementById(`${Object.keys(data)[0]}`).classList.add('error-class')
        }
    })
})