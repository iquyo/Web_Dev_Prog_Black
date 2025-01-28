const initrequest = new XMLHttpRequest();
var artist_catalogue = []

initrequest.open('GET', '/artists');
initrequest.onload = function() {
    if (initrequest.status == 200) {
        artist_catalogue = JSON.parse(initrequest.responseText);

        for (const artist of artist_catalogue) {
            let artist_name = artist.name;
            let newCard = document.createElement("div");
            newCard.classList.add("col-md-3");
        
            newCard.innerHTML = 
                "<div class='card'>\
                    <img src='...' class='card-img-top' alt='An image of " + artist.name + ".'>\
                    <div class='card-body'>\
                        <h5 class='card-title'>" + artist.name + "</h5>\
                        <a href='#' class='btn btn-primary'>Go somewhere</a>\
                    </div>\
                </div>";
        
            const artist_cards = document.getElementById("artist_cards");
            //console.log(artist_cards);
            artist_cards.appendChild(newCard);
        }
    }
    else{
        alert("Error 408: Data fetch timed out. Please try again.");
    };
};

initrequest.send();

// This card needs to be created for each artist
{/* <div class="col-md-3">
    <div class="card">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
    </div>
</div> */}