document.addEventListener('DOMContentLoaded', function() {
    showLoader(true); 
    fetchQuotesWithAjax();
    fetchTutorialsWithAjax();
    fetchLatestVideos();
    fetchCoursesWithAjax();

    var searchInput = document.querySelector('.search-text-area');
    searchInput.addEventListener('input', function() {
        var searchText = this.value;
        currentFilter.q = searchText; 
        applyFilters(); 
    });
});

function fetchQuotesWithAjax() {
    const xhr = new XMLHttpRequest();
    const startTime = Date.now(); 
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
   
    showLoader(true);

    
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
          
            showLoader(false);
        };

        xhr.onerror = function() {
            console.error('Network error');
         
            showLoader(false);
        };

        xhr.send();
    }, 1000); 
}

function populateTutorials(tutorials) {
    const carouselInner = document.getElementById('popularCarouselInner');
    carouselInner.innerHTML = ''; 

   
    if (tutorials.length < 4) {
        console.error('Não há tutoriais suficientes para preencher o carrossel.');
        return;
    }

  
    for (let i = 0; i < tutorials.length - 3; i++) {
        let slide = document.createElement('div');
        slide.className = `carousel-item ${i === 0 ? 'active' : ''}`;
        let row = document.createElement('div');
        row.className = 'row';

       
        for (let j = i; j < i + 4; j++) {
           
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

function fetchLatestVideos() {
    showLoader(true);
    const xhr = new XMLHttpRequest();
    const startTime = Date.now(); 
    xhr.open('GET', 'https://smileschool-api.hbtn.info/latest-videos', true);

    xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            const videos = JSON.parse(this.responseText);
            const elapsedTime = Date.now() - startTime; 
            const delay = elapsedTime > 1000 ? 0 : 1000 - elapsedTime; 
            setTimeout(() => {
                populateLatestVideos(videos);
                showLoader(false);
            }, delay);
        } else {
            console.error('Error fetching latest videos:', this.statusText);
            showLoader(false);
        }
    };

    xhr.onerror = function() {
        console.error('Network error');
        showLoader(false);
    };

    xhr.send();
}

function populateLatestVideos(videos) {
    const carouselInner = document.getElementById('carouselExampleControls3').querySelector('.carousel-inner');
    carouselInner.innerHTML = '';

    const slidesNeeded = Math.ceil(videos.length / 4);

    for (let slideIndex = 0; slideIndex < slidesNeeded; slideIndex++) {
        const slide = document.createElement('div');
        slide.className = `carousel-item ${slideIndex === 0 ? 'active' : ''}`;
        const row = document.createElement('div');
        row.className = 'row align-items-center mx-auto';

        for (let i = 0; i < 4; i++) {
            const videoIndex = slideIndex * 4 + i;
            if (videoIndex >= videos.length) break;
            const video = videos[videoIndex];
            const col = document.createElement('div');
            col.className = 'col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center';
            col.innerHTML = `
                <div class="card">
                    <img src="${video.thumb_url}" class="card-img-top" alt="Video thumbnail">
                    <div class="card-img-overlay text-center">
                        <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${video.title}</h5>
                        <p class="card-text text-muted">${video['sub-title']}</p>
                        <div class="creator d-flex align-items-center">
                            <img src="${video.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle">
                            <h6 class="pl-3 m-0 main-color">${video.author}</h6>
                        </div>
                        <div class="info pt-3 d-flex justify-content-between">
                            <div class="rating">${generateStars(video.star)}</div>
                            <span class="main-color">${video.duration}</span>
                        </div>
                    </div>
                </div>`;
            row.appendChild(col);
        }

        slide.appendChild(row);
        carouselInner.appendChild(slide);
    }

    var carouselElement = document.querySelector('#carouselExampleControls3');
    var carouselInstance = new bootstrap.Carousel(carouselElement);
}

// for some reason when I made the api call to interpret the parametres I could not make this update reflect in a new call for the populate functions even if I could recive the response updated to serve the parametres passed. In other words, the function fetch (for a reason that I dont understand) could not call the function populate in any other time other than when the page was loaded. The solution I could think of was to make just one call to the api and populate an array with all the results and then I manipulate this array to respond to the filter that the user wants. Below the code that I made for this solution.

let allCoursesData = []; 
let currentFilter = { topic: 'all', sort: 'most popular' }; 

function fetchCoursesWithAjax() {
    showLoader(true);
    const xhr = new XMLHttpRequest();
    const url = 'https://smileschool-api.hbtn.info/courses';
    
    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            const data = JSON.parse(this.responseText);
            allCoursesData = data.courses; 
            populateTopicsAndSorts(data); 
            applyFilters(); 
            showLoader(false);
        } else {
           
            showLoader(false);
        }
    };

    xhr.onerror = function() {
      
        showLoader(false);
    };

    xhr.send();
}

