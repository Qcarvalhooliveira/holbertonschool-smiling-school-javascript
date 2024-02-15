document.addEventListener('DOMContentLoaded', function() {
    showLoader(true); 
    fetchQuotes();
});

function fetchQuotes() {
    const startTime = Date.now(); // since the api response is fast we will simulate a delay to show loader for 1 second
    fetch('https://smileschool-api.hbtn.info/quotes')
        .then(response => response.json())
        .then(data => {
            const elapsedTime = Date.now() - startTime; 
            const delay = elapsedTime > 1000 ? 0 : 1000 - elapsedTime; 
            setTimeout(() => { 
                populateCarousel(data);
                showLoader(false); 
            }, delay);
        })
        .catch(error => {
            console.error('Error fetching quotes:', error);
            showLoader(false);
        });
}

function populateCarousel(quotes) {
    const carouselInner = document.getElementById('quotesCarousel');
    carouselInner.innerHTML = '';
    quotes.forEach((quote, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <div class="row mx-auto align-items-center">
                <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                    <img src="${quote.pic_url}" class="d-block align-self-center" alt="Profile Picture">
                </div>
                <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                    <div class="quote-text">
                        <p class="text-white">${quote.text}</p>
                        <h4 class="text-white font-weight-bold">${quote.name}</h4>
                        <span class="text-white">${quote.title}</span>
                    </div>
                </div>
            </div>
        `;
        carouselInner.appendChild(item);
    });
}

function showLoader(show) {
    const loader = document.getElementById('quotesLoader');
    loader.style.display = show ? 'block' : 'none';
}
