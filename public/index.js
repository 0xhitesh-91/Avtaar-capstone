import {jwtDecode} from "./jwt-decode.js"

let accessToken = '';
let api_url = "/api";
const loginForm = document.getElementById("form-login");
const logoutButton = document.getElementById("logout-button");
const getEventButton = document.getElementById("button-get-events");
const pStatus = document.getElementById("login-status");

//handel login event
loginForm.onsubmit = async e => {
    e.preventDefault();
    console.log("entered in loginform");
    const loginDetails = await login({email: loginForm.email.value, password: loginForm.password.value});
    console.log(loginDetails);
    if(loginDetails.error){
        pStatus.innerHTML = loginDetails.error;
        return;
    }
    accessToken = loginDetails.accessToken;
    const jwtDecoded = jwtDecode(accessToken);
    pStatus.innerHTML = `Login Successful! </br> Hello ${jwtDecoded.userid.name} </br> Your email is ${jwtDecoded.userid.email}`;
}

async function login(data){
    console.log(JSON.stringify(data));
    const res = await fetch(`${api_url}/auth/login`, {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await res.json();
}

//handle logout event
logoutButton.onclick = async () => {
    const deleteDetails = await deleteToken();
    if(deleteDetails.error){
        pStatus.innerHTML = deleteDetails.error;
        return;
    }
    accessToken = "";
    pStatus.innerHTML = deleteDetails.message;
}

async function deleteToken() {
    console.log("entered into deleteToken");
    const res = await fetch(`${api_url}/auth/refresh_token`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
    });
    console.log("exiting deleteToken");
    return res.json();
}

//handle fetch events from DB on demand

getEventButton.onclick = async () => {
    const usersList = document.getElementById('event-list');
    usersList.innerHTML = "";
    console.log(accessToken);
    const {events, error} = await fetchUsers(accessToken);
    if(error){
        pStatus.innerHTML = error;
        return;
    }
    events.forEach(({name, description, location, startdate, enddate}) => {
        let e1 = document.createElement('li');
        e1.innerHTML = `${name} - ${description} - ${location} - ${startdate} - ${enddate}`;
        usersList.append(e1);
    });
}

async function fetchUsers(token) {
    const res = await fetch(`${api_url}/events`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return res.json();
}