function applyFilters() {
    let filteredCourses = allCoursesData;

    
    if (currentFilter.topic !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.topic.toLowerCase() === currentFilter.topic.toLowerCase());
    }

    
    if (currentFilter.q && currentFilter.q.trim() !== '') {
        filteredCourses = filteredCourses.filter(course => 
            course.keywords.some(keyword => keyword.toLowerCase().includes(currentFilter.q.toLowerCase()))
        );
    }

    if (currentFilter.sort === 'most_recent') {
        filteredCourses.sort((a, b) => new Date(b.published_at * 1000) - new Date(a.published_at * 1000)); // Multiplicamos por 1000 para converter timestamp Unix (segundos) para milissegundos
    } else if (currentFilter.sort === 'most_popular') {
        filteredCourses.sort((a, b) => b.star - a.star);
    } else if (currentFilter.sort === 'most_viewed') {
        filteredCourses.sort((a, b) => b.views - a.views);
    }

    populateVideos(filteredCourses);
}

function populateTopicsAndSorts(data) {
    const topicsDropdownButton = document.querySelector('#dropdownMenuLinkTopic');
    const topicsDropdown = document.querySelector('.dropdown-menu[aria-labelledby="dropdownMenuLinkTopic"]');
    const sortsDropdownButton = document.querySelector('#dropdownMenuLinkSort');
    const sortsDropdown = document.querySelector('.dropdown-menu[aria-labelledby="dropdownMenuLinkSort"]');

  
    updateDropdownButtonText(topicsDropdownButton, currentFilter.topic, data.topics);

 
    updateDropdownItems(topicsDropdown, data.topics, 'topic');

    
    updateDropdownButtonText(sortsDropdownButton, currentFilter.sort, data.sorts, true);

   
    updateDropdownItems(sortsDropdown, data.sorts, 'sort');
}

function updateDropdownItems(dropdownElement, filterOptions, filterType) {
    dropdownElement.innerHTML = ''; 
    filterOptions.forEach(option => {
        const item = document.createElement('a');
        item.className = 'dropdown-item';
        item.href = '#';
        item.textContent = option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ');
        item.addEventListener('click', function(e) {
            e.preventDefault();
            currentFilter[filterType] = option; 

            
            const buttonTextId = filterType === 'topic' ? 'dropdownMenuLinkTopic' : 'dropdownMenuLinkSort';
            updateDropdownButtonText(document.querySelector(`#${buttonTextId}`), option);

            applyFilters(); 
        });
        dropdownElement.appendChild(item);
    });
}

function updateDropdownButtonText(dropdownButton, selectedOption) {
   
    let displayText = selectedOption.replace(/_/g, ' ').charAt(0).toUpperCase() + selectedOption.slice(1).replace(/_/g, ' ');


    const spanElement = dropdownButton.querySelector('span');
    if (spanElement) {
        spanElement.textContent = displayText;
    } else {
        
        dropdownButton.textContent = displayText;
    }
}


function populateVideos(courses) {
    const row = document.getElementById('video-results');
    row.innerHTML = ''; 

    
    const videoCountSpan = document.querySelector('.video-count');
    videoCountSpan.textContent = `${courses.length} videos`; 

    courses.forEach(course => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-4 col-lg-3 d-flex justify-content-center';

        let cardHTML = `
            <div class="card">
                <img src="${course.thumb_url}" class="card-img-top" alt="${course.title}" />
                <div class="card-img-overlay text-center">
                    <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay" />
                </div>
                <div class="card-body">
                    <h5 class="card-title font-weight-bold">${course.title}</h5>
                    <p class="card-text text-muted">${course.sub_title}</p>
                    <div class="creator d-flex align-items-center">
                        <img src="${course.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
                        <h6 class="pl-3 m-0 main-color">${course.author}</h6>
                    </div>
                    <div class="info pt-3 d-flex justify-content-between">
                        <div class="rating">`;

        cardHTML += generateStars(course.star);

        cardHTML += `
                        </div>
                        <span class="main-color">${course.duration}</span>
                    </div>
                </div>
            </div>`;

        col.innerHTML = cardHTML;
        row.appendChild(col);
    });
}

function showLoader(show) {
    const loader = document.getElementById('globalLoader');
    loader.style.display = show ? 'block' : 'none';
}