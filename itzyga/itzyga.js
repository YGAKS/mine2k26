document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
});

const loaderScreen = document.getElementById('loaderScreen');
const loaderFill = document.getElementById('loaderFill');
let loadProgress = 0;

const loaderInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 8) + 3;
    if (loadProgress >= 100) {
        loadProgress = 100;
        loaderFill.style.width = '100%';
        clearInterval(loaderInterval);
        
        setTimeout(() => {
            if (loaderScreen) {
                loaderScreen.classList.add('fade-out');
            }
        }, 300);
    } else {
        loaderFill.style.width = `${loadProgress}%`;
    }
}, 40);

window.addEventListener('load', () => {
    loadProgress = 100;
    loaderFill.style.width = '100%';
});

const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section.snap-page');
const navItems = document.querySelectorAll('.nav-item');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const scrollPercentText = document.getElementById('scrollPercentText');

let currentPercent = 0;
let counterInterval = null;

function animatePercent(targetValue) {
    if (currentPercent === targetValue) return;

    clearInterval(counterInterval);
    
    const duration = 400;
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = (targetValue - currentPercent) / steps;

    counterInterval = setInterval(() => {
        currentPercent += increment;
        
        if ((increment > 0 && currentPercent >= targetValue) || (increment < 0 && currentPercent <= targetValue)) {
            currentPercent = targetValue;
            scrollPercentText.innerText = `${Math.round(currentPercent)}%`;
            clearInterval(counterInterval);
        } else {
            scrollPercentText.innerText = `${Math.round(currentPercent)}%`;
        }
    }, stepTime);
}

function scrambleText(element, onComplete) {
    const originalText = element.getAttribute('data-original');
    const lettersOnly = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iteration = 0;
    
    clearInterval(element.scrambleInterval);

    element.scrambleInterval = setInterval(() => {
        element.innerHTML = originalText
            .split('')
            .map((char, index) => {
                if (char === ' ' || char === '.' || char === '&' || char === '\'') return char;
                if (index < iteration) {
                    return originalText[index];
                }
                return lettersOnly[Math.floor(Math.random() * lettersOnly.length)];
            })
            .join('');

        if (iteration >= originalText.length) {
            element.innerHTML = originalText;
            clearInterval(element.scrambleInterval);
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }

        iteration += 1;
    }, 15);
}

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', scrollToAbout);
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', scrollToTop);
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.51
};

const sectionPercents = {
    'home': 0,
    'about': 33,
    'project': 66,
    'contact': 100
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            sections.forEach(s => {
                s.classList.remove('active-section');
                s.classList.remove('animate-in');
            });
            
            entry.target.classList.add('active-section');

            navItems.forEach(item => {
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            if (id === 'contact') {
                scrollTopBtn.classList.add('is-footer');
                animatePercent(100);
            } else {
                scrollTopBtn.classList.remove('is-footer');
                const targetVal = sectionPercents[id] !== undefined ? sectionPercents[id] : 0;
                animatePercent(targetVal);
            }

            const titleToScramble = entry.target.querySelector('.scramble-title');
            if (titleToScramble) {
                scrambleText(titleToScramble, () => {
                    entry.target.classList.add('animate-in');
                });
            } else {
                entry.target.classList.add('animate-in');
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

const projectLayout = document.getElementById('projectLayout');
const dots = document.querySelectorAll('.dot');

if (projectLayout) {
    projectLayout.addEventListener('scroll', () => {
        const scrollLeft = projectLayout.scrollLeft;
        const width = projectLayout.clientWidth;
        const activeIndex = Math.round(scrollLeft / width);
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });
}
