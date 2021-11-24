//Pulse Request to the Reddit API/Endpoint. Using A keyword and two dates to narrow down the search.
import getCurrentData from './fetchRedditApi.js'; 
//Imports the code for generating the graph and comments. 
import generateUi from "./redditUI.js"; 

const keyWord = document.querySelector('#key__word');
const searchFrom = document.querySelector('#search__from');
const searchTo = document.querySelector('#search__to');
const searchButton = document.querySelector('#search__button'); 

const todaysDate = new Date();

searchButton.addEventListener("click", () =>{
    //Gets the value of the data required for the search.
    const topic = keyWord.value;
    const dateFrom = new Date(searchFrom.value);
    const dateTo = new Date(searchTo.value);

    //Calculates how many days ago both the search from/search to dates are from today. (This is because the API requires this instead of dates.)
    const after = calculateDifference(todaysDate, dateFrom) -1;
    const before = calculateDifference(todaysDate, dateTo) -1;

    //Uses the topic and amount of days pull the data. Between the two set days. Use that data to generate the UI. 
    getCurrentData(topic, after, before).then((data) => generateUi(data));
});

//Below calculates the difference between today and the deducted date in seconds. Then uses mathmatics to work out how many days ago that was. 
const calculateDifference = (todaysDate, deductedDate) => {
    var difference = todaysDate.getTime() - deductedDate.getTime();

    var days = Math.ceil(difference / (1000 * 3600 * 24)); 
    return days;
};



