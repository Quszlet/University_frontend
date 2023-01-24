function send_info() {
    const upload_info_url = 'http://localhost:8888/form/send'
    let file = document.getElementById('inputGroupFile02').files[0];
    let formData = new FormData()
    formData.append('first_name', document.getElementById('first_name').value)
    formData.append('last_name', document.getElementById('last_name').value)
    formData.append('email', document.getElementById('email').value)
    formData.append('full_text', document.getElementById('full_text').value)
    if (file === undefined){
        file = new File([""], "")
    }
    formData.append('file', file)
    update_error_span()
    fetch(upload_info_url, {
        method: 'POST',
        body: formData,
        headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
    }).then(async response => {
        if (response.ok) {
            alert("Форма отправлена")  
        } else if (response.status == 400) {
            let data = await response.json()
            let fields = Object.keys(data)
            let errors = Object.values(data)
            for (let i = 0; i < fields.length; i++) {
                document.getElementById(`${fields[i]}_err`).innerHTML = errors[i]
                document.getElementById(`${fields[i]}_err`).style.color = "red"
            }   
        }
    })
    
}  

function update_error_span(){
    for (let i = 0; i <  document.getElementsByName("error_span").length; i++) {
        document.getElementsByName("error_span")[i].innerHTML = ""
        document.getElementsByName("error_span")[i].style.color = "white"
    }   
}
