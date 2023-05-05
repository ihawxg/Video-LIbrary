let inp = document.getElementById("myInput");
let container = document.getElementById("container");

function searchMovies() {
    document.getElementById("button").addEventListener("click", function (event) {
        event.preventDefault();
        fetch("https://www.omdbapi.com/?apikey=a346cfa3&type=Movie&s=" + inp.value)
            .then(resp => resp.json())
            .then(data => {
                seachMovieFromAPI(container, data);
            })


    })
}

function autocomplete() {

    var currentFocus;

    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;

        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);


        inp.addEventListener("keyup", function () {
            let myInput = document.getElementById("myInput");
            // console.log(myInput.value);

            fetch("https://www.omdbapi.com/?apikey=a346cfa3&type=Movie&s=" + myInput.value)
                .then(resp => resp.json())
                .then(data => {

                    // console.log(data.Search);
                    data.Search.forEach(e => {
                        b = document.createElement("DIV");
                        // console.log(val);
                        b.innerHTML = "<strong>" + e.Title.substr(0, val.length) + "</strong>";
                        let index = e.Title.toLowerCase().indexOf(val.toLowerCase());
                        let boldTitle = e.Title.slice(0, index) + "<strong>" + e.Title.slice(index, index + val.length) + "</strong>" + e.Title.slice(index + val.length);
                        b.innerHTML = boldTitle;
                        b.addEventListener("click", function (e) {

                            inp.value = e.target.innerText;

                            closeAllLists();
                        });
                        a.appendChild(b);
                    })

                })

        })

    });

    inp.addEventListener("keyup", function (e) {

        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {

            currentFocus++;

            addActive(x);
        } else if (e.keyCode == 38) {

            currentFocus--;

            addActive(x);
        } else if (e.keyCode == 13) {

            e.preventDefault();
            if (currentFocus > -1) {

                if (x) x[currentFocus].click();
            }
        }

    });
    function addActive(x) {

        if (!x) return false;

        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {

        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {

        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function seachMovieFromAPI(container, data) {
    container.innerHTML = "";

        data.Search.forEach(element => {
            let h1 = document.createElement("h1");
            let year = document.createElement("p");
            let imdbID = document.createElement("p");
            let type = document.createElement("h3");
            let img = document.createElement("img");
            let br = document.createElement("br");

            h1.innerHTML = "Title: " + element.Title;
            year.innerHTML = "Year: " + element.Year;
            imdbID.innerHTML = "imdbID: " + element.imdbID;
            type.innerHTML = "Type: " + element.Type;
            img.src = element.Poster;
            img.style.width = "300px";
            img.style.height = "300px";
            img.style.borderRadius = "20px";
            img.style.marginLeft="36px";

            let div = document.createElement("div");
            div.style.flexBasis = "20%"

            div.style.border = "3px solid black";
            div.style.borderRadius = "20px";

            div.append(img, h1, year, br, imdbID, type);
            container.append(br, div);
        });
    }

function pageChange() {

    let previous = document.getElementById("previous");
    let next = document.getElementById("next");

    previous.addEventListener("click", function () {
        let currentHash = location.hash.slice(1);

        if (currentHash > 1) {
            location.hash = parseInt(currentHash) - 1;
        }
    })
    next.addEventListener("click", function () {
        let currentHash = location.hash.slice(1);
        location.hash = parseInt(currentHash) + 1;
    })

    document.getElementById("button").addEventListener("click", function (event) {


        event.preventDefault();

        location.hash = "1";

        fetch("https://www.omdbapi.com/?apikey=a346cfa3&type=Movie&s=" + inp.value + "&page=" + location.hash)

        let pagination = document.getElementById("paginationContainer");

        pagination.style.display = "flex";

    })

    window.addEventListener("hashchange", function () {
        let hash = location.hash.slice(1)
        if (hash >= 1) {
            fetch("https://www.omdbapi.com/?apikey=a346cfa3&type=Movie&s=" + inp.value + "&page=" + hash)
                .then(resp => resp.json())
                .then(data => {
                    // console.log(data);
                    seachMovieFromAPI(container, data);
                })
        }

    })

}

function paginationCreate() {

    let page = document.getElementById("pages");
    document.getElementById("button").addEventListener("click", function () {
        page.innerHTML = "";
        fetch("https://www.omdbapi.com/?apikey=a346cfa3&type=Movie&s=" + inp.value)
            .then(resp => resp.json())
            .then(data => {
                let pages = Math.ceil(data.totalResults / 10);
                for (let i = 0; i < pages; i++) {

                    let a = document.createElement("a")
                    let count = i + 1;
                    a.setAttribute("id", "id-" + count);
                    a.innerText = i + 1;
                    a.href = "#" + count;
                    page.append(a);
                }
                document.getElementById("id-1").classList.add("active");
            })
    })


}

function activatePageButton() {

    window.addEventListener("hashchange", function () {
        
        let currentPageNumber = document.getElementById("id-" + location.hash.slice(1));
        
        let previousPageNumber = document.querySelector(".active");
        if (previousPageNumber) {
            previousPageNumber.classList.remove("active");
        }
    
        currentPageNumber.classList.add("active");
    });
    
    document.getElementById("button").addEventListener("click", function (event) {
        event.preventDefault();

        let currentPageNumber = document.getElementById("id-" + location.hash.slice(1));
        
        let previousPageNumber = document.querySelector(".active");
        if (previousPageNumber) {
            previousPageNumber.classList.remove("active");
        }
    
        currentPageNumber.classList.add("active");
    });
    

}

window.addEventListener("load", function () {
    location.hash = "";
})




paginationCreate();

pageChange();

autocomplete();

searchMovies();

activatePageButton();