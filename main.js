let green = "#50C878"
let red = "#fe1a1a"
let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
function checkdarkmode (){

    if (isDarkMode == false){
    
        document.getElementById("all").style.backgroundColor = "gainsboro"
        document.getElementById("body").style.backgroundColor = "gainsboro"
        document.getElementById("nav").style.backgroundColor = "white"
        document.getElementById("darkandlight").innerHTML = `<i class="fa-solid fa-moon"></i>`

        isDarkMode = true
    }else{
        document.getElementById("all").style.backgroundColor = "#1B1B1B"
        document.getElementById("body").style.backgroundColor = "#1B1B1B"
        document.getElementById("nav").style.backgroundColor = "#00B8D4"
        document.getElementById("darkandlight").innerHTML = `<i class="fa-solid fa-sun"></i>`
        isDarkMode = false
    
    }
}

checkdarkmode()

document.getElementById("darkandlight").addEventListener("click", checkdarkmode)

function gohome(){
    window.location = "index.html"
}

function gotoprofileuser(userid){
    window.location = "userpage.html?userid="+userid
}

function visibleloader(){
    document.getElementById("loader").style.visibility = "visible"
}

function unvisibleloader(){
    document.getElementById("loader").style.visibility = "hidden"
}

function imagecheck1(){
    const data = JSON.parse(localStorage.getItem("user"))
    if(typeof data.profile_image == "object"){
        let x = `
        <div class="centering">
            <i class="fa-solid fa-user photouser"></i>
        </div>
        ` 
        return x
    }
    else
    {
        return ` <img class="navimage" src="${data.profile_image}"> `
    }
}



function checkcomment(){
    const comment = document.querySelector(".addnewcomment")
    if(comment != null && localStorage.getItem("token") != null){
        comment.innerHTML =
        `
            <input type="text" id="inputcomment">
            <button id="newcomment">add comment</button>
        `
    }else if (comment != null && localStorage.getItem("token") == null){
        comment.innerHTML = ""
    }
}

function closecard() {

    document.getElementById("content").remove()
    document.getElementById("black").remove()
}

function showthelogincard(){

    let loginbutton = `
    <div class="black" id="black"></div>
    <div class="containeroflogin" id="content">
        <div class="loginandx">
            <h3 class="login">login</h3>
            <i class="fa-solid fa-xmark" onclick="closecard()"></i>
        </div>

        <hr class="hrname">

        <div class="nameoflogin">
            <div class="a">
                <p>@</p>
            </div>
            <input id="username" type="text" class="login-name" placeholder="enter your name">
        </div>

        <input id="password" type="password" class="login-password" placeholder="enter your password">

        <hr class="hrbutton">

        <div class="buttonoflogin">
            <button class="cancle" onclick="closecard()">cancle</button>
            <button class="loginbutton" id="loginbutton" onclick="loginuser()">login</button>
        </div>
    </div> 
    `
    document.querySelector(".all").innerHTML += loginbutton
}

function showtheregistercard(){

    let regiseterbutton = `
    <div class="black" id="black"></div>
    <div class="containerofregister" id="content">
        <div class="registerandx">
            <h3 class="login">register</h3>
            <i class="fa-solid fa-xmark" onclick="closecard()"></i>
        </div>

        <hr class="hrimage">

        <div>
            <h4 class="h4ofprofileimage">profile image</h4>
            <div class="inputofprofil">
                <input id="image" class="inputofprofile" type="file">
            </div>
        </div>

        <input id="nameofregister" type="text" class="nameofregister nameregister" placeholder="enter your name">

        <input id="emailofregister" type="email" class="nameofregister" placeholder="enter your email">

        <div class="usernameofregister">
            <div class="a">
                <p>@</p>
            </div>
            <input id="username" type="text" class="register-name" placeholder="enter your username">
        </div>

        <input id = "password" type="password" class="register-password" placeholder="enter your password">

        <hr class="hrbutton">

        <div class="buttonoflogin">
            <button class="cancle" onclick="closecard()">cancle</button>
            <button class="register" onclick="registernewuser()">register</button>
        </div>

    </div> 
    `
    
    document.querySelector(".all").innerHTML += regiseterbutton
}

function notivaction(text , color) {

    document.getElementById("all").innerHTML += `
    <div id="notivecation" style="background-color: ${color};">${text}</div>
    `

    setTimeout(() => {
        document.getElementById("notivecation").remove()
    }, 7000);
}

