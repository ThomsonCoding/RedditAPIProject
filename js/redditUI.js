const resultsSection = document.querySelector('.search__results__list');
const chartBox = document.querySelector('.chart__box');

//Both of these hold the data for the original search. Which allow the user to go back to the original state after manipulating the data with the search functions. 
let previousDate; 
let previousScore;
let resultsChart;

const generateUi = (data) => {
    //Using the removingOldData function to get rid of the previous graph and comments. Then generating a base one for new info to be fed to. 
    removingOldData(resultsSection);
    removingOldData(chartBox);
    generateNewGraph();

    const redditResults = data.data;
    let scores = [];
    let date = [];

    redditResults.forEach((dataSet, i)=> {
        const list = document.createElement('li');
        resultsSection.appendChild(list);

        const author = document.createElement('h3');
        author.textContent = dataSet.author;

        const content = document.createElement('p');
        content.textContent = dataSet.body;

        const contentScore = document.createElement('p');
        contentScore.textContent = dataSet.score;
        scores.push(dataSet.score);

        const timeStamp = document.createElement('h6');
        var Epoch = new Date(dataSet.created_utc *1000 + (86400000 * i)).toDateString();
        timeStamp.textContent = Epoch;
        date.push(Epoch);

        [author, content, timeStamp, contentScore].forEach(el => list.appendChild(el));
    });

    previousDate = date;
    previousScore = scores;
    generateGraph(resultsChart, date, scores);
}

//Used to remove the previous search data. 
const removingOldData = (parent) => {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }  
}

const generateGraph = (resultsChart, date, scores) => {

    const labels = date;
    const testData = {
        labels: labels,
        datasets: [{
        label: 'Comment date and score',
        backgroundColor: 'rgb(255, 255, 132)',
        borderColor: 'rgb(45, 107, 169)',
        data: scores, 
        }]
    };
    
    const config = {
        type: 'line',
        data: testData,
        options: {}
    };

    const myChart = 
    new Chart(
        resultsChart,
        config
    );

    searchFunction(date, scores); 
}

