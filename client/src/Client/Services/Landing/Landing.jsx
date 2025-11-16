// UTILS

 
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
// eslint-disable-next-line
import React, { useEffect, useState, useRef } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'

// NAVBAR
import Navbar from '../../Components/Navbar'

// IMAGES
import fits from './Assets/fits.jpg'
import img1 from './Assets/1.webp'
import img2 from './Assets/2.webp'
import img3 from './Assets/3.webp'
import img4 from './Assets/4.webp'
import img5 from './Assets/rabies.webp'
import logo from './Assets/Logo.svg'
import i1 from './Assets/i1.webp'
import i2 from './Assets/i2.webp'
import i3 from './Assets/i3.webp'
import i4 from './Assets/i4.webp'

export default function Landing() {
    const { theme } = useTheme()
    
    // Preload hero images to prevent white flash on transition
    useEffect(() => {
        const images = [
            // If heroSlides is not yet defined, use the same image variables as in heroSlides
            i1, i3, i2, i4
        ];
        images.forEach(src => {
            const img = new window.Image();
            img.src = src;
        });
    }, []);
    // Inject Google Fonts Poppins if not already present
    if (typeof document !== 'undefined' && !document.getElementById('poppins-font')) {
        const link = document.createElement('link');
        link.id = 'poppins-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
    }
    // Responsive card count state
    const [cardsToShow, setCardsToShow] = useState(window.innerWidth < 640 ? 1 : 4);

    useEffect(() => {
        const handleResize = () => {
            setCardsToShow(window.innerWidth < 640 ? 1 : 4);
        };
        window.addEventListener('resize', handleResize);
        // Initial set
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // Slider state
    const programs = [
        {
            img: img1,
            title: "FITS Program",
            desc: "The Farmers' Information and Technology Services (FITS) Program delivers timely agricultural information and technology to empower farmers and stakeholders.",
            status: "Ongoing"
        },
        {
            img: img2,
            title: "Crop Production",
            desc: "Enhancing crop production through innovative techniques, research, and farmer education for sustainable agriculture.",
            status: "Available"
        },
        {
            img: img5,
            title: "Rabies Control",
            desc: "Implementing comprehensive rabies prevention and control initiatives to safeguard public health and animal welfare.",
            status: "Upcoming"
        },
        {
            img: img3,
            title: "Fisheries Program",
            desc: "Promoting responsible fisheries management and aquaculture to ensure sustainable livelihoods and healthy aquatic ecosystems.",
            status: "Ongoing"
        },
        {
            img: img4,
            title: "Organic Farming",
            desc: "Advancing organic farming practices for healthier produce, environmental stewardship, and improved farmer well-being.",
            status: "Available"
        },
        {
            img: img5,
            title: "Rabies Control",
            desc: "Implementing comprehensive rabies prevention and control initiatives to safeguard public health and animal welfare.",
            status: "Completed"
        },
    ];


    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [isAnimating, setIsAnimating] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const timeoutRef = useRef();

    const prevSlide = () => {
        if (isAnimating) return;
        setDirection(-1);
        setIsAnimating(true);
        timeoutRef.current = setTimeout(() => {
            setCurrent((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
            setIsAnimating(false);
        }, 350);
    };

    const nextSlide = () => {
        if (isAnimating) return;
        setDirection(1);
        setIsAnimating(true);
        timeoutRef.current = setTimeout(() => {
            setCurrent((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
            setIsAnimating(false);
        }, 350);
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    // Enhanced Animation on scroll with multiple animation types
    useEffect(() => {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animateElement = (element, animationType) => {
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            switch (animationType) {
                case 'fade-up':
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0px)';
                    break;
                case 'fade-down':
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0px)';
                    break;
                case 'fade-left':
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0px)';
                    break;
                case 'fade-right':
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0px)';
                    break;
                case 'zoom-in':
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                    break;
                case 'zoom-out':
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                    break;
                case 'flip-up':
                    element.style.opacity = '1';
                    element.style.transform = 'rotateX(0deg)';
                    break;
                case 'slide-up':
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0px)';
                    break;
                default:
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0px)';
            }
        };

        const initializeElement = (element, animationType) => {
            element.style.opacity = '0';
            
            switch (animationType) {
                case 'fade-up':
                    element.style.transform = 'translateY(30px)';
                    break;
                case 'fade-down':
                    element.style.transform = 'translateY(-30px)';
                    break;
                case 'fade-left':
                    element.style.transform = 'translateX(-30px)';
                    break;
                case 'fade-right':
                    element.style.transform = 'translateX(30px)';
                    break;
                case 'zoom-in':
                    element.style.transform = 'scale(0.8)';
                    break;
                case 'zoom-out':
                    element.style.transform = 'scale(1.2)';
                    break;
                case 'flip-up':
                    element.style.transform = 'rotateX(-90deg)';
                    element.style.transformOrigin = 'bottom';
                    break;
                case 'slide-up':
                    element.style.transform = 'translateY(50px)';
                    break;
                default:
                    element.style.transform = 'translateY(30px)';
            }
        };

        // Initialize all elements
        animatedElements.forEach(element => {
            const animationType = element.getAttribute('data-aos');
            initializeElement(element, animationType);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-aos');
                    const delay = element.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        animateElement(element, animationType);
                    }, parseInt(delay));
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Fallback for legacy reveal-on-scroll elements
        const legacyElements = document.querySelectorAll('.reveal-on-scroll');
        const handleScroll = () => {
            legacyElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 80) {
                    el.classList.add('opacity-100', 'translate-y-0');
                }
            });
        };
        
        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Back to top button visibility detection
    useEffect(() => {
        const handleBackToTopScroll = () => {
            const footer = document.querySelector('footer');
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                // Show button when footer is visible (top of footer is within viewport)
                setShowBackToTop(footerRect.top <= windowHeight);
            }
        };

        window.addEventListener('scroll', handleBackToTopScroll);
        // Initial check
        handleBackToTopScroll();

        return () => window.removeEventListener('scroll', handleBackToTopScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Hero slideshow state
    const heroSlides = [
        { img: i1, desc: 'Advancing sustainable agriculture and community well-being through innovation and dedicated support.' },
        { img: i3, desc: 'Supporting sustainable crop production through modern techniques, research, and farmer education.' },
        { img: i2, desc: 'Promoting eco-friendly practices and healthier produce for the community.' },
        { img: i4, desc: 'Sustainability begins not with the tools we use, but with the values we sow.' },
    ];
    const [heroIndex, setHeroIndex] = useState(0);
    const heroTimeout = useRef();

    // Automatic slide
    useEffect(() => {
        heroTimeout.current && clearTimeout(heroTimeout.current);
        heroTimeout.current = setTimeout(() => {
            setHeroIndex((prev) => (prev + 1) % heroSlides.length);
        }, 4000);
        return () => heroTimeout.current && clearTimeout(heroTimeout.current);
    }, [heroIndex]);

    const handlePrevHero = () => {
        setHeroIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    };
    const handleNextHero = () => {
        setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    };

    // Replace all green color classes with blue equivalents
    return (
        <>
            <Navbar />
            <main className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {/* HERO SECTION - FLEX WITH VIDEO */}
                <section className={`relative mb-0 mt-0 min-h-[800px] flex items-center justify-center px-[8vw] font-poppins ${theme === 'dark' ? 'bg-gray-900' : 'bg-green-50'}`}>
                
                <img
                    src={fits}
                    alt="Soil texture overlay"
                    className="absolute left-0 bottom-0 w-full h-[800px] object-cover opacity-20 pointer-events-none z-10 "
                    style={{mixBlendMode: 'multiply'}}
                />
                {/* Responsive flex: column on small screens, row on md+ */}
                <div className="flex flex-col  md:flex-row w-full items-center justify-center">
                    {/* Left: Professional Headline and Description */}
                    <div className="flex-1 pr-[2vw] min-w-[320px] relative z-30 w-full md:w-auto">
                        {/* Premium badge */}
                        <div className={`inline-flex items-center gap-2 mt-[25%] sm:mt-0 border rounded-full px-4 py-2 mb-6 ${theme === 'dark' ? 'bg-gray-800 border-green-400 text-green-400' : 'bg-green-50 border-green-200 text-green-700'}`} data-aos="fade-right" data-aos-delay="100">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'}`}></div>
                            <span className="font-semibold text-sm uppercase tracking-wide">
                                Transforming Agriculture
                            </span>
                        </div>
                        
                        {/* Enhanced title with modern typography */}
                        <h1 className={`font-montserrat font-black text-[2.5rem] md:text-[4rem] lg:text-[4.5rem] m-0 leading-[0.9] tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} data-aos="fade-up" data-aos-delay="200">
                            Empowering{' '}
                            <span className={`text-transparent bg-clip-text animate-gradient-x ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600' : 'bg-gradient-to-r from-green-600 via-green-700 to-green-800'}`}>
                                Agriculture
                            </span>
                            <br />
                            <span className={`text-[2rem] md:text-[3rem] lg:text-[3.5rem] font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Enriching Lives
                            </span>
                        </h1>
                        
                        {/* Professional description */}
                        <p className={`font-poppins text-lg md:text-xl mt-6 max-w-2xl font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} data-aos="fade-up" data-aos-delay="300">
                            Discover innovative agricultural solutions, connect with expert farmers, and access cutting-edge technology to{' '}
                            <span className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>transform your farming journey</span> today.
                        </p>
                        
                        {/* Professional CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-10" data-aos="fade-up" data-aos-delay="400">
                            <button
                                className={`group relative overflow-hidden text-white border-none rounded-2xl px-8 py-4 font-bold text-lg cursor-pointer font-poppins shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform ${theme === 'dark' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'}`}
                                onClick={() => window.location = '/seminar'}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Explore Programs
                                </span>
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-green-500 to-green-600'}`}></div>
                            </button>
                            
                            <button
                                className={`group relative border-2 rounded-2xl px-8 py-4 font-semibold text-lg cursor-pointer font-poppins shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 transform ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600 hover:border-green-400' : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 hover:border-green-500'}`}
                                onClick={() => window.location = '/about'}
                            >
                                <span className={`flex items-center justify-center gap-3 transition-colors duration-300 ${theme === 'dark' ? 'group-hover:text-green-400' : 'group-hover:text-green-700'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Learn More
                                </span>
                            </button>
                        </div>
                        
                        {/* Trust indicators */}
                    
                    </div>
                    {/* Right: Enhanced Professional Slideshow */}
                    <div className="flex-1 flex items-center min-w-[320px] w-full md:w-auto mt-10 md:mt-0 justify-end relative z-40" data-aos="fade-left" data-aos-delay="500">
                        <div className={`relative w-full h-[260px] md:h-[650px] max-w-[720px] border rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center -mt-4 md:-mt-16 group z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            
                            {/* Professional slideshow with enhanced transitions */}
                            <div className={`relative w-full h-full overflow-hidden rounded-3xl z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                {heroSlides.map((slide, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 transition-all duration-1000 ease-in-out z-50 ${
                                            heroIndex === idx 
                                                ? 'opacity-100 scale-100' 
                                                : 'opacity-0 scale-105'
                                        }`}
                                        style={{
                                            transform: heroIndex === idx ? 'scale(1)' : 'scale(1.05)',
                                            filter: heroIndex === idx ? 'brightness(1) contrast(1.05)' : 'brightness(0.8)',
                                            backgroundColor: '#ffffff',
                                            zIndex: heroIndex === idx ? 60 : 55
                                        }}
                                    >
                                        <img
                                            src={slide.img}
                                            alt={slide.desc}
                                            className="w-full h-full object-cover bg-white relative z-60"
                                            style={{
                                                filter: 'contrast(1.1) saturate(1.1) brightness(0.95)',
                                                backgroundColor: '#ffffff'
                                            }}
                                        />
                                        {/* Professional gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-900/10"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Professional navigation controls */}
                            <div className="absolute top-6 right-6 z-70 flex gap-3 translate-y-5">
                                <button
                                    className={`backdrop-blur-sm hover:bg-white/30 text-white rounded-xl p-3 transition-all duration-300 hover:scale-110 shadow-lg border ${theme === 'dark' ? 'bg-gray-900/40 border-gray-700' : 'bg-white/20 border-white/20'}`}
                                    onClick={handlePrevHero}
                                    aria-label="Previous Slide"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    className={`backdrop-blur-sm hover:bg-white/30 text-white rounded-xl p-3 transition-all duration-300 hover:scale-110 shadow-lg border ${theme === 'dark' ? 'bg-gray-900/40 border-gray-700' : 'bg-white/20 border-white/20'}`}
                                    onClick={handleNextHero}
                                    aria-label="Next Slide"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Professional caption with modern typography */}
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-8 py-8 text-white z-70">
                                <div className="max-w-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-green-500' : 'bg-green-600'}`}>
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <span className={`font-semibold text-sm uppercase tracking-wide ${theme === 'dark' ? 'text-green-300' : 'text-green-400'}`}>
                                            Feature Highlight
                                        </span>
                                    </div>
                                    <p className="font-poppins font-medium text-lg md:text-xl leading-relaxed text-white/95">
                                        {heroSlides[heroIndex].desc}
                                    </p>
                                </div>
                            </div>

                            {/* Modern progress indicators */}
                            <div className="absolute bottom-6 right-6 z-70 flex gap-2 ">
                                {heroSlides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setHeroIndex(idx)}
                                        className={`transition-all duration-300 rounded-full ${
                                            heroIndex === idx 
                                                ? 'w-8 h-2 bg-white shadow-lg' 
                                                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                                        }`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Slide counter */}
                            <div className={`absolute top-6 left-6 z-70 backdrop-blur-sm rounded-lg px-3 py-2 text-white translate-y-5 text-sm font-medium ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-black/30'}`}>
                                <span className={theme === 'dark' ? 'text-green-300' : 'text-green-400'}>{heroIndex + 1}</span>
                                <span className="text-white/70 mx-1">/</span>
                                <span className="text-white/70">{heroSlides.length}</span>
                            </div>

                            

                            {/* Professional border glow effect */}
                            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 ring-inset pointer-events-none"></div>
                        </div>
                    </div>
                </div>
                </section>

            {/* MISSION & VISION - Professional Redesign */}
            <section className={`py-12 mt-0 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-green-50/30'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {/* Premium background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-10 left-10 w-48 h-48 rounded-full blur-3xl ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100/40'}`}></div>
                    <div className={`absolute bottom-10 right-10 w-64 h-64 rounded-full blur-3xl ${theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-100/30'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl ${theme === 'dark' ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10' : 'bg-gradient-to-r from-green-50/20 to-emerald-50/20'}`}></div>
                </div>

                {/* Section header */}
                <div className="text-center mb-12 relative z-10 mt-6">
                
                    <h2 className={`text-2xl md:text-3xl lg:text-4xl font-black mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} data-aos="fade-up" data-aos-delay="200">
                        Our <span className={`text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-600 to-emerald-600'}`}>Purpose</span> & Vision
                    </h2>
                    <p className={`text-base max-w-2xl mx-auto font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} data-aos="fade-up" data-aos-delay="300">
                        Driving agricultural innovation and community empowerment through sustainable solutions.
                    </p>
                </div>
               
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
                        
                        {/* Mission Card - Enhanced */}
                        <div className="group relative h-full" data-aos="fade-right" data-aos-delay="400">
                            {/* Premium card container */}
                            <div className={`relative backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border hover:shadow-2xl transition-all duration-500 hover:scale-105 transform h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}`}>
                                
                                {/* Premium icon container */}
                                <div className="relative mb-6">
                                    <div className={`w-16 h-16 rounded-xl shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-500' : 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-600'}`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    {/* Floating accent */}
                                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full opacity-80 group-hover:scale-125 transition-transform duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-300 to-green-400' : 'bg-gradient-to-br from-emerald-400 to-green-500'}`}></div>
                                </div>
                                
                                {/* Content */}
                                <div className="space-y-4 flex-grow">
                                    <div>
                                        <h3 className={`text-xl lg:text-2xl font-black mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mission</h3>
                                        <div className={`w-12 h-1 rounded-full ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>
                                    </div>
                                    
                                    <p className={`text-sm lg:text-base leading-relaxed font-medium min-h-[4rem] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        To drive <span className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>sustainable agricultural growth</span> and elevate community livelihoods through innovative solutions, transformative education, and <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>collaborative partnerships</span>.
                                    </p>
                                    
                                    {/* Key points */}
                                    <div className="space-y-2 pt-2">
                                        {[
                                            'Sustainable Growth',
                                            'Community Empowerment', 
                                            'Innovation Excellence'
                                        ].map((point, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>
                                                <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Hover overlay */}
                                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-br from-green-400/5 via-transparent to-emerald-400/5' : 'bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5'}`}></div>
                            </div>
                        </div>

                        {/* Vision Card - Enhanced */}
                        <div className="group relative h-full" data-aos="fade-left" data-aos-delay="500">
                            {/* Premium card container */}
                            <div className={`relative backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border hover:shadow-2xl transition-all duration-500 hover:scale-105 transform h-full flex flex-col ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'}`}>
                                
                                {/* Premium icon container */}
                                <div className="relative mb-6">
                                    <div className={`w-16 h-16 rounded-xl shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-500' : 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600'}`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    {/* Floating accent */}
                                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full opacity-80 group-hover:scale-125 transition-transform duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-green-300 to-emerald-400' : 'bg-gradient-to-br from-green-400 to-emerald-500'}`}></div>
                                </div>
                                
                                {/* Content */}
                                <div className="space-y-4 flex-grow">
                                    <div>
                                        <h3 className={`text-xl lg:text-2xl font-black mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Vision</h3>
                                        <div className={`w-12 h-1 rounded-full ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-400 to-green-400' : 'bg-gradient-to-r from-emerald-500 to-green-500'}`}></div>
                                    </div>
                                    
                                    <p className={`text-sm lg:text-base leading-relaxed font-medium min-h-[4rem] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        To be a <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>catalyst for agricultural transformation</span>, fostering innovation and building resilient, <span className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>thriving communities</span> for generations to come.
                                    </p>
                                    
                                    {/* Key points */}
                                    <div className="space-y-2 pt-2">
                                        {[
                                            'Agricultural Leadership',
                                            'Innovation Catalyst',
                                            'Community Resilience'
                                        ].map((point, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-400 to-green-400' : 'bg-gradient-to-r from-emerald-500 to-green-500'}`}></div>
                                                <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Hover overlay */}
                                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-400/5 via-transparent to-green-400/5' : 'bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5'}`}></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom stats/achievements */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { number: '5+', label: 'Years of Excellence', icon: '🏆' },
                            { number: '1,200+', label: 'Farmers Supported', icon: '👥' },
                            { number: '50+', label: 'Communities Served', icon: '🌍' },
                            { number: '98%', label: 'Success Rate', icon: '📈' }
                        ].map((stat, idx) => (
                            <div key={idx} className="group">
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className={`text-xl lg:text-2xl font-black text-transparent bg-clip-text mb-1 ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-600 to-emerald-600'}`}>
                                    {stat.number}
                                </div>
                                <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROGRAMS - Professional Design */}
            <section id="programs" className={`py-12 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/90 via-gray-900/80 to-gray-800/60' : 'bg-gradient-to-br from-green-100/90 via-emerald-100/80 to-green-200/60'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {/* Premium background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-10 left-10 w-48 h-48 rounded-full blur-3xl ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-200/30'}`}></div>
                    <div className={`absolute bottom-10 right-10 w-60 h-60 rounded-full blur-3xl ${theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-200/25'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full blur-3xl ${theme === 'dark' ? 'bg-gradient-to-r from-green-500/15 to-emerald-500/10' : 'bg-gradient-to-r from-green-100/30 to-emerald-100/25'}`}></div>
                </div>

                {/* Section header */}
                <div className="text-center mt-6 mb-10 relative z-10">
                  
                    <h2 className={`text-2xl md:text-3xl font-black mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} data-aos="fade-up" data-aos-delay="200">
                        Professional <span className={`text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-600 to-emerald-600'}`}>Programs</span>
                    </h2>
                    <p className={`text-base max-w-2xl mx-auto font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} data-aos="fade-up" data-aos-delay="300">
                        Comprehensive training and development programs designed to elevate agricultural excellence.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    {/* Professional Horizontal Scroller */}
                    <div className="relative">
                        {/* Enhanced Left scroll button */}
                        <button
                            onClick={() => {
                                const container = document.getElementById('programs-scroller');
                                container.scrollBy({ left: -300, behavior: 'smooth' });
                            }}
                            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border ${theme === 'dark' ? 'bg-gray-800/95 hover:bg-gray-700 text-green-400 hover:text-green-300 border-gray-600' : 'bg-white/95 hover:bg-white text-green-600 hover:text-green-700 border-green-100'}`}
                            aria-label="Scroll left"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Enhanced Right scroll button */}
                        <button
                            onClick={() => {
                                const container = document.getElementById('programs-scroller');
                                container.scrollBy({ left: 300, behavior: 'smooth' });
                            }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full w-12 h-12 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border ${theme === 'dark' ? 'bg-gray-800/95 hover:bg-gray-700 text-green-400 hover:text-green-300 border-gray-600' : 'bg-white/95 hover:bg-white text-green-600 hover:text-green-700 border-green-100'}`}
                            aria-label="Scroll right"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Premium Scrollable container */}
                        <div 
                            id="programs-scroller"
                            className="flex gap-6 overflow-x-auto px-14 py-6 cursor-grab active:cursor-grabbing select-none"
                            data-aos="zoom-in" 
                            data-aos-delay="400"
                            style={{
                                scrollbarWidth: 'none', /* Firefox */
                                msOverflowStyle: 'none', /* IE and Edge */
                                scrollBehavior: 'smooth'
                            }}
                            onScroll={(e) => {
                                // Hide scrollbar for webkit browsers
                                e.target.style.webkitScrollbar = 'none';
                            }}
                            onMouseDown={(e) => {
                                const container = e.currentTarget;
                                let isDown = true;
                                let startX = e.pageX - container.offsetLeft;
                                let scrollLeft = container.scrollLeft;
                                
                                const handleMouseMove = (e) => {
                                    if (!isDown) return;
                                    e.preventDefault();
                                    const x = e.pageX - container.offsetLeft;
                                    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
                                    container.scrollLeft = scrollLeft - walk;
                                };
                                
                                const handleMouseUp = () => {
                                    isDown = false;
                                    document.removeEventListener('mousemove', handleMouseMove);
                                    document.removeEventListener('mouseup', handleMouseUp);
                                    container.style.cursor = 'grab';
                                };
                                
                                container.style.cursor = 'grabbing';
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                            }}
                            onDragStart={(e) => e.preventDefault()} // Prevent text/image dragging
                            ref={el => {
                                // Attach wheel event imperatively with passive: false
                                if (el && !el._customWheelListener) {
                                    const wheelHandler = (e) => {
                                        e.preventDefault();
                                        el.scrollBy({
                                            left: e.deltaY * 2,
                                            behavior: 'smooth'
                                        });
                                    };
                                    el.addEventListener('wheel', wheelHandler, { passive: false });
                                    el._customWheelListener = true;
                                }
                            }}
                        >
                            {programs.map((program, index) => (
                                <div
                                    key={index}
                                    className={`group flex-shrink-0 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border hover:-translate-y-2 w-80 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50 hover:border-green-400' : 'bg-white/90 border-white/50 hover:border-green-200'}`}
                                >
                                    {/* Enhanced Image */}
                                    <div className="relative h-44 overflow-hidden">
                                        <img 
                                            src={program.img} 
                                            alt={program.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                        
                                        {/* Status overlay badge */}
                                        <div className={`absolute top-3 left-3 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg ${
                                            program.status === 'Ongoing' ? (theme === 'dark' ? 'bg-blue-900/95 text-blue-300' : 'bg-blue-100/95 text-blue-700') :
                                            program.status === 'Available' ? (theme === 'dark' ? 'bg-green-900/95 text-green-300' : 'bg-green-100/95 text-green-700') :
                                            program.status === 'Upcoming' ? (theme === 'dark' ? 'bg-yellow-900/95 text-yellow-300' : 'bg-yellow-100/95 text-yellow-700') :
                                            program.status === 'Completed' ? (theme === 'dark' ? 'bg-gray-800/95 text-gray-300' : 'bg-gray-100/95 text-gray-700') :
                                            (theme === 'dark' ? 'bg-gray-800/95 text-green-400' : 'bg-white/95 text-green-600')
                                        }`}>
                                            <span className="font-bold text-xs">{program.status || 'Available'}</span>
                                        </div>
                                        
                                        {/* Category tag */}
                                        <div className={`absolute bottom-3 left-3 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
                                            Training Program
                                        </div>
                                    </div>

                                    {/* Enhanced Content */}
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 leading-tight ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'}`}>
                                                {program.title}
                                            </h3>
                                            <div className={`w-10 h-0.5 rounded-full mb-3 ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>
                                            <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {program.desc}
                                            </p>
                                        </div>
                                        
                                        {/* Enhanced CTA Button */}
                                        <a
                                            href="/seminar"
                                            className={`inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:scale-105 group/btn ${theme === 'dark' ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'}`}
                                            onClick={e => { e.preventDefault(); window.location = '/seminar'; }}
                                        >
                                            Learn More
                                            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Professional Scroll indicator */}
                        <div className="flex justify-center mt-6">
                            <div className={`flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border ${theme === 'dark' ? 'bg-gray-800/80 border-gray-600' : 'bg-white/80 border-green-100'}`}>
                                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                                <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Scroll or Drag explore programs</span>
                                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* LATEST NEWS & UPDATES - Professional Design */}
            <section className={`py-16 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/80' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50/30'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {/* Premium background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100/40'}`}></div>
                    <div className={`absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl ${theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-100/30'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl ${theme === 'dark' ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10' : 'bg-gradient-to-r from-green-50/20 to-emerald-50/20'}`}></div>
                </div>

                {/* Section header */}
                <div className="text-center mt-6 mb-12 relative z-10">
                    
                    <h2 className={`text-3xl md:text-4xl font-black mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} data-aos="fade-up" data-aos-delay="200">
                        News & <span className={`text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-600 to-emerald-600'}`}>Updates</span>
                    </h2>
                    <p className={`text-base max-w-2xl mx-auto font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} data-aos="fade-up" data-aos-delay="300">
                        Stay informed with the latest developments, achievements, and upcoming initiatives in agricultural innovation.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Enhanced News Card 1 */}
                        <div className={`group backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border hover:-translate-y-2 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50 hover:border-green-400' : 'bg-white/90 border-white/50 hover:border-green-200'}`} data-aos="zoom-in" data-aos-delay="400">
                            <div className="relative overflow-hidden">
                                <img src={fits} alt="FITS Center" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                
                                {/* Status badge */}
                                <div className={`absolute top-4 left-4 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg ${theme === 'dark' ? 'bg-green-900/95 text-green-300' : 'bg-green-100/95 text-green-700'}`}>
                                    <span className="font-bold text-xs">New</span>
                                </div>
                                
                                {/* Date badge */}
                                <div className={`absolute bottom-4 right-4 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg ${theme === 'dark' ? 'bg-gray-800/95 text-gray-300' : 'bg-white/95 text-gray-700'}`}>
                                    <span className="font-semibold text-xs">June 2025</span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 leading-tight ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'}`}>
                                        FITS Center Launches New Farmer Training
                                    </h3>
                                    <div className={`w-12 h-1 rounded-full mb-4 ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>
                                    <p className={`text-sm leading-relaxed line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        The FITS Center recently conducted a hands-on training session for local farmers, focusing on sustainable crop management and modern agricultural techniques.
                                    </p>
                                </div>
                                
                                <a
                                    href="https://ati.da.gov.ph/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 group/link ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                                >
                                    Read More
                                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Enhanced News Card 2 */}
                        <div className={`group backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border hover:-translate-y-2 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50 hover:border-green-400' : 'bg-white/90 border-white/50 hover:border-green-200'}`} data-aos="zoom-in" data-aos-delay="500">
                            <div className="relative overflow-hidden">
                                <img src={img4} alt="Organic Farming" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                
                                {/* Status badge */}
                                <div className={`absolute top-4 left-4 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg ${theme === 'dark' ? 'bg-emerald-900/95 text-emerald-300' : 'bg-emerald-100/95 text-emerald-700'}`}>
                                    <span className="font-bold text-xs">Update</span>
                                </div>
                                
                                {/* Date badge */}
                                <div className={`absolute bottom-4 right-4 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg ${theme === 'dark' ? 'bg-gray-800/95 text-gray-300' : 'bg-white/95 text-gray-700'}`}>
                                    <span className="font-semibold text-xs">May 2025</span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 leading-tight ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'}`}>
                                        Organic Farming Initiative Expands
                                    </h3>
                                    <div className={`w-12 h-1 rounded-full mb-4 ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>
                                    <p className={`text-sm leading-relaxed line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Our organic farming program has expanded to include more barangays, promoting healthier produce and eco-friendly practices across the region.
                                    </p>
                                </div>
                                
                                <a
                                    href="https://ati.da.gov.ph/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 group/link ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                                >
                                    Read More
                                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Enhanced News Card 3 */}
                        <div className={`group backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border hover:-translate-y-2 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50 hover:border-green-400' : 'bg-white/90 border-white/50 hover:border-green-200'}`} data-aos="zoom-in" data-aos-delay="600">
                            <div className="relative overflow-hidden">
                                <img src={img5} alt="Rabies Control" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                
                                {/* Status badge */}
                                <div className={`absolute top-4 left-4 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg ${theme === 'dark' ? 'bg-green-800/95 text-green-300' : 'bg-green-200/95 text-green-800'}`}>
                                    <span className="font-bold text-xs">Event</span>
                                </div>
                                
                                {/* Date badge */}
                                <div className={`absolute bottom-4 right-4 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg ${theme === 'dark' ? 'bg-gray-800/95 text-gray-300' : 'bg-white/95 text-gray-700'}`}>
                                    <span className="font-semibold text-xs">April 2025</span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 leading-tight ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'}`}>
                                        Rabies Awareness Campaign
                                    </h3>
                                    <div className={`w-12 h-1 rounded-full mb-4 ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>
                                    <p className={`text-sm leading-relaxed line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        The Rabies Control team held a successful awareness drive, educating pet owners and distributing free vaccines to ensure community safety.
                                    </p>
                                </div>
                                
                                <a
                                    href="https://ati.da.gov.ph/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 group/link ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                                >
                                    Read More
                                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            

            {/* USEFUL EXTERNAL RESOURCES - Compact Design */}
            <section className={`py-12 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/20 via-gray-900/60 to-gray-800/25' : 'bg-gradient-to-br from-green-900/20 via-emerald-50/60 to-green-900/25'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="max-w-6xl mx-auto px-6">
                    {/* Compact Header */}
                    <div className="text-center mb-10">
                        <h2 className={`text-3xl font-extrabold tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-green-900'}`} data-aos="fade-up" data-aos-delay="100">
                            External Resources
                        </h2>
                        <div className={`w-16 h-1 rounded-full mx-auto ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`} data-aos="fade-up" data-aos-delay="200"></div>
                    </div>

                    {/* Compact Resource Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Compact Resource 1 - Department of Agriculture */}
                        <a
                            href="https://www.da.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                            data-aos="fade-up" 
                            data-aos-delay="300"
                        >
                            <div className={`backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border hover:-translate-y-1 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50 hover:border-green-400' : 'bg-white/90 border-white/50 hover:border-green-200'}`}>
                                {/* Compact Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Compact Content */}
                                <div className="text-center">
                                    <h3 className={`text-lg font-bold transition-colors duration-300 mb-2 ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'}`}>
                                        Department of Agriculture
                                    </h3>
                                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Government portal for agriculture programs and resources.
                                    </p>
                                    <span className={`inline-flex items-center gap-1 font-semibold text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                        Visit
                                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* Compact Resource 2 - Agricultural Training Institute */}
                        <a
                            href="https://ati.da.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                            data-aos="fade-up" 
                            data-aos-delay="400"
                        >
                            <div className={`backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border hover:-translate-y-1 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50 hover:border-green-400' : 'bg-white/90 border-white/50 hover:border-green-200'}`}>
                                {/* Compact Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-emerald-500 to-green-600'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Compact Content */}
                                <div className="text-center">
                                    <h3 className={`text-lg font-bold transition-colors duration-300 mb-2 ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'}`}>
                                        Agricultural Training Institute
                                    </h3>
                                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Training and e-learning for farmers and agri-entrepreneurs.
                                    </p>
                                    <span className={`inline-flex items-center gap-1 font-semibold text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                        Visit
                                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* Compact Resource 3 - PhilRice */}
                        <a
                            href="https://www.philrice.gov.ph/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                            data-aos="fade-up" 
                            data-aos-delay="500"
                        >
                            <div className={`backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border hover:-translate-y-1 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50 hover:border-green-400' : 'bg-white/90 border-white/50 hover:border-green-200'}`}>
                                {/* Compact Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-green-600 to-emerald-500'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Compact Content */}
                                <div className="text-center">
                                    <h3 className={`text-lg font-bold transition-colors duration-300 mb-2 ${theme === 'dark' ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'}`}>
                                        PhilRice
                                    </h3>
                                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Research and innovations for rice farmers and industry.
                                    </p>
                                    <span className={`inline-flex items-center gap-1 font-semibold text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                        Visit
                                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Move footer outside of main for valid structure */}
        </main>
        
        {/* Professional Footer */}
        <footer className={`relative overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-700'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Top decorative bar */}
            <div className={`h-1 ${theme === 'dark' ? 'bg-gray-400' : 'bg-white'}`}></div>
            
            <div className="relative py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        
                        {/* Enhanced Logo & About Section */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <img src={logo} alt="FITS Logo" className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
                                    </div>
                                    <div>
                                        <span className={`text-2xl font-extrabold tracking-wide ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>FITS-Tanza</span>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`}>Farmers' Information & Technology Services</p>
                                    </div>
                                </div>
                                
                                <p className={`text-sm leading-relaxed mb-6 max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-white'}`}>
                                    Empowering local farmers and communities through innovative agricultural programs, advanced training, 
                                    and comprehensive support services for sustainable farming practices.
                                </p>
                            </div>
                            
                            {/* Enhanced Contact Information */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 group">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}>
                                        <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-200' : 'text-green-700'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 2.828l4.243 4.243a8 8 0 111.414-1.414z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>Address</p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`}>Municipal Cmpd., Municipality of Tanza, A. Soriano Hi-way, Daang Amaya I, Tanza, Philippines</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 group">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}>
                                        <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-200' : 'text-green-700'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>Email</p>
                                        <a href="mailto:fitstanza@gmail.com" className={`text-sm font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200 hover:text-gray-100' : 'text-white hover:text-gray-200'}`}>
                                            fitstanza@gmail.com
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 group">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}>
                                        <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-200' : 'text-green-700'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3l2 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>Phone</p>
                                        <a href="tel:+63464123456" className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200 hover:underline' : 'text-white hover:underline'}`}>
                                            (+63) 46 412 3456
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Enhanced Quick Links */}
                        <div>
                            <div className="mb-6">
                                <h4 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>
                                    <div className={`w-1 h-6 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-white'}`}></div>
                                    Quick Links
                                </h4>
                                <div className={`w-12 h-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-white'}`}></div>
                            </div>
                            
                            <nav className="space-y-3">
                                {[
                                    { href: '/about', label: 'About Us' },
                                    { href: '/seminar', label: 'Programs' },
                                    { href: '/contact', label: 'Contact' },
                                    { href: '/citizens-charter', label: 'Citizen\'s Charter' },
                                    { href: '/faq', label: 'FAQ' },
                                    { href: '/resources', label: 'Resources' }
                                ].map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className={`group flex items-center gap-2 transition-all duration-300 ${theme === 'dark' ? 'text-gray-200 hover:font-bold' : 'text-white hover:font-bold'}`}
                                        onClick={e => { e.preventDefault(); window.location = link.href; }}
                                    >
                                        <div className={`w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'dark' ? 'bg-gray-400' : 'bg-white'}`}></div>
                                        <span className="font-medium text-lg">{link.label}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>
                        
                        {/* Enhanced Office Hours & Services */}
                        <div>
                            <div className="mb-4">
                                <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>
                                    <div className={`w-1 h-5 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-white'}`}></div>
                                    Office Hours
                                </h4>
                                <div className={`w-10 h-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-white'}`}></div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-white/20 border-white/30'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="12,6 12,12 16,14"/>
                                        </svg>
                                        <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>Working Days</span>
                                    </div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`}>Monday - Friday</p>
                                    <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>8:00 AM - 5:00 PM</p>
                                </div>
                                
                                <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-white/20 border-white/30'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>Message Us</span>
                                    </div>
                                    <a href="https://m.me/fitstanza" target="_blank" rel="noopener noreferrer" className={`text-sm transition-colors duration-300 font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`}>
                                        Facebook Messenger
                                    </a>
                                </div>
                            </div>
                            
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`}>
                                For urgent concerns, please call or visit our office during working hours.
                            </p>
                        </div>
                    </div>
                    
                    {/* Enhanced Social Media & Connect Section */}
                    <div className={`border-t pt-8 mb-8 ${theme === 'dark' ? 'border-gray-600' : 'border-white/30'}`}>
                        <div className="text-center mb-6">
                            <h4 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>Stay Connected</h4>
                            <p className={`text-base max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`}>
                                Follow us on social media for the latest updates on agricultural programs, events, and farming innovations.
                            </p>
                        </div>
                        
                        <div className="flex justify-center gap-4">
                            {[
                                { 
                                    href: 'https://facebook.com/fitstanza', 
                                    label: 'Facebook',
                                    icon: "M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" 
                                },
                                { 
                                    href: 'https://twitter.com/fitstanza', 
                                    label: 'Twitter',
                                    icon: "M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 00-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.634A9.936 9.936 0 0024 4.557z" 
                                },
                                { 
                                    href: 'https://instagram.com/fitstanzacavite', 
                                    label: 'Instagram',
                                    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.974.975 1.244 2.242 1.306 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.306 3.608-.975.974-2.242 1.244-3.608 1.306-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.306-.974-.975-1.244-2.242-1.306-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.332-2.633 1.306-3.608C4.513 2.565 5.78 2.295 7.146 2.233 8.412 2.17 8.792 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.127 4.659.392 3.678 1.373c-.98.98-1.245 2.092-1.302 3.373C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.613.057 1.281.322 2.393 1.302 3.373.98.98 2.092 1.245 3.373 1.302C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.057 2.393-.322 3.373-1.302.98-.98 1.245-2.092 1.302-3.373.058-1.281.07-1.69.07-7.613 0-5.923-.012-6.332-.07-7.613-.057-1.281-.322-2.393-1.302-3.373-.98-.98-2.092-1.245-3.373-1.302C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" 
                                }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="group relative"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                                        theme === 'dark' 
                                            ? 'bg-gray-600 border-gray-500 group-hover:border-gray-400' 
                                            : 'bg-white border-white/70 group-hover:border-white'
                                    }`}>
                                        <svg fill="currentColor" viewBox="0 0 24 24" className={`w-7 h-7 transition-colors duration-300 ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-green-700'
                                        }`}>
                                            <path d={social.icon} />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    {/* Enhanced Bottom Section */}
                    <div className={`border-t pt-8 ${theme === 'dark' ? 'border-gray-600' : 'border-white/30'}`}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <p className={`text-lg font-medium mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-white'}`}>
                                    &copy; {new Date().getFullYear()} FITS-Tanza. All rights reserved.
                                </p>
                                <p className={`text-base ${theme === 'dark' ? 'text-gray-200' : 'text-white'}`}>
                                    Developed by the FITS-Tanza IT Team. 
                                    <a href="mailto:fitstanza@gmail.com" className={`font-bold ml-1 transition-colors duration-300 underline ${
                                        theme === 'dark' ? 'text-gray-200 hover:text-gray-100' : 'text-white hover:text-gray-200'
                                    }`}>
                                        Contact Webmaster
                                    </a>
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-6 text-base">
                                {[
                                    { href: '/privacy', label: 'Privacy Policy' },
                                    { href: '/terms', label: 'Terms of Service' },
                                    { href: '/accessibility', label: 'Accessibility' }
                                ].map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className={`transition-all duration-300 ${theme === 'dark' ? 'text-gray-200 hover:font-bold' : 'text-white hover:font-bold'}`}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

            {/* Back to Top Button */}
            <button
                className={`fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group ${
                    showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                } ${
                    theme === 'dark' 
                        ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' 
                        : 'bg-white text-green-700 hover:bg-gray-50'
                }`}
                onClick={scrollToTop}
                aria-label="Back to top"
                style={{
                    transform: showBackToTop ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <svg 
                    className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth={2.5} 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10 ${
                    theme === 'dark' 
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
                        : 'bg-gradient-to-r from-green-400 to-emerald-400'
                }`}></div>
            </button>

            <style>{`
                .hero-fade-img {
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transition: opacity 1.6s cubic-bezier(0.86,0,0.07,1);
                }
                .hero-fade-img.opacity-100 {
                    opacity: 1 !important;
                }
                .hero-fade-img.opacity-0 {
                    opacity: 0 !important;
                }
                html, body, #root {
                    overflow-x: hidden !important;
                    width: 100vw;
                }
                .letter-spacing-wide {
                    letter-spacing: 0.15em;
                }
                .reveal-on-scroll {
                    opacity: 0;
                    transform: translateY(40px);
                }
                .reveal-on-scroll.opacity-100 {
                    opacity: 1 !important;
                }
                .reveal-on-scroll.translate-y-0 {
                    transform: translateY(0) !important;
                }
                /* Custom scrollbar styles for smaller scrollbar */
                ::-webkit-scrollbar {
                    width: 7px;
                    height: 7px;
                }
                ::-webkit-scrollbar-thumb {
                    background: ${theme === 'dark' ? '#6b7280' : '#14532d'};
                    border-radius: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: ${theme === 'dark' ? '#374151' : '#e5e7eb'};
                    border-radius: 8px;
                }
                /* For Firefox */
                html {
                    scrollbar-width: thin;
                    scrollbar-color: ${theme === 'dark' ? '#6b7280 #374151' : '#14532d #e5e7eb'};
                }
            `}</style>
        </>
    )
}
