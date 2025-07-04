/*
 * Portfolio Website JavaScript
 * Clean, organized code for navigation, interactions, and features
 * Author: Rania Jarral
 */

// =============================================================================
// GLOBAL VARIABLES AND DOM ELEMENTS
// =============================================================================

const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const navHeader = document.querySelector('.nav-header');
let isDropdownOpen = false;
let lastScrollTop = 0;
let scrollTimeout = null;

// =============================================================================
// SEARCH AND NAVIGATION FUNCTIONALITY
// =============================================================================

/**
 * Toggle search dropdown visibility
 */
function toggleDropdown() {
    if (isDropdownOpen) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

/**
 * Open search dropdown
 */
function openDropdown() {
    searchDropdown.classList.add('show');
    isDropdownOpen = true;
}

/**
 * Close search dropdown
 */
function closeDropdown() {
    searchDropdown.classList.remove('show');
    isDropdownOpen = false;
}

/**
 * Update active navigation indicator based on scroll position
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Update search input placeholder based on current section
    const sectionNames = {
        'hero': 'Currently viewing: Home',
        'about': 'Currently viewing: About Me',
        'services': 'Currently viewing: Services',
        'portfolio': 'Currently viewing: Portfolio',
        'contact': 'Currently viewing: Contact'
    };
    
    if (current && sectionNames[current]) {
        searchInput.placeholder = sectionNames[current];
    } else {
        searchInput.placeholder = 'Navigate to section...';
    }
}

// =============================================================================
// SCROLL BEHAVIOR AND HEADER MANAGEMENT
// =============================================================================

/**
 * Handle header visibility on scroll with performance optimization
 */
function handleHeaderScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
        // Scrolling down - hide header
        navHeader.classList.add('nav-hidden');
        closeDropdown(); // Close dropdown when hiding nav
    } else {
        // Scrolling up - show header
        navHeader.classList.remove('nav-hidden');
    }
    
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    updateActiveNav();
}

// =============================================================================
// TAB NAVIGATION (ABOUT SECTION)
// =============================================================================

/**
 * Handle tab switching in About section
 */
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Add active class to clicked button
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

/**
 * Initialize tab functionality for About section
 */
function initializeTabs() {
    // Set first tab as active by default
    const firstTabButton = document.querySelector('.tab-button');
    const firstTabContent = document.querySelector('.tab-content');
    
    if (firstTabButton && firstTabContent) {
        firstTabButton.classList.add('active');
        firstTabContent.classList.add('active');
    }
    
    // Add click event listeners to all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            if (tabName) {
                switchTab(tabName);
            }
        });
    });
}

// =============================================================================
// EMAIL FUNCTIONALITY
// =============================================================================

/**
 * Handle email contact with device-specific behavior
 * Desktop: Opens Gmail web interface
 * Mobile: Uses mailto to open default email app
 */
function handleEmailClick(event) {
    event.preventDefault();
    
    const email = 'raniajarralyt@gmail.com';
    const subject = 'Portfolio Inquiry';
    const body = 'Hi Rania,%0A%0AI found your portfolio and would like to discuss!';
    
    // Device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
    const isSmallScreen = window.innerWidth <= 768;
    
    if (isMobile || isSmallScreen) {
        // Mobile: Use mailto to open default email app
        const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
    } else {
        // Desktop: Open Gmail in browser
        const gmailLink = `https://mail.google.com/mail/?view=cm&to=${email}&subject=${subject}&body=${body}`;
        window.open(gmailLink, '_blank', 'noopener,noreferrer');
    }
}

// =============================================================================
// ANIMATION AND INTERSECTION OBSERVER
// =============================================================================

/**
 * Intersection Observer for smooth animations
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

/**
 * Initialize animations for elements in viewport
 */
function initializeAnimations() {
    // Observe all animated elements
    document.querySelectorAll('.animate-fade-in, .animate-slide-in, section, .tech-category, .contact-icon-link').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Run animations immediately for elements already in viewport
    setTimeout(() => {
        document.querySelectorAll('.animate-fade-in, .animate-slide-in').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.style.animationPlayState = 'running';
            }
        });
    }, 100);
}

// =============================================================================
// PERFORMANCE OPTIMIZATIONS
// =============================================================================

/**
 * Preload critical resources for better performance
 */
function preloadResources() {
    const criticalImages = [
        'picture/pfp4.jpg',
        'picture/admin.png',
        'picture/connect.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

// Search functionality
searchInput.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleDropdown();
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        closeDropdown();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            closeDropdown();
        }
    });
});

// Optimized scroll event handling
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            handleHeaderScroll();
            scrollTimeout = null;
        }, 10);
    }
});

// Window resize handler
window.addEventListener('resize', debounce(updateActiveNav, 100));

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Global error handler for graceful degradation
 */
window.addEventListener('error', function(e) {
    console.warn('Non-critical error occurred:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.warn('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initializeTabs();
    initializeAnimations();
    preloadResources();
    updateActiveNav();
    
    console.log('Portfolio website initialized successfully!');
});
