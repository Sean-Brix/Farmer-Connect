// UTILS
import React, { useEffect, useRef, useState } from 'react'

// NAVBAR
import Navbar from '../../Components/Navbar'

// IMAGES
import fits from './Assets/fits.jpg'
import img1 from './Assets/1.jpg'
import img2 from './Assets/2.jpg'
import img3 from './Assets/3.jpg'
import img4 from './Assets/4.jpg'
import img5 from './Assets/rabies.jpg'
import img6 from './Assets/bg.jpg'
import video from './Assets/rice.mp4'

export default function Landing() {
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
            desc: "Supporting sustainable crop production through modern techniques, research, and farmer education for increased yield and food security.",
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

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
    };

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

    // Replace all green color classes with blue equivalents
    return (
        <>
            <Navbar />
            <main className="bg-gradient-to-br from-blue-50 to-blue-100 pb-20  min-h-screen">
                <section className="max-w-6xl mx-auto px-4  mb-0">
                    <div
                        className="
                            w-screen relative left-1/2 right-1/2  -ml-[50vw] -mr-[50vw]
                            flex flex-col items-center justify-center gap-6
                            bg-black/80 backdrop-blur shadow-2xl p-35 sm:p-55 mb-20 border border-blue-900
                            overflow-hidden
                            reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700
                        "
                    >
                        <video
                            src={video}
                            autoPlay
                            loop
                            muted
                         playsInline
                            className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
                            style={{
                                animation: 'none',
                                transition: 'none',
                                // filter: 'brightness(0.5) hue-rotate(160deg) saturate(2.5)',
                                
                            }}></video>
                        {/* Text and Buttons */}
                        <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center">
                            <h1
                                className="text-5xl font-extrabold mb-6 text-white leading-tight tracking-tight drop-shadow-2xl"
                                style={{
                                    textShadow:
                                        '0 4px 24px rgba(0,0,0,0.95), 0 1px 0 #fff',
                                }}
                            >
                                Empowering Agriculture,<br />Enriching Lives
                            </h1>
                            <p
                                className="text-xl text-white mb-8 drop-shadow-2xl font-semibold"
                                style={{
                                    textShadow:
                                        '0 4px 24px rgba(0,0,0,0.95), 0 1px 0 #fff',
                                }}
                            >
                                Advancing sustainable agriculture and community well-being through innovation and dedicated support.
                            </p>
                            <div className="flex gap-4 flex-wrap mb-8 justify-center">
                                <a
                                    href="/seminar"
                                    className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-2xl font-semibold shadow hover:scale-105 transition-transform"
                                    onClick={e => { e.preventDefault(); window.location = '/seminar'; }}
                                >
                                    Our Programs
                                </a>
                                                                    <a
                                                                        href="/about"
                                                                        className="border-2 border-blue-100 text-blue-50 px-8 py-3 rounded-2xl font-semibold hover:bg-blue-900/30 transition"
                                                                        onClick={e => { e.preventDefault(); window.location = '/about'; }}
                                                                    >
                                                                        Learn More
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                                           

                                                                                {/* Mission & Vision Cards */}
                            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto px-4 mb-20">
                                <div className="flex-1 bg-gradient-to-br from-blue-200 via-blue-50 to-blue-100 rounded-3xl shadow-lg border border-blue-200 flex flex-col justify-between p-12 hover:shadow-2xl group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                                    <div>
                                        <div className="flex items-center gap-5 mb-6">
                                            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-blue-200 text-blue-700 group-hover:bg-blue-300 transition shadow-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                                </svg>
                                            </span>
                                            <h2 className="text-3xl font-bold text-blue-900">Mission</h2>
                                        </div>
                                        <p className="text-gray-800 text-lg leading-relaxed font-semibold">
                                            To drive sustainable agricultural growth and improve community livelihoods through innovative solutions, education, and collaborative partnerships.
                                        </p>
                                    </div>
                                </div>
                                {/* Divider for desktop */}
                                <div className="hidden md:flex flex-col justify-center">
                                    <div className="w-1 h-32 bg-blue-200 rounded-full mx-auto"></div>
                                </div>
                                {/* Vision Card */}
                                <div className="flex-1 bg-gradient-to-br from-blue-200 via-blue-50 to-blue-100 rounded-3xl shadow-lg border border-blue-200 flex flex-col justify-between p-12 hover:shadow-2xl group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
                                    <div>
                                        <div className="flex items-center gap-5 mb-6">
                                            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-blue-300 text-blue-800 group-hover:bg-blue-400 transition shadow-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9s-9-4-9-9 4.03-9 9-9 9 4 9 9z" />
                                                </svg>
                                            </span>
                                            <h2 className="text-3xl font-bold text-blue-900">Vision</h2>
                                        </div>
                                        <p className="text-gray-800 text-lg leading-relaxed font-semibold">
                                            To be a leading force in transforming agriculture, fostering innovation, and building resilient, thriving communities for generations to come.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            

                            {/* Modern Horizontal Scrollbar for Programs */}
                            <div id="programs" className="mb-20 py-14">
                                <h2 className="text-3xl font-extrabold text-blue-900 mb-15 text-center tracking-tight reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                                    Our Programs
                                </h2>
                                <div className="relative max-w-6xl mx-auto">
                                    <div
                                        className="flex gap-8  overflow-x-auto scrollbar-modern scrollbar-thumb-dark-blue scrollbar-track-blue-100 py-6 px-8 rounded-2xl "
                                        style={{
                                            scrollSnapType: 'x mandatory',
                                            WebkitOverflowScrolling: 'touch',
                                        }}
                                    >
                                        {programs.map((program, idx) => (
                                            <div
                                                key={idx}
                                                className="flex-shrink-0 w-80 md:w-96 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600 rounded-3xl shadow-2xl border border-blue-900 p-8 flex flex-col items-center text-center mx-2 transition-transform duration-300 hover:scale-105 hover:shadow-blue-700/40"
                                                style={{
                                                    scrollSnapAlign: 'start',
                                                    minWidth: '20rem',
                                                    maxWidth: '24rem',
                                                }}
                                            >
                                                <div className="relative z-10 w-24 h-24 rounded-2xl overflow-hidden shadow-lg mb-6 border-4 border-blue-700 bg-blue-950">
                                                    <img
                                                        src={program.img}
                                                        alt={program.title}
                                                        className="w-full h-full object-cover scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <h3 className="relative z-10 text-2xl font-bold text-blue-50 mb-2 tracking-wide">
                                                    {program.title}
                                                </h3>
                                                <p className="relative z-10 text-blue-100 text-base mb-4 font-medium">
                                                    {program.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Custom dark blue modern scrollbar style */}
                                    <style>{`
                                        .scrollbar-modern {
                                            scrollbar-width: thin;
                                            scrollbar-color: #1e3a8a #dbeafe;
                                        }
                                        .scrollbar-modern::-webkit-scrollbar {
                                            height: 12px;
                                            background: #dbeafe;
                                            border-radius: 8px;
                                        }
                                        .scrollbar-modern::-webkit-scrollbar-thumb {
                                            background: linear-gradient(135deg, #1e3a8a 60%, #1e40af 100%);
                                            border-radius: 8px;
                                            border: 2px solid #dbeafe;
                                        }
                                        .scrollbar-modern::-webkit-scrollbar-track {
                                            background: #dbeafe;
                                            border-radius: 8px;
                                        }
                                    `}</style>
                                </div>
                            </div>
     {/* Infinite moving image banner */}
                                                                                <div
                                                                                    className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-10 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-100 mb-20 shadow-2xl"
                                                                                    style={{
                                                                                        perspective: '1200px',
                                                                                        perspectiveOrigin: '50% 50%',
                                                                                    }}
                                                                                >
                                                                                    <div
                                                                                        className="flex items-center gap-20"
                                                                                        style={{
                                                                                            width: 'max-content',
                                                                                            animation: 'infinite-scroll 30s linear infinite',
                                                                                            display: 'flex',
                                                                                            minWidth: '200%',
                                                                                            transformStyle: 'preserve-3d',
                                                                                        }}
                                                                                    >
                                                                                        {/* Repeat the images enough times to ensure seamless looping */}
                                                                                        {Array(4).fill([img1, img3, img5, img6, img2, img4, img5, img6]).flat().map((img, idx) => (
                                                                                            <div
                                                                                                key={idx}
                                                                                                className="relative group transition-transform duration-300 hover:scale-110"
                                                                                                style={{
                                                                                                    transform: `rotateY(${(idx % 8 - 4) * 8}deg) translateZ(0px)`,
                                                                                                    boxShadow: '0 8px 32px 0 rgba(30, 64, 175, 0.18), 0 1.5px 8px 0 rgba(30, 64, 175, 0.10)',
                                                                                                    background: 'linear-gradient(135deg, #e0e7ff 60%, #f0f9ff 100%)',
                                                                                                    borderRadius: '1rem',
                                                                                                }}
                                                                                            >
                                                                                                <img
                                                                                                    src={img}
                                                                                                    alt={`slide-${idx}`}
                                                                                                    className="h-36 w-56 object-cover rounded-xl shadow-2xl"
                                                                                                    draggable={false}
                                                                                                    style={{
                                                                                                        boxShadow: '0 12px 32px 0 rgba(30, 64, 175, 0.18), 0 1.5px 8px 0 rgba(30, 64, 175, 0.10)',
                                                                                                        borderRadius: '1rem',
                                                                                                        border: 'none',
                                                                                                        background: 'inherit',
                                                                                                    }}
                                                                                                />
                                                                                                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 rounded-3xl transition"></div>
                                                                                            </div>
                                                                                        ))}
                                                                                <style>{`
                                                                                            @keyframes infinite-scroll {
                                                                                                0% { transform: translateX(0); }
                                                                                                100% { transform: translateX(-50%); }
                                                                                            }
                                                                                        `}</style>
                                                                                    </div>
                                                                                </div>
                            <section className="max-w-6xl mx-auto px-4 py-14 mb-20">
                                <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center tracking-tight reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                                    Latest News & Updates
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* News Card 1 */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col hover:shadow-2xl group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                                        <div className="relative mb-5">
                                            <img src={fits} alt="FITS Center" className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                                            <span className="absolute top-3 right-3 bg-blue-700 text-blue-50 text-xs px-3 py-1 rounded-full font-bold shadow">New</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-blue-900 mb-2">FITS Center Launches New Farmer Training</h3>
                                        <p className="text-gray-800 text-base mb-4 font-semibold">
                                            The FITS Center recently conducted a hands-on training session for local farmers, focusing on sustainable crop management and modern agricultural techniques.
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-blue-700 text-sm font-semibold">June 2024</span>
                                            <a
                                                href="https://ati.da.gov.ph/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 font-bold hover:underline flex items-center gap-1 transition"
                                            >
                                                Read More
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    {/* News Card 2 */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col hover:shadow-2xl group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
                                        <div className="relative mb-5">
                                            <img src={img4} alt="Organic Farming" className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                                            <span className="absolute top-3 right-3 bg-blue-600 text-blue-50 text-xs px-3 py-1 rounded-full font-bold shadow">Update</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-blue-900 mb-2">Organic Farming Initiative Expands</h3>
                                        <p className="text-gray-800 text-base mb-4 font-semibold">
                                            Our organic farming program has expanded to include more barangays, promoting healthier produce and eco-friendly practices across the region.
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-blue-700 text-sm font-semibold">May 2024</span>
                                            <a
                                                href="https://ati.da.gov.ph/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 font-bold hover:underline flex items-center gap-1 transition"
                                            >
                                                Read More
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    {/* News Card 3 */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col hover:shadow-2xl group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
                                        <div className="relative mb-5">
                                            <img src={img5} alt="Rabies Control" className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                                            <span className="absolute top-3 right-3 bg-blue-500 text-blue-50 text-xs px-3 py-1 rounded-full font-bold shadow">Event</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-blue-900 mb-2">Rabies Awareness Campaign</h3>
                                        <p className="text-gray-800 text-base mb-4 font-semibold">
                                            The Rabies Control team held a successful awareness drive, educating pet owners and distributing free vaccines to ensure community safety.
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-blue-700 text-sm font-semibold">April 2024</span>
                                            <a
                                                href="https://ati.da.gov.ph/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 font-bold hover:underline flex items-center gap-1 transition"
                                            >
                                                Read More
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div>
                                <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center tracking-tight reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100 ">
                                    Why Choose Us?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-15 max-w-5xl mx-auto">
                                    {/* Card 1 */}
                                    <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600 shadow-xl rounded-lg border border-blue-900 flex flex-col items-center p-10 hover:scale-105 hover:shadow-2xl transition-all duration-300 reveal-on-scroll opacity-0 translate-y-10 delay-100">
                                        <div className="bg-blue-800 rounded-full p-4 mb-5 shadow">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-50 mb-2 text-center">Expert Support</h3>
                                        <p className="text-blue-100 text-center text-base font-semibold">
                                            Our team provides expert guidance and support to help you succeed in agriculture.
                                        </p>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600 shadow-xl rounded-lg border border-blue-900 flex flex-col items-center p-10 hover:scale-105 hover:shadow-2xl transition-all duration-300 reveal-on-scroll opacity-0 translate-y-10 delay-100">
                                        <div className="bg-blue-800 rounded-full p-4 mb-5 shadow">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-6a4 4 0 100-8 4 4 0 000 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-50 mb-2 text-center">Community Focus</h3>
                                        <p className="text-blue-100 text-center text-base font-semibold">
                                            We are dedicated to uplifting communities and fostering sustainable growth.
                                        </p>
                                    </div>
                                    {/* Card 3 */}
                                    <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600 shadow-xl rounded-lg border border-blue-900 flex flex-col items-center p-10 hover:scale-105 hover:shadow-2xl transition-all duration-300 reveal-on-scroll opacity-0 translate-y-10 delay-100">
                                        <div className="bg-blue-800 rounded-full p-4 mb-5 shadow">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-50 mb-2 text-center">Trusted & Secure</h3>
                                        <p className="text-blue-100 text-center text-base font-semibold">
                                            We ensure your data and interactions are safe and handled with integrity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                </section>
            </main>

           

            <section className="max-w-6xl mx-auto px-4 py-14 mb-20">
                <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center tracking-tight reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                    Testimonials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-900 p-8 flex flex-col items-center hover:shadow-2xl reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Testimonial 1" className="w-20 h-20 rounded-full mb-4 border-4 border-blue-800" />
                        <p className="text-blue-100 text-base mb-4 font-semibold text-center">
                            "Thanks to Agri-Connect, I learned new farming techniques that doubled my harvest. The support team is always ready to help!"
                        </p>
                        <span className="text-blue-400 font-bold">Juan Dela Cruz</span>
                        <span className="text-blue-500 text-xs">Farmer, Tanza</span>
                    </div>
                    <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-900 p-8 flex flex-col items-center hover:shadow-2xl reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Testimonial 2" className="w-20 h-20 rounded-full mb-4 border-4 border-blue-800" />
                        <p className="text-blue-100 text-base mb-4 font-semibold text-center">
                            "The FITS Center's organic farming program helped our community grow healthier food and protect our environment."
                        </p>
                        <span className="text-blue-400 font-bold">Maria Santos</span>
                        <span className="text-blue-500 text-xs">Barangay Leader</span>
                    </div>
                    <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-900 p-8 flex flex-col items-center hover:shadow-2xl reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
                        <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Testimonial 3" className="w-20 h-20 rounded-full mb-4 border-4 border-blue-800" />
                        <p className="text-blue-100 text-base mb-4 font-semibold text-center">
                            "I attended the Agri Bootcamp and learned so much about sustainable agriculture. Highly recommended for the youth!"
                        </p>
                        <span className="text-blue-400 font-bold">Mark Reyes</span>
                        <span className="text-blue-500 text-xs">Student</span>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-14 mb-20">
                <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center tracking-tight reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    <details className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow border border-blue-900 p-6 group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                        <summary className="font-bold text-blue-200 cursor-pointer flex items-center justify-between">
                            What is the FITS Program?
                            <span className="ml-2 text-blue-400 group-open:rotate-180 transition-transform">&#9660;</span>
                        </summary>
                        <p className="mt-3 text-blue-100 font-semibold">
                            The Farmers' Information and Technology Services (FITS) Program provides agricultural information, training, and technology support to farmers and stakeholders.
                        </p>
                    </details>
                    <details className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow border border-blue-900 p-6 group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
                        <summary className="font-bold text-blue-200 cursor-pointer flex items-center justify-between">
                            How can I join your programs?
                            <span className="ml-2 text-blue-400 group-open:rotate-180 transition-transform">&#9660;</span>
                        </summary>
                        <p className="mt-3 text-blue-100 font-semibold">
                            You can join by contacting us through our website, visiting the FITS Center, or following our social media for announcements and registration details.
                        </p>
                    </details>
                    <details className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow border border-blue-900 p-6 group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
                        <summary className="font-bold text-blue-200 cursor-pointer flex items-center justify-between">
                            Are your services free?
                            <span className="ml-2 text-blue-400 group-open:rotate-180 transition-transform">&#9660;</span>
                        </summary>
                        <p className="mt-3 text-blue-100 font-semibold">
                            Most of our services, trainings, and consultations are free for local farmers and community members, thanks to government and partner support.
                        </p>
                    </details>
                    <details className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow border border-blue-900 p-6 group reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-400">
                        <summary className="font-bold text-blue-200 cursor-pointer flex items-center justify-between">
                            How do I get updates on events?
                            <span className="ml-2 text-blue-400 group-open:rotate-180 transition-transform">&#9660;</span>
                        </summary>
                        <p className="mt-3 text-blue-100 font-semibold">
                            Subscribe to our newsletter, follow us on social media, or regularly check our website for the latest news and event schedules.
                        </p>
                    </details>
                </div>
            </section>

            <section className="max-w-3xl mx-auto px-8 py-14 mb-20">
                <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center tracking-tight reveal-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                    Useful External Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <a
                        href="https://www.da.gov.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-900/90 rounded-full shadow-xl border border-blue-800 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 reveal-on-scroll opacity-0 translate-y-10 delay-100"
                    >
                        <span className="bg-blue-700 rounded-full p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                            </svg>
                        </span>
                        <h3 className="font-bold text-lg text-blue-50 mb-2 text-center">Department of Agriculture</h3>
                        
                    </a>
                    <a
                        href="https://ati.da.gov.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-900/90 rounded-full shadow-xl border border-blue-800 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 reveal-on-scroll opacity-0 translate-y-10 delay-200"
                    >
                        <span className="bg-blue-700 rounded-full p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-6a4 4 0 100-8 4 4 0 000 8z" />
                            </svg>
                        </span>
                        <h3 className="font-bold text-lg text-blue-50 mb-2 text-center">Agricultural Training Institute</h3>
                        
                    </a>
                    <a
                        href="https://www.philrice.gov.ph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-900/90 rounded-full shadow-xl border border-blue-800 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 reveal-on-scroll opacity-0 translate-y-10 delay-300"
                    >
                        <span className="bg-blue-700 rounded-full p-4 mb-4 ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" />
                            </svg>
                        </span>
                        <h3 className="font-bold text-lg text-blue-50 mb-2 text-center">PhilRice</h3>
                       
                    </a>
                </div>
            </section>

            <footer className="bg-blue-950 text-blue-100 pt-12 pb-8">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                    {/* Brand & Description */}
                    <div className="flex-1 mb-8 md:mb-0">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-800 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2z" />
                                </svg>
                            </span>
                            <span className="text-2xl font-extrabold tracking-tight">FITS-Tanza</span>
                        </div>
                        <p className="text-blue-100 text-base max-w-xs font-semibold">
                            Advancing sustainable agriculture and community well-being through innovation and dedicated support.
                        </p>
                    </div>
                    {/* Quick Links */}
                    <div className="flex-1 mb-8 md:mb-0">
                        <h4 className="font-semibold text-blue-100 mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-blue-100 text-base font-semibold">
                            <li>
                                <a
                                    href="/about"
                                    className="hover:text-blue-400 transition"
                                    onClick={e => { e.preventDefault(); window.location = '/about'; }}
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/seminar"
                                    className="hover:text-blue-400 transition"
                                    onClick={e => { e.preventDefault(); window.location = '/seminar'; }}
                                >
                                    Programs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="hover:text-blue-400 transition"
                                    onClick={e => { e.preventDefault(); window.location = '/contact'; }}
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Social Media */}
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-100 mb-3">Connect with us</h4>
                        <div className="flex gap-5 mb-4">
                            <a
                                href="https://facebook.com/fitstanza"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="bg-blue-800 hover:bg-blue-700 rounded-full p-2 transition"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-blue-100">
                                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                                </svg>
                            </a>
                            <a
                                href="https://twitter.com/fitstanza"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                className="bg-blue-800 hover:bg-blue-700 rounded-full p-2 transition"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-blue-100">
                                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 00-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.634A9.936 9.936 0 0024 4.557z"/>
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com/fitstanzacavite"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="bg-blue-800 hover:bg-blue-700 rounded-full p-2 transition"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-blue-100">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.974.975 1.244 2.242 1.306 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.306 3.608-.975.974-2.242 1.244-3.608 1.306-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.306-.974-.975-1.244-2.242-1.306-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.332-2.633 1.306-3.608C4.513 2.565 5.78 2.295 7.146 2.233 8.412 2.17 8.792 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.127 4.659.392 3.678 1.373c-.98.98-1.245 2.092-1.302 3.373C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.613.057 1.281.322 2.393 1.302 3.373.98.98 2.092 1.245 3.373 1.302C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.057 2.393-.322 3.373-1.302.98-.98 1.245-2.092 1.302-3.373.058-1.281.07-1.69.07-7.613 0-5.923-.012-6.332-.07-7.613-.057-1.281-.322-2.393-1.302-3.373-.98-.98-2.092-1.245-3.373-1.302C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                                </svg>
                            </a>
                        </div>
                        <p className="text-blue-200 text-xs">&copy; {new Date().getFullYear()} FITS-Tanza. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            <style>{`
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
            `}</style>
        </>
    )
}
