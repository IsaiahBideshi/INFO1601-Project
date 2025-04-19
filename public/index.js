const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYWNkZWEwYWE0NWI0YjQ4NzUwNDBlOTFlYTMyNDMzZiIsIm5iZiI6MTc0MzM1NjI1Ny4wMzQsInN1YiI6IjY3ZTk4MTYxNzAwYTZhOTRjNmU1NjFhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZfUp1LrNIcQ2Q0pIZSYP5P1YgMaksjF50ckc6qoaiBg'
    }
};
let movies = [];
async function fetchPopularMovies() {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
        const data = await response.json();
        movies = data.results.slice(0, 5);

        // Populate slideshow after movies are fetched
        const slideshow = document.getElementById("slideshow");
        movies.forEach((movie, index) => {
            const slide = document.createElement("div");
            slide.className = "slide";
            if (index === 0) slide.classList.add("active");

            slide.innerHTML = `
            <div class="backdrop" style="background-image: url('https://image.tmdb.org/t/p/original${movie.backdrop_path}');"></div>
            <div class="content">
                <img class="poster" src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title} poster" />
                <div class="text">
                    <h2>${movie.title}</h2>
                    <p>${movie.overview}</p>
                </div>
            </div>
            `;
            slideshow.appendChild(slide);
        });

        // Reinitialize slides after they are added
        initializeSlideshow();
    } catch (error) {
        console.error("Error fetching popular movies:", error);
    }
}

function initializeSlideshow() {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");

    function showSlide(index) {
        slides[currentSlide].classList.remove("active");
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
    }

    // Auto-transition
    let autoSlide = setInterval(() => showSlide(currentSlide + 1), 5000);

    // Buttons
    document.getElementById("nextBtn").addEventListener("click", () => {
        clearInterval(autoSlide);
        showSlide(currentSlide + 1);
        autoSlide = setInterval(() => showSlide(currentSlide + 1), 5000);
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        clearInterval(autoSlide);
        showSlide(currentSlide - 1);
        autoSlide = setInterval(() => showSlide(currentSlide + 1), 5000);
    });
}

fetchPopularMovies();