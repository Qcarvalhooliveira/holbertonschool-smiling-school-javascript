document.addEventListener('DOMContentLoaded', function() {
    showLoader(true); 
    fetchQuotesWithAjax();
    fetchTutorialsWithAjax();
});

function fetchQuotesWithAjax() {
    const xhr = new XMLHttpRequest();
    const startTime = Date.now(); // we will simulate a delay to ensure that the loader is showing
    xhr.open('GET', 'https://smileschool-api.hbtn.info/quotes', true);

    xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            const data = JSON.parse(this.responseText);
            const elapsedTime = Date.now() - startTime; 
            const delay = elapsedTime > 1000 ? 0 : 1000 - elapsedTime; 
            setTimeout(() => { 
                populateWithQuotes(data);
                showLoader(false);
            }, delay);
        } else {
            
            console.error('Error fetching quotes:', this.statusText);
            showLoader(false);
        }
    };

    xhr.onerror = function() {
        
        console.error('Network error');
        showLoader(false);
    };

    xhr.send();
}

function populateWithQuotes(quotes) {
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

function fetchTutorialsWithAjax() {
    // Mostrar o loader antes de iniciar a chamada AJAX
    showLoader(true);

    // Iniciar a chamada AJAX após um delay de 1 segundo
    setTimeout(() => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://smileschool-api.hbtn.info/popular-tutorials', true);

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const tutorials = JSON.parse(this.responseText);
                populateTutorials(tutorials);
            } else {
                console.error('Error fetching tutorials:', this.statusText);
            }
            // Esconder o loader após receber a resposta
            showLoader(false);
        };

        xhr.onerror = function() {
            console.error('Network error');
            // Esconder o loader em caso de erro na rede
            showLoader(false);
        };

        xhr.send();
    }, 1000); // Delay de 1 segundo
}

function populateTutorials(tutorials) {
    const carouselInner = document.getElementById('popularCarouselInner');
    carouselInner.innerHTML = ''; // Limpar o conteúdo existente

    // Certifique-se de que haja pelo menos 4 tutoriais para começar a criação dos slides
    if (tutorials.length < 4) {
        console.error('Não há tutoriais suficientes para preencher o carrossel.');
        return;
    }

    // Criar os slides
    for (let i = 0; i < tutorials.length - 3; i++) {
        let slide = document.createElement('div');
        slide.className = `carousel-item ${i === 0 ? 'active' : ''}`;
        let row = document.createElement('div');
        row.className = 'row';

        // Adicionando 4 elementos por slide
        for (let j = i; j < i + 4; j++) {
            // Verificar se o índice existe na lista de tutoriais
            if (tutorials[j]) {
                const tutorial = tutorials[j];
                const col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center';
                col.innerHTML = `
                    <div class="card">
                        <img src="${tutorial.thumb_url}" class="card-img-top" alt="Video thumbnail">
                        <div class="card-img-overlay text-center">
                            <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title font-weight-bold">${tutorial.title}</h5>
                            <p class="card-text text-muted">${tutorial['sub-title']}</p>
                            <div class="creator d-flex align-items-center">
                                <img src="${tutorial.author_pic_url}" alt="${tutorial.author}" width="30px" class="rounded-circle">
                                <h6 class="pl-3 m-0 main-color">${tutorial.author}</h6>
                            </div>
                            <div class="info pt-3 d-flex justify-content-between">
                                <div class="rating">${generateStars(tutorial.star)}</div>
                                <span class="main-color">${tutorial.duration}</span>
                            </div>
                        </div>
                    </div>`;
                row.appendChild(col);
            }
        }

        slide.appendChild(row);
        carouselInner.appendChild(slide);
    }

    // Inicializar ou atualizar o carrossel Bootstrap
    var carouselElement = document.querySelector('#carouselExampleControls2');
    var carouselInstance = new bootstrap.Carousel(carouselElement, {
        interval: 5000,
        wrap: true
    });
}


function generateStars(starCount) {
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        starsHTML += `<img src="images/star_${i < starCount ? 'on' : 'off'}.png" alt="star" width="15px">`;
    }
    return starsHTML;
}

function showLoader(show) {
    const loader = document.getElementById('globalLoader');
    loader.style.display = show ? 'block' : 'none';
}
