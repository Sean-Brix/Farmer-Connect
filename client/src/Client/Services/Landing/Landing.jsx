// UTILS

 
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
// eslint-disable-next-line
import React, { useEffect, useState, useRef } from 'react'

// NAVBAR
import Navbar from '../../Components/Navbar'

// IMAGES
import fits from './Assets/fits.jpg'
import soil1 from './Assets/soil1.jpg'
import img1 from './Assets/1.jpg'
import img2 from './Assets/2.jpg'
import img3 from './Assets/3.jpg'
import img4 from './Assets/4.jpg'
import img5 from './Assets/rabies.jpg'
import img6 from './Assets/bg.jpg'
import video from './Assets/rice.mp4'
import logo from './Assets/Logo.png'
import s2 from './Assets/s2.jpg'
import mainbg from './Assets/mainbg.jpg'
import i1 from './Assets/i1.jpg'
import i2 from './Assets/i2.jpg'
import i3 from './Assets/i3.jpg'
import i4 from './Assets/i4.jpg'
import soil from './Assets/soil.jpg'
import farm from './Assets/farm.jpg'

export default function Landing() {
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
        },
        {
            img: img2,
            title: "Crop Production",
            desc: "Enhancing crop production through innovative techniques, research, and farmer education for sustainable agriculture.",
        },
        {
            img: img5,
            title: "Rabies Control",
            desc: "Implementing comprehensive rabies prevention and control initiatives to safeguard public health and animal welfare.",
        },
        {
            img: img3,
            title: "Fisheries Program",
            desc: "Promoting responsible fisheries management and aquaculture to ensure sustainable livelihoods and healthy aquatic ecosystems.",
        },
        {
            img: img4,
            title: "Organic Farming",
            desc: "Advancing organic farming practices for healthier produce, environmental stewardship, and improved farmer well-being.",
        },
        {
            img: img5,
            title: "Rabies Control",
            desc: "Implementing comprehensive rabies prevention and control initiatives to safeguard public health and animal welfare.",
        },
    ];


    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [isAnimating, setIsAnimating] = useState(false);
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

    // Animation on scroll
    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const handleScroll = () => {
            revealElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 80) {
                    el.classList.add('opacity-100', 'translate-y-0');
                }
            });
        };
        // Initial check
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <div className="relative z-[100] m-0 p-0"><Navbar /></div>
            <main className="min-h-screen" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {/* HERO SECTION - FLEX WITH VIDEO */}
                <section className="relative mb-0 mt-0  min-h-[800px] flex items-center justify-center px-[8vw] bg-green-50 font-poppins">
                
                <img
                    src={fits}
                    alt="Soil texture overlay"
                    className="absolute left-0 bottom-0 w-full h-[800px] object-cover opacity-20 pointer-events-none z-10 "
                    style={{mixBlendMode: 'multiply'}}
                />
                {/* Responsive flex: column on small screens, row on md+ */}
                <div className="flex flex-col md:flex-row w-full items-center justify-center">
                    {/* Left: Headline and Description */}
                    <div className="flex-1 pr-[2vw] min-w-[320px] relative z-30 w-full md:w-auto">
                        <h1 className="font-montserrat font-extrabold text-[2.2rem] md:text-[3.5rem] text-[#0a2540] m-0 leading-tight tracking-[0.01em]">
                            Empowering <span className="text-green-700">Agriculture</span>,<br />Enriching Lives
                        </h1>
                        <p className="font-poppins text-base md:text-[1.25rem] text-[#0a2540] mt-8 max-w-xl font-medium">
                            Get updates on new features, farmer stories, and the future of AI for agriculture—delivered monthly to your inbox.
                        </p>
                        <div className="flex gap-4 mt-10 flex-wrap">
                            <button
                                className="bg-green-700 text-white border-none rounded-xl px-8 py-3 font-bold text-base cursor-pointer font-poppins shadow transition-colors duration-200 hover:bg-green-800"
                                onClick={() => window.location = '/seminar'}
                            >
                                Our Programs
                            </button>
                            <button
                                className="bg-white text-green-700 border-2 border-green-700 rounded-xl px-8 py-3 font-semibold text-base cursor-pointer font-poppins shadow transition-colors duration-200 hover:bg-green-700 hover:text-white"
                                onClick={() => window.location = '/about'}
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                    {/* Right: Video - below on small screens, right on md+ */}
                    <div className="flex-1 flex items-center min-w-[320px] w-full md:w-auto mt-10 md:mt-0 justify-end">
                        <div className="relative w-full h-[260px] md:h-[650px] max-w-[720px] bg-gradient-to-br from-green-200 via-green-100 to-green-300 border border-green-200 rounded-2xl md:rounded-bl-[60px] shadow-2xl overflow-hidden flex items-center justify-center -mt-4 md:-mt-16">
                            {/* Slideshow images with fade transition */}
                            {heroSlides.map((slide, idx) => (
                                <img
                                    key={idx}
                                    src={slide.img}
                                    alt={slide.desc}
                                    className={`w-full h-full object-cover rounded-2xl md:rounded-bl-[60px] hero-fade-img ${heroIndex === idx ? 'opacity-100 z-20' : 'opacity-0 z-10'} ${heroIndex === idx ? 'fade-in' : 'fade-out'}`}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        transition: 'opacity 1.6s cubic-bezier(0.86,0,0.07,1)',
                                        boxShadow: '0 16px 40px 0 rgba(36,99,235,0.18), 0 2px 8px 0 rgba(0,0,0,0.10), 0 0px 0px 2px rgba(36,99,235,0.08)'
                                    }}
                                />
                            ))}
                            {/* Overlay for polish */}
                            <div className="absolute inset-0 pointer-events-none z-20" style={{background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(34,197,94,0.08) 100%)'}}></div>
                            {/* Caption */}
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-green-700/80 via-green-700/40 to-transparent px-6 py-10 text-white font-semibold text-lg md:text-2xl z-30 flex items-center justify-between">
                                <button
                                    className="bg-green-700/80 hover:bg-green-800/90 rounded-full p-2 mr-2 transition shadow-lg"
                                    onClick={handlePrevHero}
                                    aria-label="Previous Slide"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <span className="flex-1 text-center font-poppins font-semibold text-base md:text-xl px-2">
                                    {heroSlides[heroIndex].desc}
                                </span>
                                <button
                                    className="bg-green-700/80 hover:bg-green-800/90 rounded-full p-2 ml-2 transition shadow-lg"
                                    onClick={handleNextHero}
                                    aria-label="Next Slide"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                            {/* Dots navigation */}
                            <div className="absolute bottom-3 left-0 w-full flex justify-center gap-2 z-40">
                                {heroSlides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setHeroIndex(idx)}
                                        className={`w-3 h-3 rounded-full border-2 transition ${heroIndex === idx ? 'bg-green-700 border-green-700' : 'bg-green-200 border-green-200 hover:bg-green-400'}`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                </section>

            {/* MISSION & VISION */}
            <section className="py-20 mt-0  relative overflow-hidden " style={{ fontFamily: 'Poppins, sans-serif' }}>
                {/* Decorative SVG background */}
               
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-10 relative z-10">
                    {/* Mission */}
                    <div className="flex-1 flex flex-col items-center justify-center relative group">
                        {/* Removed decorative blur background */}
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-green-100 shadow-lg mb-6 group-hover:scale-110 transition">
                                {/* Mission Icon - Flag */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21V5a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 00-1 1v7" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h12" />
                                </svg>
                            </span>
                            <h2 className="text-3xl font-extrabold text-green-900 tracking-tight letter-spacing-wide mb-4">Mission</h2>
                            <p className="text-gray-700 text-lg leading-relaxed font-semibold text-center max-w-md">
                                To drive sustainable agricultural growth and elevate community livelihoods through innovative solutions, transformative education, and collaborative partnerships.
                            </p>
                        </div>
                        {/* Decorative dots */}
                        <div className="mt-8 flex items-center  gap-2 z-10">
                            
                        </div>
                    </div>
                    {/* Divider for desktop */}
                    <div className="hidden md:flex flex-col justify-center">
                        <svg className="w-2 h-40" viewBox="0 0 8 160" fill="none">
                            <path d="M4 0C4 0 4 80 4 160" stroke="green" strokeWidth="4" strokeDasharray="8 8" />
                        </svg>
                    </div>
                    {/* Vision */}
                    <div className="flex-1 flex flex-col items-center justify-center relative group">
                        {/* Removed decorative blur background */}
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-green-100 shadow-lg mb-6 group-hover:scale-110 transition">
                                {/* Vision Icon - Eye */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
                                </svg>
                            </span>
                            <h2 className="text-3xl font-extrabold text-green-900 tracking-tight letter-spacing-wide mb-4">Vision</h2>
                            <p className="text-gray-700 text-lg leading-relaxed font-semibold text-center max-w-md">
                                To be a catalyst for agricultural transformation, fostering innovation and building resilient, thriving communities for generations to come.
                            </p>
                        </div>
                        {/* Decorative dots */}
                        <div className="mt-8 flex items-center gap-2 z-10">
                            {/* Removed decorative dots */}
                        </div>
                    </div>
                </div>
                
            </section>

            {/* PROGRAMS */}
            <section id="programs" className="mb-20 mt-20 py-14 bg-green-900/10" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <h2 className="text-3xl font-extrabold text-green-900 mb-20 text-center tracking-tight reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                    Our Programs
                </h2>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-6">
                        <button
                            aria-label="Previous"
                            onClick={prevSlide}
                            className="bg-green-900/30 hover:bg-green-900/60 text-green-900 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={programs.length <= 4}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="w-full flex justify-center gap-6 overflow-hidden mx-4 md:mx-10 lg:mx-16">
                            <div
                                className={`flex gap-4 py-5 w-full transition-transform duration-300 ease-in-out ${isAnimating ? (direction === 1 ? 'slider-next' : 'slider-prev') : ''}`}
                                style={{
                                    transform: isAnimating
                                        ? `translateX(${direction === 1 ? (window.innerWidth < 640 ? '-100%' : '-25%') : (window.innerWidth < 640 ? '100%' : '25%')})`
                                        : 'translateX(0)',
                                }}
                            >
                                {/* Responsive: 1 item on small screens, 4 on md+ */}
                                {Array.from({ length: cardsToShow }).map((_, i) => {
                                    const idx = (current + i) % programs.length;
                                    const program = programs[idx];
                                    let cardOpacity = 'opacity-100 scale-100';
                                    if ((cardsToShow > 1) && (i === 0 || i === cardsToShow - 1)) cardOpacity = 'opacity-60 scale-90';
                                    return (
                                        <div
                                            key={idx}
                                className={`bg-white rounded-3xl shadow-xl flex flex-col items-center p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 hover:shadow-2xl transition group border-t-8 border-green-900 relative mx-auto ${cardOpacity}`}
                                            style={{
                                                width: '90vw',
                                                maxWidth: '260px',
                                                minWidth: '140px',
                                                height: '100%',
                                                minHeight: '240px',
                                                maxHeight: '360px',
                                                transition: 'all 0.3s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <div className="w-14 h-14 xs:w-16 xs:h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-green-900/20 flex items-center justify-center mb-3 sm:mb-4 shadow group-hover:bg-green-900/40 transition">
                                                <img
                                                    src={program.img}
                                                    alt={program.title}
                                                    className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full border-4 border-green-900/30 shadow"
                                                />
                                            </div>
                                            <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-green-900 mb-1 sm:mb-2 text-center group-hover:text-green-800 transition truncate w-full" title={program.title}>{program.title}</h3>
                                            <p className="text-gray-700 text-xs xs:text-sm sm:text-base font-medium text-center mb-2 sm:mb-3 line-clamp-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', maxHeight: '4.5em' }} title={program.desc}>{program.desc}</p>
                                            <a
                                                href="/seminar"
                                                className="mt-auto inline-block bg-gradient-to-r from-green-900 to-green-800 text-white px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform text-xs xs:text-sm md:text-base"
                                                onClick={e => { e.preventDefault(); window.location = '/seminar'; }}
                                            >
                                                Learn More
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button
                            aria-label="Next"
                            onClick={nextSlide}
                            className="bg-green-900/30 hover:bg-green-900/60 text-green-900 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={programs.length <= 4}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    {/* Dots navigation */}
                    <div className="flex justify-center gap-2 mt-8">
                        {programs.slice(0, programs.length).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`w-3 h-3 rounded-full transition border-2 ${current === idx ? 'bg-green-900 border-green-900' : 'bg-green-700 border-green-700 hover:bg-green-800'}`}
                                aria-label={`Go to program ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>


            {/* LATEST NEWS & UPDATES */}
            <section className="relative max-w-6xl mx-auto px-4 py-16 mb-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {/* Decorative background shapes */}
                <div className="absolute -top-8 -left-8 w-28 h-28 bg-green-900/20 rounded-full opacity-30 blur-2xl z-0"></div>
                <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-green-900/30 rounded-full opacity-20 blur-2xl z-0"></div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-10 text-center tracking-tight reveal-on-scroll opacity-0 -translate-y-10 transition-all duration-700 delay-100 relative z-10">
                    Latest News & Updates
                </h2>
                <div className="relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {/* News Card 1 */}
                    <div className="bg-white/95 rounded-2xl shadow-lg border border-green-900/30 p-5 flex flex-col hover:shadow-2xl transition-all duration-300 group max-w-xs w-full">
                            <div className="relative mb-3">
                                <img src={fits} alt="FITS Center" className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md" />
                                <span className="absolute top-2 right-2 bg-green-900 text-green-100 text-xs px-2 py-0.5 rounded-full font-bold shadow">New</span>
                            </div>
                            <h3 className="font-bold text-lg text-green-900 mb-2">FITS Center Launches New Farmer Training</h3>
                            <p className="text-gray-800 text-sm mb-3 font-semibold line-clamp-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', maxHeight: '4.5em' }}>
                                The FITS Center recently conducted a hands-on training session for local farmers, focusing on sustainable crop management and modern agricultural techniques.
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-green-900 text-xs font-semibold">June 2024</span>
                                <a
                                    href="https://ati.da.gov.ph/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-900 font-bold hover:underline flex items-center gap-1 transition text-sm"
                                >
                                    Read More
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        {/* News Card 2 */}
                    <div className="bg-white/95 rounded-2xl shadow-lg border border-green-900/30 p-5 flex flex-col hover:shadow-2xl transition-all duration-300 group max-w-xs w-full">
                            <div className="relative mb-3">
                                <img src={img4} alt="Organic Farming" className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md" />
                                <span className="absolute top-2 right-2 bg-green-900 text-green-100 text-xs px-2 py-0.5 rounded-full font-bold shadow">Update</span>
                            </div>
                            <h3 className="font-bold text-lg text-green-900 mb-2">Organic Farming Initiative Expands</h3>
                            <p className="text-gray-800 text-sm mb-3 font-semibold line-clamp-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', maxHeight: '4.5em' }}>
                                Our organic farming program has expanded to include more barangays, promoting healthier produce and eco-friendly practices across the region.
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-green-900 text-xs font-semibold">May 2024</span>
                                <a
                                    href="https://ati.da.gov.ph/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-900 font-bold hover:underline flex items-center gap-1 transition text-sm"
                                >
                                    Read More
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        {/* News Card 3 */}
                    <div className="bg-white/95 rounded-2xl shadow-lg border border-green-900/30 p-5 flex flex-col hover:shadow-2xl transition-all duration-300 group max-w-xs w-full">
                            <div className="relative mb-3">
                                <img src={img5} alt="Rabies Control" className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md" />
                                <span className="absolute top-2 right-2 bg-green-900 text-green-100 text-xs px-2 py-0.5 rounded-full font-bold shadow">Event</span>
                            </div>
                            <h3 className="font-bold text-lg text-green-900 mb-2">Rabies Awareness Campaign</h3>
                            <p className="text-gray-800 text-sm mb-3 font-semibold line-clamp-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', maxHeight: '4.5em' }}>
                                The Rabies Control team held a successful awareness drive, educating pet owners and distributing free vaccines to ensure community safety.
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-green-900 text-xs font-semibold">April 2024</span>
                                <a
                                    href="https://ati.da.gov.ph/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-900 font-bold hover:underline flex items-center gap-1 transition text-sm"
                                >
                                    Read More
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
            </section>
            

            {/* USEFUL EXTERNAL RESOURCES */}
            <section className="  py-40 = bg-green-900/10" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <h2 className="text-3xl font-extrabold text-green-900 mb-20 text-center tracking-tight reveal-on-scroll opacity-0 -translate-y-2  transition-all duration-700 delay-100">
                    Useful External Resources
                </h2>
                {/* Resource cards in a responsive flex layout */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-5 md:gap-12 px-4">
                    {/* Resource 1 */}
                    <a
                        href="https://www.da.gov.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center w-full max-w-xs group"
                    >
                        <span className="bg-white shadow-lg border-4 border-green-900 rounded-full p-4 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-green-900 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-900 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                            </svg>
                        </span>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-green-900 mb-1">Department of Agriculture</h3>
                            <p className="text-green-900 text-sm font-semibold">Official government portal for Philippine agriculture programs, news, and resources.</p>
                        </div>
                    </a>
                    {/* Resource 2 */}
                    <a
                        href="https://ati.da.gov.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center w-full max-w-xs group"
                    >
                        <span className="bg-white shadow-lg border-4 border-green-900 rounded-full p-4 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-green-900 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-900 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-6a4 4 0 100-8 4 4 0 000 8z" />
                            </svg>
                        </span>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-green-900 mb-1">Agricultural Training Institute</h3>
                            <p className="text-green-900 text-sm font-semibold">Training, extension, and e-learning for farmers and agri-entrepreneurs.</p>
                        </div>
                    </a>
                    {/* Resource 3 */}
                    <a
                        href="https://www.philrice.gov.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center w-full max-w-xs group"
                    >
                        <span className="bg-white shadow-lg border-4 border-green-900 rounded-full p-4 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-green-900 group-hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-900 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" />
                            </svg>
                        </span>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-green-900 mb-1">PhilRice</h3>
                            <p className="text-green-900 text-sm font-semibold">Research and innovations for rice farmers and the rice industry.</p>
                        </div>
                    </a>
                </div>
            </section>

            {/* Move footer outside of main for valid structure */}
        </main>
           <footer className="bg-green-900 py-16 px-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-14">
                    {/* Logo & About */}
                    <div className="flex-1 mb-10 md:mb-0">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={logo} alt="FITS Logo" className="w-12 h-12 rounded-full border-2 border-green-900 shadow" />
                            <span className="text-2xl font-extrabold text-green-100 tracking-wide">FITS-Tanza</span>
                        </div>
                        <p className="text-green-100 text-sm mb-4 font-semibold">
                            The Farmers' Information and Technology Services (FITS) Center of Tanza is dedicated to empowering local farmers and communities through innovative agricultural programs, training, and support.
                        </p>
                        <div className="flex items-center gap-2 text-green-100 text-xs">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 2.828l4.243 4.243a8 8 0 111.414-1.414z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Poblacion, Tanza, Cavite, Philippines</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-100 text-xs mt-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12v1a4 4 0 01-8 0v-1m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4" />
                            </svg>
                            <span>Email: <a href="mailto:fitstanza@gmail.com" className="underline hover:text-blue-400">fitstanza@gmail.com</a></span>
                        </div>
                        <div className="flex items-center gap-2 text-green-100 text-xs mt-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm14 0a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z" />
                            </svg>
                            <span>Tel: <a href="tel:+63464123456" className="underline hover:text-blue-400">(+63) 46 412 3456</a></span>
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div className="flex-1 mb-10 md:mb-0">
                        <h4 className="font-semibold text-green-100 mb-4 text-lg">Quick Links</h4>
                        <ul className="space-y-2 text-green-100 text-base font-semibold">
                            <li>
                                <a
                                    href="/about"
                                    className="hover:text-blue-600 transition"
                                    onClick={e => { e.preventDefault(); window.location = '/about'; }}
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/seminar"
                                    className="hover:text-blue-600 transition"
                                    onClick={e => { e.preventDefault(); window.location = '/seminar'; }}
                                >
                                    Programs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="hover:text-blue-600 transition"
                                    onClick={e => { e.preventDefault(); window.location = '/contact'; }}
                                >
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/faq"
                                    className="hover:text-blue-600 transition"
                                    onClick={e => { e.preventDefault(); window.location = '/faq'; }}
                                >
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/resources"
                                    className="hover:text-blue-600 transition"
                                    onClick={e => { e.preventDefault(); window.location = '/resources'; }}
                                >
                                    Resources
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Contact & Hours */}
                    <div className="flex-1 mb-10 md:mb-0">
                        <h4 className="font-semibold text-green-100 mb-4 text-lg">Contact & Hours</h4>
                        <div className="text-green-100 text-sm font-semibold mb-2">
                            <span className="block">Office Hours:</span>
                            <span className="block">Mon - Fri: 8:00 AM - 5:00 PM</span>
                            <span className="block">Sat - Sun: Closed</span>
                        </div>
                        <div className="text-green-100 text-sm font-semibold mb-2">
                            <span className="block">Facebook Messenger: <a href="https://m.me/fitstanza" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">Message Us</a></span>
                        </div>
                        <div className="text-green-100 text-sm font-semibold">
                            <span className="block">For urgent concerns, please call or visit our office during working hours.</span>
                        </div>
                    </div>
                    {/* Social Media & Newsletter */}
                    <div className="flex-1">
                        <h4 className="font-semibold text-green-100 mb-4 text-lg">Connect with us</h4>
                        <div className="flex gap-5 mb-6">
                            <a
                                href="https://facebook.com/fitstanza"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="bg-green-900 hover:bg-green-800 rounded-full p-2 transition"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-green-100">
                                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                                </svg>
                            </a>
                            <a
                                href="https://twitter.com/fitstanza"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                className="bg-green-900 hover:bg-green-800 rounded-full p-2 transition"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-green-100">
                                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 00-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.634A9.936 9.936 0 0024 4.557z"/>
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com/fitstanzacavite"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="bg-green-900 hover:bg-green-800 rounded-full p-2 transition"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-green-100">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.974.975 1.244 2.242 1.306 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.306 3.608-.975.974-2.242 1.244-3.608 1.306-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.306-.974-.975-1.244-2.242-1.306-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.332-2.633 1.306-3.608C4.513 2.565 5.78 2.295 7.146 2.233 8.412 2.17 8.792 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.127 4.659.392 3.678 1.373c-.98.98-1.245 2.092-1.302 3.373C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.613.057 1.281.322 2.393 1.302 3.373.98.98 2.092 1.245 3.373 1.302C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.057 2.393-.322 3.373-1.302.98-.98 1.245-2.092 1.302-3.373.058-1.281.07-1.69.07-7.613 0-5.923-.012-6.332-.07-7.613-.057-1.281-.322-2.393-1.302-3.373-.98-.98-2.092-1.245-3.373-1.302C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                                </svg>
                            </a>
                        </div>
                        <form
                            className="mb-4"
                            onSubmit={e => {
                                e.preventDefault();
                                alert('Thank you for subscribing!');
                            }}
                        >
                          
                        </form>
                        <p className="text-green-100 text-xs">&copy; {new Date().getFullYear()} FITS-Tanza. All rights reserved.</p>
                        <p className="text-green-100 text-xs mt-1">Developed by the FITS-Tanza IT Team. <a href="mailto:fitstanza@gmail.com" className="underline hover:text-blue-600">Contact Webmaster</a></p>
                    </div>
                </div>
                <div className="mt-10 border-t border-green-900 pt-6 text-center text-green-100 text-xs">
                    <span>
                        <a href="/privacy" className="underline hover:text-blue-600">Privacy Policy</a> &nbsp;|&nbsp;
                        <a href="/terms" className="underline hover:text-blue-600">Terms of Service</a> &nbsp;|&nbsp;
                        <a href="/accessibility" className="underline hover:text-blue-600">Accessibility</a>
                    </span>
                </div>
            </footer>

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
                    background: #14532d;
                    border-radius: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #e5e7eb;
                    border-radius: 8px;
                }
                /* For Firefox */
                html {
                    scrollbar-width: thin;
                    scrollbar-color: #14532d #e5e7eb;
                }
            `}</style>
        </>
    )
}
