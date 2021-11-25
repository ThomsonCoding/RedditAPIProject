const resultsSection = document.querySelector('.search__results__list');

const generateCommentTable = (redditResults) => {
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
}

export default generateCommentTable;