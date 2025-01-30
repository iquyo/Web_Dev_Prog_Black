const initrequest = new XMLHttpRequest();
var artist_catalogue = []

initrequest.open('GET', '/artists');
initrequest.onload = function() {
    if (initrequest.status == 200) {
        artist_catalogue = JSON.parse(initrequest.responseText);

        for (const artist of artist_catalogue) {
            let newCard = createNewCard(artist.name, artist.image, artist.ID);
            const artist_cards = document.getElementById("artist_cards");
            artist_cards.appendChild(newCard);
        }
        card_buttons = document.querySelectorAll('.cardbtn')
        card_buttons.forEach(card_button => {
            card_button.addEventListener('click', (event) => {
                const id = card_button.id;
                const detailedRequest = new XMLHttpRequest();
                detailedRequest.open('GET', '/artists/' + id);
    
                detailedRequest.onload = function() {
                    if (detailedRequest.status == 200) {
                        details = JSON.parse(detailedRequest.responseText);
    
                        editDetailedModal(details.name, details.song, details.networth, details.genre, details.description, details.imagesource, details.imageattr);
                    }
                    else{
                        alert("Error 400: Data fetch timed out. Please try again.");
                    }
                }
                detailedRequest.send();
            })
        })
    }
    else{
        alert("Error 400: Data fetch timed out. Please try again.");
    };
};

function createNewCard(name, imagesource, id) {
    let newCard = document.createElement("div");
        newCard.classList.add("col-md-3");
        
        newCard.innerHTML = 
            "<div class='card'>\
                <img src='" + imagesource + "' class='card-img-top' alt='An image of " + name + ".'>\
                <div class='card-body'>\
                    <h5 class='card-title'>" + name + "</h5>\
                    <button type='button' class='btn btn-primary ms-auto cardbtn' id='" + id + "' data-bs-toggle='modal' data-bs-target='#detailedPage'>\
                        Details\
                    </button>\
                </div>\
            </div>";
    
    return newCard
}

function editDetailedModal(name, song, networth, genre, description, imagesource, imageattr) {

    let namelabel = document.getElementById('detailedPageLabel');
    let imagelabel = document.getElementById('cardImage');
    let attrlabel = document.getElementById('attrLabel')
    let songlabel = document.getElementById('song');
    let networthlabel = document.getElementById('networth');
    let genrelabel = document.getElementById('genre');
    let descriptionlabel = document.getElementById('description');
    let commentslabel = document.getElementById('comments');

    commentslabel.innerHTML = "<div id='comments'></div>"
    const commentRequest = new XMLHttpRequest();
    commentRequest.open('GET', '/comments')

    commentRequest.onload = function() {
        if (commentRequest.status == 200) {
            let no_comments = true
            comments = JSON.parse(commentRequest.responseText);
            comments.forEach(comment => {
                if (comment.for == name) {
                    no_comments = false
                    const commentDetailedRequest = new XMLHttpRequest();
                    commentDetailedRequest.open('GET', '/comments/' + comment.ID)
                    commentDetailedRequest.onload = function() {

                        if (commentDetailedRequest.status == 200) {
                            detailedComment = JSON.parse(commentDetailedRequest.responseText);
                            const outputComment = document.createElement("p");
                            outputComment.innerHTML = "<p>" + detailedComment.author + ": " + detailedComment.content + "</p>"
                            commentslabel.appendChild(outputComment);
                        }
                        else{
                            alert("Error 400: Data fetch timed out. Please try again.");
                        };
                    }
                    commentDetailedRequest.send();
                }
            })
            if (no_comments == true) {
                commentslabel.innerHTML = "<div id='comments'><p id='tempcomment'>No one has posted anything yet, be the first to share your thoughts!</p></div>"
            }
        }
        else{
            alert("Error 400: Data fetch timed out. Please try again.");
        };
    }
    commentRequest.send();

    namelabel.innerHTML = "<h1 class='modal-title fs-5' id='detailedPageLabel'>" + name + "</h1>"
    imagelabel.innerHTML = "<img src='" + imagesource + "' class='img-fluid' id='cardImage'>"
    attrlabel.innerHTML = "<p id=attrlabel>" + imageattr + "</p>"
    songlabel.innerHTML = "<p id='song'>" + song + "</p>"
    networthlabel.innerHTML = "<p id='networth'>$" + networth + "</p>"
    genrelabel.innerHTML = "<p id='genre'>" + genre + "</p>"
    descriptionlabel.innerHTML = "<p id='description'>" + description + "</p>"
}

