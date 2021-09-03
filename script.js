// https://www.javascripttutorial.net/javascript-dom/javascript-debounce/

const searchTermElem = document.querySelector('#searchTerm');
const searchResultElem = document.querySelector('#searchResult');

searchTermElem.focus(); // higlight element

searchTermElem.addEventListener('input', (event) => {
    search(event.target.value);
});


/*  
Without debounce function
With debounce logic

let timeoutId;

const search = (searchTerm) => {
    // reset the previous timer
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // set up a new timer
    timeoutId = setTimeout(async () => {
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
            const response = await fetch(url);
            const searchResults = await response.json();

            // show the search result in the console
            console.log({
                'term': searchTerm,
                'results': searchResults.query.search
            });
        } catch (error) {
            console.log(error);
        }
    }, 500);
};
*/

const debounce = (fn, delay=500) => {
    let timeoutId;

    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args);
        }, delay);
    };
};


const search = debounce(async (searchTerm) => {

    // if the search term is removed, reset the search result
    if (!searchTerm) {
        searchResultElem.innerHTML = '';
        return;
    }

    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
        const response = await fetch(url);
        const searchResults = await response.json();

        /*
        // show the search result in the console
        console.log({
            'term': searchTerm,
            'results': searchResults.query.search
        });
        */

        // render search result
        const searchResultHtml = generateSearchResultHTML(searchResults.query.search, searchTerm);

        // add the search result to the searchResultElem
        searchResultElem.innerHTML = searchResultHtml;

    } catch (error) {
        console.log(error);
    }
});


/*
The stripHtml() function accepts an HTML string.
It creates a temporary <div> element, 
assign its innerHTML the HTML string, and 
return its textContent property.
*/

const stripHtml = (html) => {
    let div = document.createElement('div');
    div.textContent = html;
    return div.textContent;
}

/*
This highlight() function highlights all the occurrences 
of the keyword in the str by wrapping each occurrence of 
the keyword in a <span> tag with the highlight class

Note that the function uses the regular expression to 
replace all occurrences of the keyword by the <span> element.
*/



const highlight = (str, keyword, className="highlight") => {
    const h1 = `<span class="${className}">${keyword}</span>`;
    return str.replace(new RegExp(keyword, 'gi'), h1);
}

const generateSearchResultHTML= (results, searchTerm) => {
    return results
        .map(result => {
            const title = highlight(stripHtml(result.title), searchTerm);
            const snippet = highlight(stripHtml(result.snippet), searchTerm);

            return `<article>
                <a href="https://en.wikipedia.org/?curid=${result.pageid}">
                    <h2>${title}</h2>
                </a>
                <div class="summary">${snippet}...</div>
            </article>`;
        })
        .join('');
}