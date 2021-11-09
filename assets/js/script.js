const API_KEY = 's3gep4d935fRXA5MEtbGAz3V064';
const API_URL = 'https://ci-jshint.herokuapp.com/api'; 
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}` //supply api key as a parameter 

    const response = await fetch(queryString); //'awaits' for response 

    const data = await response.json(); //convert response to json - this also returns a promis

    if (response.ok) { //If everything has gone well, an 'ok' property is set on the response object
        console.log(data.expiry); //.expiry shows only the date on the log
    }
}
