const API_KEY = 's3gep4d935fRXA5MEtbGAz3V064';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

function processOptions(form) {
    let optArray = []; //empty array to contain list of errors

    for (let entry of form.entries()) { //iterates through the options and pushes into empty array
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }

    form.delete("options"); //deletes previous options

    form.append("options", optArray.join()); //appends back a comma separated string of options from empty array to our form

    return form;
}

async function postForm(e) {

    const form = processOptions(new FormData(document.getElementById("checksform"))); //captures all fields in a html form and return them as an object

    // for (let entry of form.entries()) {
    //     console.log(entry);
    // } This for loop checks if the form is working, not required, only a test

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });
    const data = await response.json(); //convert response to json - this also returns a promis
    if (response.ok) { //If everything has gone well, an 'ok' property is set on the response object
        displayErrors(data)
    } else {
        throw new Error(data.error); //data.error is the descriptive message from the json that's been returned
    };
}

function displayErrors(data) {
    let results = "";

    let heading = `JSHint Results for ${data.file}`; // sets the heading
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`; // shows results if no errors
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) { //displays a list of the errors we get from our json. 
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading; //replaces the heading with the above
    document.getElementById("results-content").innerHTML = results; //replaces the results with the above
    resultsModal.show(); //shows the modal containing the list of errors (pop out window)
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}` //supply api key as a parameter 

    const response = await fetch(queryString); //'awaits' for response 

    const data = await response.json(); //convert response to json - this also returns a promis

    if (response.ok) { //If everything has gone well, an 'ok' property is set on the response object
        // console.log(data.expiry); data.expiry will show only the date on the log
        displayStatus(data)
    } else {
        throw new Error(data.error); //data.error is the descriptive message from the json that's been returned
    }
}

function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}
