feather.replace();

document.getElementById("year").textContent = new Date().getFullYear();

// Back to Top Button functionality
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible');
        backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
        backToTopBtn.classList.remove('opacity-100', 'visible');
        backToTopBtn.classList.add('opacity-0', 'invisible');
    }
});

backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Portfolio items hover effect
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(10px)';
    });
    item.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0)';
    });
});

const jobTitles = [
    "IT Support",
    "Junior Frontend Developer",
    "Fiber Optic Technician",
    "UI/UX Designer"
];

let currentIndex = 0;
const jobTitleElement = document.getElementById('jobTitle');

function changeJobTitle() {
    // Fade out and scale down
    jobTitleElement.style.opacity = '0';
    jobTitleElement.style.transform = 'translateY(-20px) scale(0.95)';

    setTimeout(() => {
        // Change text
        currentIndex = (currentIndex + 1) % jobTitles.length;
        jobTitleElement.textContent = jobTitles[currentIndex];

        // Fade in and scale up
        setTimeout(() => {
            jobTitleElement.style.opacity = '1';
            jobTitleElement.style.transform = 'translateY(0) scale(1)';
        }, 50);
    }, 500);
}

// Start animation
setInterval(changeJobTitle, 3500);