window.addEventListener("load", function() {
    initrequest.send();

    const filter_buttons = document.querySelectorAll('.filterbtn');
    const comment_submit_button = document.getElementById('commentSubmit');
    const artist_submit_button = this.document.getElementById('artistSubmit')
    var card_buttons = document.querySelectorAll('.cardbtn');


    artist_submit_button.addEventListener('click', (event) => {

        // Get data from input fields and reset them to empty
        let namefield = document.getElementById('artistNameInput');
        let songfield = document.getElementById('songInput');
        let networthfield = document.getElementById('networthInput');
        let genrefield = document.getElementById('genreInput');
        let descriptionfield = document.getElementById('descriptionInput');
        let postInput = {
            "name": namefield.value,
            "song": songfield.value,
            "networth": networthfield.value,
            "genre": genrefield.value,
            "description": descriptionfield.value
        }
        namefield.value = ""
        songfield.value = ""
        networthfield.value = ""
        genrefield.value = ""
        descriptionfield.value = ""

        let postOutput = JSON.stringify(postInput);
        const uploadArtistRequest = new XMLHttpRequest();
        uploadArtistRequest.open('POST', '/artists/');
        uploadArtistRequest.setRequestHeader('Content-Type', 'application/json');

        uploadArtistRequest.onload = function() {
            let postResponse = JSON.parse(uploadArtistRequest.response);
            if (uploadArtistRequest.status == 201) {
                alert(postResponse.message)
            }
            else {
                alert(postResponse.message)
            }
        }
        uploadArtistRequest.send(postOutput)

    })


    comment_submit_button.addEventListener('click', (event) => {

        let commentslabel = document.getElementById('comments');
        let tempcomment = document.getElementById('tempcomment');
        let commentFor = document.getElementById("detailedPageLabel").innerText;
        let userField = document.getElementById("usernameInput");
        let commentField = document.getElementById("commentInput");
        let postInput = {
            "for": commentFor,
            "author": userField.value,
            "content": commentField.value
        };
        userField.value = "";
        commentField.value = "";

        let postOutput = JSON.stringify(postInput);
        const uploadCommentRequest = new XMLHttpRequest();
        uploadCommentRequest.open('POST', '/comments/');
        uploadCommentRequest.setRequestHeader('Content-Type', 'application/json');

        uploadCommentRequest.onload = function() {
            let postResponse = JSON.parse(uploadCommentRequest.response);
            if (uploadCommentRequest.status == 201) {
                if (tempcomment) {
                    tempcomment.innerHTML = ""
                }
                const outputComment = document.createElement("p");
                outputComment.innerHTML = "<p>" + postResponse.author + ": " + postResponse.content + "</p>"
                commentslabel.appendChild(outputComment);
                alert(postResponse.message)
            }
            else {
                alert(postResponse.message)
            }
        }
        uploadCommentRequest.send(postOutput)
    })

    filter_buttons.forEach(filter_button => {
        filter_button.addEventListener('click', (event) => {
            const artist_cards = document.getElementById("artist_cards");
            artist_cards.innerHTML = "";

            const filteredRequest = new XMLHttpRequest();
            filteredRequest.open('GET', '/artists');

            filteredRequest.onload = function() {
                if (filteredRequest.status == 200) {
                    filtered_catalogue = JSON.parse(filteredRequest.responseText);
            
                    for (const artist of filtered_catalogue) {
                        if (filter_button.id == "None" || filter_button.id == "Null") {
                            let newCard = createNewCard(artist.name, artist.image, artist.ID);
                    
                            const artist_cards = document.getElementById("artist_cards");
                            artist_cards.appendChild(newCard);
                        }
                        else {
                            if (filter_button.id == artist.genre) {
                                let newCard = createNewCard(artist.name, artist.image, artist.ID);
                        
                                const artist_cards = document.getElementById("artist_cards");
                                artist_cards.appendChild(newCard);
                            }

                            if (filter_button.id == "50m" && artist.networth < 50000000) {
                                let newCard = createNewCard(artist.name, artist.image, artist.ID);

                                const artist_cards = document.getElementById("artist_cards");
                                artist_cards.appendChild(newCard);
                            }

                            if (filter_button.id == "75m" && artist.networth >= 50000000 && artist.networth < 100000000) {
                                let newCard = createNewCard(artist.name, artist.image, artist.ID)
                    
                                const artist_cards = document.getElementById("artist_cards");
                                artist_cards.appendChild(newCard);
                            }

                            if (filter_button.id == "100m" && artist.networth >= 100000000) {
                                let newCard = createNewCard(artist.name, artist.image, artist.ID)
                    
                                const artist_cards = document.getElementById("artist_cards");
                                artist_cards.appendChild(newCard);
                            }

                            if (filter_button.id == "Clr") {
                                let newCard = createNewCard(artist.name, artist.image, artist.ID)
                    
                                const artist_cards = document.getElementById("artist_cards");
                                artist_cards.appendChild(newCard);
                            }
                            
                            if (filter_button.id == "textFilter") {
                                let filterQuery = document.getElementById("searchInput").value;
                                if (artist.name.includes(filterQuery)) {
                                    let newCard = createNewCard(artist.name, artist.image, artist.ID);
                    
                                    const artist_cards = document.getElementById("artist_cards");
                                    artist_cards.appendChild(newCard);
                                }
                            }
                        }
                    }
                    card_buttons = document.querySelectorAll('.cardbtn')
                    card_buttons.forEach(card_button => {
                        card_button.addEventListener('click', (event) => {
                            const id = card_button.id;
                            const detailedRequest = new XMLHttpRequest();
                            detailedRequest.open('GET', '/artists/' + id);
                
                            detailedRequest.onload = function() {
                                if (detailedRequest.status == 200) {
                                    details = JSON.parse(detailedRequest.responseText);
                
                                    editDetailedModal(details.name, details.song, details.networth, details.genre, details.description, details.imagesource, details.imageattr);
                                }
                            }
                            detailedRequest.send();
                        })
                    })
                }
                else{
                    alert("Error 400: Data fetch timed out due to bad request. Please try again.");
                };
            }
            filteredRequest.send();
        });
    });
});