function loginuser(){

    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    visibleloader()

    axios.post('https://tarmeezacademy.com/api/v1/login', {

        "username" : username,
        "password" : password
      })
      .then(function (response) {

        unvisibleloader()

        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))

        
        let user = `
        <div class="navbuttonstologout">
            ${imagecheck1()}
            <h3 class="navname circle">${response.data.user.name}</h3>
            <button class="logout" onclick="logoutuser()">logout</button>
        </div>
        `

        document.querySelector(".navbuttons").innerHTML = user

        if (document.querySelector(".detailusercard") != null) {
            location.reload()
        }

        notivaction("you login successfully",green)
        closecard()
        checkuser()

        if(document.querySelector(".allcontent1") != null){
            location.reload()
        }
      })
      .catch(function (error) {
        unvisibleloader()
        notivaction(error , red)
      });
}

function getpostsafterchange(page = 1){

    visibleloader()
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=10&page=${page}`)

    .then(function (response) {

        console.log(response)
        
        let detail = response.data.data

        if(page == 1 ){
            document.querySelector(".allcontent").innerHTML = ""
        }
        unvisibleloader()
        for(info of detail){

            function imagecheck (){
                if(typeof info.author.profile_image == "object"){
                    return  '<i class="fa-solid fa-user photouser"></i>'
                }
                else
                {
                    return ` <img class="personalimage" src="${info.author.profile_image }" > `
                }
            }

            
            function checkbtneditanddelete(){
                if (JSON.parse(localStorage.getItem("user")) != null) {
    
                    if (info.author.id == JSON.parse(localStorage.getItem("user")).id) {
                        const x = 
                        `<button id="editbtn" onclick="showeditcard('${encodeURIComponent(JSON.stringify(info))}',${info.id})">edit</button>
                        <button id="deletebtn" onclick="showdeletcard(${info.id})">delete</button> `
                        
                        return x
    
                    }else{
                        const x = ""
                        return x
                    }
                }else{
                    return ""
                }
            }
            var y
            y +=

            `
            <div class="content" >
                <div class="imgofuser">
                    <div style="display: flex; align-items: center;" onclick = "gotoprofileuser(${info.author.id})">
                        <div class="centering" id="${info.author.id}" >
                            ${imagecheck()}
                        </div>
                        <p id="name" class="name">${info.author.username}</p>
                    </div>
                    <div id="btndeleteandedit" style="margin-left: auto;">
                        ${checkbtneditanddelete()}
                    </div>
                </div>
                
                <div onclick="gotopostuser(${info.id})">
                    <img id="photo" class="photo" src="
                    ${(typeof info.image == "object") ? 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIYAhgMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAwQFAQIHBv/EADcQAAEDAgIGCAYBBAMAAAAAAAEAAgMEEQUSITE0QVGSExQVU2GBkbEiUnFyc8FCYoLR4SMkMv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7iiIgIi8yPbG0ueQGjWSg9IqHa9Lxef7Vztel4v5UGgiz+16Xi/lTtel4v5UGgiz+16Xi/lTtel4v5UGgiz+16Xi/lTtel4v5UGgipRYnTSvDQ4tJ1ZhZXUBERAREQEREBZ+Nk9TAG94utBZ+N7I38g/aC6yNjWBrWgACw0LuRvyj0XRqXUHnI35R6Jkb8o9F6RB5yN+UeiZG/KPRekQecjflHomRvyj0XpEFHF42Ghecou21jbVpVmmJdTxE6yweygxbYJfL3CmpNlh+weyCZERAREQEREBZ+N7I38g/a0Fn43sjfyD9oL41Lq4NS6gXRZmNMldGzIHGMXzAKTB2ytpbTAgZvhDtdkF9ERAREQU8W2CXy9wpqTZYfsHsocW2CXy9wpqTZYfsHsgmREQEREBERAWfjeyN/IP2tBZ+N7I38g/aC+NS6uDUuoCIiAio1+ItpiGsGeThwXqhr2VV2uGSQfxvr+iC4iIgp4tsEvl7hTUmyw/YPZQ4tsEvl7hTUmyw/YPZBMiIgIiICIiAs/G9kb+QftaCz8b2Rv5B+0F8al1cGpZmKTzuvBBHJl/k4NOnwQearFiybLAGua3WTv8AopK3EhHEGxAiV4vY/wAPqs5lPLE0SGB7nnS1uUm3if8ACiMFQTd0MpJ1ksKCMkuJJJJOsnejXOY4OaSHDSCFJ1efuJeQp1efuJeQoNrDq8VIyPsJQNI4+IV5fl2w1LHBzYpQ4G4IYVu0FRJNHaaNzJG67tIBQcxbYJfL3CmpNlh+weyhxbYJfL3CmpNlh+weyCZERAREQEREBUcZY59HdoJyuBNuCvLhtvQVGYlSFgJlAuNRBXrtGk75voVIaSmJuYYyftC51Sm7iPlCDx2hSd830Kdo0nfN9CvfVKbuI+UJ1Sm7iPlCDx2jSd830Kdo0nfN9CvfVKbuI+UJ1Sm7iPlCDx2jSd830Kdo0nfN9CvfVKbuI+UJ1Sm7iPlCCliVbBNSuiifne8gAAHitCBpZDG12sNAPouR08EZzRxMaeIapUBERAREQEREBUcXDjDE1rrF0oF7q8o5oWTBokF8rg4fUIM6mnfLXxCS7ZGRua8eK8wQtqoJp53v6UOOnNbJZaPV4usdPltJa1wopKCnkeXOaQSbkBxAP1CDuHyOlo4nvvmI0nis67nYOPiNzLbX4rZa1rGhrRZoFgBuUAo4RCIcpyB2a196DJ6aSWSmBJHRFrHad9/9Kxis2acRdJkEbc9/6twV7qUFy7Ibl+c6d6kZDGyR7wPikN3E70FGpqDPS02Vxa2Zwa8jdxXYmxwYg1jGzRhwIs43a/x1q0KODoTCWXjJJsTvXIaOCF+dgcXDUXOJsgzYonSzTk07pbSuGbpctltNFmgDUAqrsPp3Pc4h4Ljc2eQrTRZoA1AIOoiICIiAiIgKGrmEFO+Q7ho+u5TKOeFk7Q2S9g4O9EGRRu6Rk1L0pcZGZwbnQ7eFLFOap9K0uI6MF8unho0rRfTxvlZIR8TL5SNC8NooW9NlBHTaHWKDMpqv/uiYyaJXFpbf/wAjck7nZarSdpbbStR9JC+AQlvwC1rawvL6GB7ZGuBtI7M7TvQdrpur0skl9NrN+qz6KbLFUQiXP/x52nxtpV0YfACCTIbEEBzyQpZKWKSRr3N+IAjRwKDIgzMFLLlkjBcLyF9w7wsr+GknrNyTaZ2te2YdTtLTZ7spuA55IHkjsPgL3OvIC43NnkIKAjdLUVN4JJrSEXbLlt4LZaLNA4BVXYfCXufeQFxucryNKtMaGtDRewFtKDqIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIg//9k='
                        : info.image }" >

                    <div class="timeanddes">
                        <p id="time" class="time">${info.created_at}</p>
                        <h5 class="title">${(info.title == undefined ) ? "" : info.title }</h5>
                        <h4 id="title" class="des">${(info.body == undefined ) ? "" : info.body }</h4>
                    </div>

                    <hr>

                    <div class="tagsandcommands">
                        <i class="fa-solid fa-pen pen"></i>

                        <div class="numofcommands">
                            <p class="numberofcommand">( ${info.comments_count} )</p>
                            <h4>commants</h4>
                        </div>

                        <div class="tags">
                            <div class="tag" >${(info.tages == undefined ) ? "no tags" : info.tages }</div>
                        </div>
                    </div>
                </div>
            </div>
            `
            
        }
        
        document.querySelector(".allcontent").innerHTML = y 
        
    })
    .catch(function (error) {
        console.log(error)

        unvisibleloader()
        notivaction(error.response.data.message , red)
        
    });
}


function checkuser(){

    if(localStorage.getItem("token") == null){
        
        const notlogin = 
        `
        <button id="login" class="navbutton" onclick="showthelogincard()">login</button>
        <button id="register" class="navbutton" onclick="showtheregistercard()">register</button>
        `

        document.querySelector(".navbuttons").innerHTML = notlogin

        if (document.getElementById("createpostbutton") != null) {
            document.getElementById("createpostbutton").style.display = "none"   
        }

        if (document.querySelector(".addnewcomment") != null) {
            this.innerHTML += ""
        }

        if (document.getElementById("createpostbutton") != null) {
            getpostsafterchange()   
        }

        if (document.querySelector(".detailusercard") != null) {
            checkuserpage()
        }
        
        

        checkcomment()
        
    }
    else
    {
        const data = JSON.parse(localStorage.getItem("user"))

        document.querySelector(".navbuttons").innerHTML = `
        <div class="navbuttonstologout">
            ${imagecheck1()}
            <h3 class="navname circle">${data.username}</h3>
            <button class="logout" onclick="logoutuser()">logout</button>
        </div>
        
        `
        
        if (document.getElementById("createpostbutton") != null) {
            document.getElementById("createpostbutton").style.display = "flex"   
           }
    
        if (document.getElementById("createpostbutton") != null) {
            getpostsafterchange()   
        }

        if (document.querySelector(".detailusercard") != null) {
            checkuserpage()
        }

        checkcomment()

    }
}

checkuser()

function registernewuser(){

    let name = document.getElementById("nameofregister").value
    let username = document.getElementById("username").value
    let email = document.getElementById("emailofregister").value
    let password = document.getElementById("password").value
    let image = document.getElementById("image").files[0]
    
    let headers = {
        "Accept" : "application/json"
    }

    let formData = new FormData(); 
    
    formData.append('name', name);
    
    formData.append('username', username);
    
    formData.append('password', password);

    formData.append('email', email);
    
    if(image != undefined){
        formData.append('image', image);
    }

    visibleloader()

    axios.post('https://tarmeezacademy.com/api/v1/register', formData , headers)

      .then(function (response) {

        unvisibleloader()
        
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))

        if (document.querySelector(".detailusercard") != null) {
            location.reload()
        }
        
        notivaction("you login successfully",green)
        closecard()
        checkuser()
        
      })
      .catch(function (error) {
        unvisibleloader()
        notivaction(error.response.data.message , red)
      });
}

function logoutuser(){

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    if (document.querySelector(".allcontent") != null) {
        this.innerHTML = ""
    }

    if (document.querySelector(".detailusercard") != null) {
        location.reload()
    }

    notivaction("you logout successfully",green)
    checkuser()
    
    if(document.querySelector(".allcontent1") != null){
        location.reload()
    }
}

function checkforaddcomment(){
    if(localStorage.getItem("token") == null){
        const x = ""
        return  x

    }else{

        const x = 
        
        `
        <div class="addnewcomment">
            <input type="text" id="inputcomment" placeholder="make a new commnet">
            <button id="newcomment" onclick="createnewcomment()">add comment</button>
        </div> `

        return x
        
    }
}

const btntop = document.getElementById("btntop")

if ( btntop != null ) {
    btntop.addEventListener("click", e => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
    });

    window.addEventListener('scroll', e => {
        btntop.style.display = window.scrollY > 100 ? 'flex' : 'none';
    })
}

function gotoprofile(){
    window.location = "userpage.html"
}

function editpost(idpost){

    let config = {
        headers : {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }

    
    let title = document.getElementById("titlepost").value
    let body = document.getElementById("bodypost").value
    let image = document.getElementById("imageofpost").files[0]

    let formData = new FormData(); 

    formData.append('title', title);

    formData.append('body', body);

    if(image != undefined){
        formData.append('image', image);
    }

    formData.append("_method","put")

    visibleloader()
   
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${idpost}`

    ,formData, config)

    .then(function () {
        unvisibleloader()
        notivaction("you edit the post successfully" , green)
        closecard()
        checkuser()
        if(document.querySelector(".allcontent1") != null){
            location.reload()
        }
    })
    .catch(function (error) {
        unvisibleloader()
        notivaction(error.response.data.message , red)
    });
}

