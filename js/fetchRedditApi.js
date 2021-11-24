const getCurrentData = async function(topic, after, before) {

    console.log("reached this point");

    const response = await fetch(`https://api.pushshift.io/reddit/search/comment/?q=${topic}&after=${after}d&before=${before}d&sort=asc`);

    const data = await response.json();

    console.log(data);

    return data
};

export default getCurrentData;