// This generates and provides the funtionality for the search function (Which is used when searching different dates within the graph).
const searchFunction = (date, scores) => {
    let min = Math.min(...scores);
    let max = Math.max(...scores);

    // Data Search Function section.
    const searchSections = document.createElement('section');
    searchSections.classList.add('search__sections');
    
    //This generates the search functionality for the score. 
    const scoreSliderSection = document.createElement('section');
    scoreSliderSection.classList.add('score__slider__section');
    searchSections.appendChild(scoreSliderSection);

    const scoreFromLabel = document.createElement('p');
    scoreFromLabel.innerText = `Score From: ${min}`;

    const scoreFromSlider = document.createElement('input');
    scoreFromSlider.type = "range";
    scoreFromSlider.min = (min - 1);
    scoreFromSlider.max = (max + 1);
    scoreFromSlider.value = min;

    const scoreFromOutput = document.createElement('output');

    scoreFromSlider.oninput = () => {
        scoreFromLabel.innerText = `Score From: ${scoreFromSlider.value}`;
    }

    const scoreToLabel = document.createElement('p');
    scoreToLabel.innerText = `Score To: ${max}`;

    const scoreToSlider = document.createElement('input');
    scoreToSlider.type = "range";
    scoreToSlider.min = (min - 1);
    scoreToSlider.max = (max + 1);
    scoreToSlider.step = 1;
    scoreToSlider.value = max;

    const scoreToOutput = document.createElement('output');

    scoreToSlider.oninput = () => {
        scoreToLabel.innerText = `Score To: ${scoreToSlider.value}`;
    }

    // This generates the search functionality for the date.
    const dateDropdownSection = document.createElement('section');
    dateDropdownSection.classList.add('date__dropdown__section');
    searchSections.appendChild(dateDropdownSection)

    const dateFromLabel = document.createElement('p');
    dateFromLabel.innerText = 'Date From:'

    const dateFromSlider = document.createElement('select');

    date.forEach(day => {
        const dateOption = document.createElement('option');
        dateOption.innerText = day;
        dateFromSlider.append(dateOption);
    })


    const dateToLabel = document.createElement('p');
    dateToLabel.innerText = 'Date To:'

    const dateToSlider = document.createElement('select');

    date.forEach(day => {
        const dateOption = document.createElement('option');
        dateOption.innerText = day;
        dateToSlider.append(dateOption);
    })


    const graphButtonSection = document.createElement('section');
    graphButtonSection.classList.add('graph_button_section');

    //Creates the score filter button.
    const scoreSearchButton = document.createElement('button');
    scoreSearchButton.classList.add('graph__button');
    scoreSearchButton.innerText = "Search Score";
    scoreSearchButton.addEventListener("click", () => {
        scoresFilter(date, scores, scoreFromSlider.value, scoreToSlider.value);
    });


    //Creates the search button and it's functionality. 
    const dateSearchButton = document.createElement('button');
    dateSearchButton.classList.add('graph__button')
    dateSearchButton.innerText = "Search Dates"
    dateSearchButton.addEventListener("click", () => { 
        const dateFromKey = getKeyByValue(date, dateFromSlider.value);  
        const dateToKey = getKeyByValue(date, dateToSlider.value);      

        if (dateFromKey >= dateToKey) {
            console.log(dateFromKey >= dateToKey);
            alert('"Date From..." should be earlier than "Date To..."');
        } else {   
            const filteredDate = date.slice(dateFromKey, dateToKey);
            const filteredScores = scores.slice(dateFromKey, dateToKey);     
            removingOldData(chartBox);
            generateNewGraph();

        generateGraph(resultsChart, filteredDate, filteredScores);
        }


    });

    //Creates the reset button and it's functionality. 
    const resetSearchButton = document.createElement('button');
    resetSearchButton.classList.add('graph__button')    
    resetSearchButton.innerText = "Reset Graph"
    resetSearchButton.addEventListener("click", () => {

        removingOldData(chartBox);
        generateNewGraph();

        generateGraph(resultsChart, previousDate, previousScore);
    });

    //
    //This appends all the score search features that are found within the score__slider__section.
    [scoreFromLabel, scoreFromSlider, scoreFromOutput, scoreToLabel, scoreToSlider, scoreToOutput].forEach(el => scoreSliderSection.appendChild(el));
    //This appends the date drop downs, that are found within the date_dropdown_section.
    [dateFromLabel, dateFromSlider, dateToLabel, dateToSlider].forEach(el => dateDropdownSection.appendChild(el));
    //This attatches all the buttons required for manipulating the graph. (Search Score, Search Dates and Reset Graph)
    [scoreSearchButton, dateSearchButton, resetSearchButton].forEach(el =>  graphButtonSection.appendChild(el));   
    //Attatches the graph_button_section to the chart__box (Which holds the search features and buttons)
    [searchSections, graphButtonSection].forEach(el => chartBox.appendChild(el));
    
}


// This gets the key of the selected element. Which is used to help slice the dates and score to update the graph.
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

const scoresFilter = (date, scores, scoreFromSlider, scoreToSlider) => {
    console.log(scoreFromSlider + " " + scoreToSlider);
    if (scoreFromSlider > scoreToSlider) {
        alert('Error');
        return;
    }

    //resultsChart Add this as the first variable.
    let lowestScore = scoreFromSlider;
    let highestScore = scoreToSlider;
    let filteredScoreList = [];
    let filteredDateList = [];
    scores.forEach((score, i) => {
        if(score > lowestScore && score < highestScore) {
            filteredScoreList.push(score);
            filteredDateList.push(date[i]);
        }

        removingOldData(chartBox);
        generateNewGraph();

        generateGraph(resultsChart, filteredDateList, filteredScoreList);   
    })
    
    console.log(filteredScoreList);
    console.log(filteredDateList);
};

const generateNewGraph = () => {
    resultsChart = document.createElement('canvas');
    resultsChart.classList.add('.myChart');
    chartBox.appendChild(resultsChart);
} 

export default generateUi;