function showeditcard(infopost , idpost ){

    const data = JSON.parse(decodeURIComponent(infopost))

    let editbutton = `

    <div class="black" id="black"></div>
    <div class="containerofpost" id="content">
    <div class="postandx">
        <h3 class="post"> edit your post</h3>
        <i class="fa-solid fa-xmark" onclick="closecard()"></i>
    </div>

    <hr class="hrimage">

    <div>
        <h4 class="h4ofprofileimage">image of post</h4>
        <div class="imageofpost">
            <input id="imageofpost" class="inputofprofile" type="file">
        </div>
    </div>

    <input id="titlepost" type="text" class="titleofpost" placeholder="title of post" value = "${data.title}">

    <input id="bodypost" type="text" class="bodyofpost" placeholder="body of post" value = "${data.body}"'>

    <hr class="hrbutton">

    <div class="buttonoflogin">
        <button class="cancle" onclick="closecard()">cancle</button>
        <button class="register" onclick="editpost(${idpost})">edit</button>
    </div> 
    `
    
    document.querySelector(".all").innerHTML += editbutton
    
    
}

function showdeletcard(idpost){

    let content = `
        <div class="black" id="black"></div>
        <div class="containerofpost" id="content">
        <div class="postandx">
            <h3 class="post" style="font-size: 16px; margin : 0 auto 10px auto"> are you sure to delete this post</h3>
            <i class="fa-solid fa-xmark" onclick="closecard()" style="    position: absolute; top: 8px ; right: 10px;"></i>
        </div>

        <div class="buttonoflogin" style="justify-content: center;">
            <button class="cancle" onclick="closecard()">cancle</button>
            <button class="register" onclick="deletepost(${idpost})">delete</button>
        </div>
    `

    
    document.querySelector(".all").innerHTML += content
}

function deletepost(idpost){

    let config = {
        headers : {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Accept":"application/json"
        }
    }
   
    visibleloader()

    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${idpost}`, config) 

    .then(function () {
        unvisibleloader()
        notivaction("you delete the post successfully" , green)
        closecard()
        checkuser()
        if(document.querySelector(".allcontent1") != null){
            window.location = "index.html"
        }
        
    })
    .catch(function (error) {
        unvisibleloader()
        notivaction(error.response.data.message , red)
    });
}

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("nav").style.top = "0";
  } else {
    document.getElementById("nav").style.top = "-50px";
  }
  prevScrollpos = currentScrollPos;
}