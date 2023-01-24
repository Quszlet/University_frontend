function send_news() {
    const upload_info_url = 'http://localhost:8888/news/send'
    let file = document.getElementById('inputGroupFile02').files[0];
    let formData = new FormData()
    formData.append('title', document.getElementById('title').value)
    formData.append('text', document.getElementById('text').value)
    if (file === undefined){
        file = new File([""], "")
    }
    formData.append('image', file)
    update_error_span()
    fetch(upload_info_url, {
        method: 'POST',
        body: formData,
        headers: {'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
    }).then(async response => {
        if (response.ok) {
            alert("Новость отправлена")  
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
    
}  

function update_error_span(){
    for (let i = 0; i <  document.getElementsByName("error_span").length; i++) {
        document.getElementsByName("error_span")[i].innerHTML = ""
        document.getElementsByName("error_span")[i].style.color = "white"
    }   
}
