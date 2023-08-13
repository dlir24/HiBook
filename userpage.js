const userdata = JSON.parse(localStorage.getItem("user"))

const param = new URLSearchParams(document.location.search);
const userid = param.get("userid"); 

function visibleloader(){
    document.getElementById("loader").style.visibility = "visible"
}

function unvisibleloader(){
    document.getElementById("loader").style.visibility = "hidden"
}

function checkuserpage (){
    if ( userid != null ) {
        document.querySelector(".allcontent").innerHTML = ""
        fillinfoforuserownpost()
    }else if(
        userdata != null){
        document.querySelector(".allcontent").innerHTML = ""
        fillinfoforuser()
    }else{
        document.querySelector(".detailusercard").innerHTML = " you don't have an account"
        document.querySelector(".allcontent").innerHTML = ""
        unvisibleloader()
    }
}

checkuserpage()

function gotopostuser(id){
    window.location = "postuser.html?id=" + id
}

function fillinfoforuser(){

    function imagecheck(){

        visibleloader()

        if(typeof userdata.profile_image == "object"){
            let x = `
                <div class="centering1" >
                    <i class="fa-solid fa-user photouser1"></i>
                </div>
            ` 
            return x
        }
        else
        {
            return ` <img class="imageuser" src="${userdata.profile_image}"> `
        }
    }

    document.querySelector(".detailusercard").innerHTML = `
    <div class="centering1" >
        ${imagecheck()}
    </div>

    <div class="names">
        <p class="name" id="name">${userdata.name == null ? "no name" : userdata.name}</p>
        <p class="username" id="username">${userdata.username}</p>
        <p class="email" id="email">${userdata.email == null ? "no email" : userdata.email}</p>
    </div>

    <div class="numpostsandcommands">
        <p class="postnum" id="postnum">${userdata.posts_count} <span>posts</span></p>
        <p class="commandsnum" id="commandsnum">${userdata.comments_count} <span>commands</span></p>
    </div>
    `

    axios.get(`https://tarmeezacademy.com/api/v1/users/${userdata.id}/posts`)
    .then(function (response) {

        unvisibleloader()
        
        let detail = response.data.data
        
        for(info of detail.reverse()){

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
                if(userdata != null){
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
                    const x = ""
                    return x
                }
            }

            document.querySelector(".allcontent").innerHTML +=
            `
            
            <div class="content" >
                <div class="imgofuser">
                    <div class="centering" id="${info.author.id}" >
                        ${imagecheck()}
                    </div>
                    <p id="name" class="name">${info.author.username}</p>
                    ${checkbtneditanddelete()}
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
        
        document.querySelector(".createpostbutton").innerHTML += `
        <div class="centering2" onclick="showcreatepostcard()" >
            <i class="fa-solid fa-plus photouser2"></i>
        </div>
        `
    }).catch(function (error) {
        unvisibleloader()
        notivaction(error.response.data.message , red)
    });
}

function fillinfoforuserownpost(){

    visibleloader()

    axios.get(`https://tarmeezacademy.com/api/v1/users/${userid}`)
    .then(function (response) {

        unvisibleloader()

        let detail = response.data.data

        function imagecheck(){

            if(typeof detail.profile_image == "object"){
                let x = `
                    <div class="centering1" >
                        <i class="fa-solid fa-user photouser1"></i>
                    </div>
                ` 
                return x
            }
            else
            {
                return ` <img class="imageuser" src="${detail.profile_image}"> `
            }
        }

        document.querySelector(".detailusercard").innerHTML = `
            <div class="centering1" >
                ${imagecheck()}
            </div>

            <div class="names">
                <p class="name" id="name">${detail.name == null ? "no name" : detail.name}</p>
                <p class="username" id="username">${detail.username}</p>
                <p class="email" id="email">${detail.email == null ? "no email" : detail.email}</p>
            </div>

            <div class="numpostsandcommands">
                <p class="postnum" id="postnum">${detail.posts_count} <span>posts</span></p>
                <p class="commandsnum" id="commandsnum">${detail.comments_count} <span>commands</span></p>
            </div>
            `
    })

    visibleloader()
    
    axios.get(`https://tarmeezacademy.com/api/v1/users/${userid}/posts`)
    .then(function (response) {

        unvisibleloader()

        let detail = response.data.data
        
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
                if(userdata != null){
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
                    const x = ""
                    return x
                }
            }

            document.querySelector(".allcontent").innerHTML +=
            `
            
            <div class="content" >
                <div class="imgofuser">
                    <div class="centering" id="${info.author.id}" >
                        ${imagecheck()}
                    </div>
                    <p id="name" class="name">${info.author.username}</p>
                    ${checkbtneditanddelete()}
                </div>
                
                <div onclick="gotopostuser(${info.id})">
                    <img id="photo" class="photo" src="
                    ${(typeof info.image == "object") ? 'data:image/jpeg;base64,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'
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
        
        document.querySelector(".createpostbutton").innerHTML += `
        <div class="centering2" onclick="showcreatepostcard()" >
            <i class="fa-solid fa-plus photouser2"></i>
        </div>
        `
    }).catch(function (error) {
        unvisibleloader()
        notivaction(error.response.data.message , red)
    });
}

function showcreatepostcard(){
    let content = `
        <div class="black" id="black"></div>
        <div class="containerofpost" id="content">
        <div class="postandx">
            <h3 class="post">create new post</h3>
            <i class="fa-solid fa-xmark" onclick="closecard()"></i>
        </div>

        <hr class="hrimage">

        <div>
            <h4 class="h4ofprofileimage">image of post</h4>
            <div class="imageofpost">
                <input id="imageofpost" class="inputofprofile" type="file">
            </div>
        </div>

        <input id="titlepost" type="text" class="titleofpost" placeholder="title of post">

        <input id="bodypost" type="text" class="bodyofpost" placeholder="body of post">

        <hr class="hrbutton">

        <div class="buttonoflogin">
            <button class="cancle" onclick="closecard()">cancle</button>
            <button class="register" onclick="createnewpost()">post</button>
        </div>
        `

        document.querySelector(".body").innerHTML += content
}

function createnewpost(){

    let title = document.getElementById("titlepost").value
    let body = document.getElementById("bodypost").value
    let image = document.getElementById("imageofpost").files[0]



    let config = {
            headers : {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
    }

    let formData = new FormData(); 

    formData.append('title', title);

    formData.append('body', body);

    if(image != undefined){
        formData.append('image', image);
    }

    visibleloader()
    axios.post('https://tarmeezacademy.com/api/v1/posts',formData , config)

    .then(function (response) 
    {
        unvisibleloader()
        notivaction("you make a new post successfully" , green)
        closecard()
        checkuser()
    })
    .catch(function (error) {
        unvisibleloader()
        notivaction(error.response.data.message , red)
    });
}
