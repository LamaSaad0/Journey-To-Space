// Here declared constants for the API key and the base URLs for the APOD and NEO APIs.
const apiKey = "OfzgBPXMt4Ao8IW5gKBFIePSEzUtHzhsIQV5M8oS";
const apodUrl = "https://api.nasa.gov/planetary/apod";
const afeedUrl = "https://api.nasa.gov/neo/rest/v1/feed";

// The function (handleAFeedData) processes the JSON data obtained from the NEO API and adds the necessary data to the table.
// Accepts an object with keys element_count, near_earth_objects, afeedElement, and afeedTable.
function handleAFeedData({element_count, near_earth_objects}, afeedElement, afeedTable){  

    // The function returns through the near_earth_objects object, mapping each date to the corresponding array of asteroids.
    afeedElement.innerHTML = Object.keys(near_earth_objects).map(date=>{

        // For each asteroid, it extracts various properties such as ID, name, potential hazard status, magnitude, estimated diameter (min and max), and miss distance.
        return near_earth_objects[date].map(asteroid=>{
            const id        = asteroid.id;
            const name      = asteroid.name;
            const dangerous = asteroid.is_potentially_hazardous_asteroid;
            const magnitude = asteroid.absolute_magnitude_h;
            const min       = asteroid.estimated_diameter.meters.estimated_diameter_min;
            const max       = asteroid.estimated_diameter.meters.estimated_diameter_max;
            const close_approach_data = asteroid.close_approach_data.shift();
            const miss_distance = close_approach_data.miss_distance.kilometers;
            
            // Then creates a table row with the extracted data and returns it as a string. 
            return `<tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${dangerous ? "YES" : "NO"}</td>
                <td>${magnitude}</td>
                <td>${min}</td>
                <td>${max}</td>
                <td>${miss_distance}</td>
                <td>${date}</td>
            </tr>`
         
        }).join(""); // Method is used to concatenate the strings.
    }).join("");

    // If there is no data to display, the table is hidden. Otherwise, the table is shown by setting its className to the striped.
    if(afeedElement.innerHTML === ""){
        afeedTable.className = "striped hide"
    } else{
        afeedTable.className = "striped";
    }
}

// contentLoaded() function is the main function that fetches and processes the data from both APOD and NEO APIs.
function contentLoaded(){
    
    // Declared variables to store references to the HTML elements with the specified IDs.
    const apodElement = document.getElementById("apod");
    const startElement = document.getElementById("start");
    const afeedElement = document.getElementById("afeed");
    const afeedTable   = document.getElementById("afeedTable");

    /** Apod */
    // Fetched data from the NASA API, processed the response and display the fetched media (image or video) along with other information on the webpage.
    fetch(`${apodUrl}?api_key=${apiKey}`)
    .then(res=>res.json())
    .then(data=>{

        let media = "";
        if(data.media_type === "image"){
            media = `<img class="responsive-img" src="${data.hdurl}">`
        } else {
            media = `<div class="video-container">
                        <iframe src="${dat.hdurl}" width="560" height="315"></iframe>
                    </div>`
        }
        // Initialize Materialize date picker for the date input element and set its options.
        apodElement.innerHTML = (`
            <div class="card-image">
                ${media}
                <span class="card-title">${data.title}</span>
            </div>
            <div class="card-content">
                <p>
                    ${data.explanation}
                </p>

                <p>${(new Date(data.date)).toDateString()}</p> 
                <p>© ${data.copyright}</p>
            </div>
            <div class="card-action">
                <a target="_blank" href="https://www.nasa.gov/">Find more @ Nasa</a>
            </div>
        `) 
    }).catch(handleError);
    /** Asteroid Feed */
    const elems = document.querySelectorAll('.datepicker');
    const instances = M.Datepicker.init(elems, {
        autoClose: true,
        defaultDate: new Date(),
        format: 'yyyy-mm-dd'
    });
    
    /* (addanEventlistener) for the 'change' event on the start element. When the date is changed, 
    fetched data from the NEO API, process the response using handleAFeedData(),and display the asteroid information in the table.*/
    start.addEventListener("change", function(){

        fetch(`${afeedUrl}?start_date=${this.value}&api_key=${apiKey}`)
        .then(res=>res.json())
        .then(data=>handleAFeedData(data, afeedElement, afeedTable))
        .catch(handleError);
        
        // Logs the selected date to the console.
        console.log(this.value);
    })
}
function handleError(error){
    console.warn(error.message);
}

window.addEventListener("DOMContentLoaded", contentLoaded)