import React from 'react'
import Navbar from '../../../Components/Navigation/Navbar'
import cover from '../../../Services/Authentication/Assets/Cover.jpg'
import fits from '../Assets/fits.jpg'
import img1 from '../Assets/1.jpg'
import img2 from '../Assets/2.jpg'
import img3 from '../Assets/3.jpg' 
import img4 from '../Assets/4.jpg'
import img5 from '../Assets/rabies.jpg'

export default function Landing() {
    return (
        <Navbar>
            <main className="mt-15">
                <div className="flex flex-col text-black mt-10 w-full max-w-full mx-auto rounded-lg shadow-lg p-8">
                    <div className="flex flex-col mt-10 mb-20">
                        <div className='border border-gray-400 -translate-y-10'></div>
                        <img src={fits} alt="Fits Program" className="mx-auto mt-0 mb-10 w-full rounded" />
                        <div className="flex flex-col justify-center ">
                            <div className="flex items-center mb-5">
                                <h1 className="font-semibold text-2xl mr-4 0">Mission</h1>
                                <div className="flex-1 h-px bg-gray-400"></div>
                            </div>
                            <p className="text-justify mb-8">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae ipsum adipisci velit voluptate vitae, ullam maiores odio facere maxime autem quis eos atque assumenda itaque voluptates blanditiis dicta soluta culpa! Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, doloremque illum veritatis ad praesentium nulla, recusandae quo odio ab in error veniam temporibus nisi minus dolorem corrupti, commodi inventore iste.
                            </p>
                            <div className="flex items-center my-5">
                                <h1 className="font-semibold text-2xl mr-4">Vision</h1>
                                <div className="flex-1 h-px bg-gray-400"></div>
                            </div>
                            <p className="text-justify mb-8">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae ipsum adipisci velit voluptate vitae, ullam maiores odio facere maxime autem quis eos atque assumenda itaque voluptates blanditiis dicta soluta culpa! Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, doloremque illum veritatis ad praesentium nulla, recusandae quo odio ab in error veniam temporibus nisi minus dolorem corrupti, commodi inventore iste.
                            </p>
                        </div>
                        <div className="flex items-center my-10 text-center">   
                            <h2 className="font-semibold text-2xl text-center mr-4">Our Programs</h2>
                            <div className="flex-1 h-px bg-gray-400"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-10">
                            {/* FITS Program */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-10">
                                <img
                                    src={img1}
                                    alt="FITS Program"
                                    className="w-72 h-72 object-cover rounded mb-2 sm:mb-0 sm:mr-10 mx-auto sm:mx-0"
                                />
                                <span className="font-medium mx-0 sm:mx-0 mt-4 sm:mt-0 text-center sm:text-left text-justify">
                                    FITS Program Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus molestiae officiis labore officia voluptatibus ex numquam. Dolor molestiae temporibus iusto quae dolorem non similique impedit debitis asperiores error! Architecto, nihil.
                                </span>
                            </div>
                            <div className="w-full h-px bg-gray-300 my-6"></div>
                            {/* Crop Production */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-10">
                                <img
                                    src={img2}
                                    alt="Crop Production"
                                    className="w-72 h-72 object-cover rounded mb-2 sm:mb-0 sm:mr-10 mx-auto sm:mx-0"
                                />
                                <span className="font-medium mx-0 sm:mx-0 mt-4 sm:mt-0 text-center sm:text-left text-justify">
                                    Crop Production Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non consequuntur voluptatum provident eius minus ipsam qui possimus rem tempora maxime hic laborum reprehenderit quibusdam labore, recusandae beatae excepturi rerum dolor.
                                </span>
                            </div>
                            <div className="w-full h-px bg-gray-300 my-6"></div>
                            {/* Fisheries Program */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-10">
                                <img
                                    src={img3}
                                    alt="Fisheries Program"
                                    className="w-72 h-72 object-cover rounded mb-2 sm:mb-0 sm:mr-10 mx-auto sm:mx-0"
                                />
                                <span className="font-medium mx-0 sm:mx-0 mt-4 sm:mt-0 text-center sm:text-left text-justify">
                                    Fisheries Program Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus modi aperiam impedit unde quod a voluptatem rerum aliquam possimus incidunt. Praesentium, excepturi blanditiis doloribus dolore dolor repellat doloremque quis officiis?
                                </span>
                            </div>
                            <div className="w-full h-px bg-gray-300 my-6"></div>
                            {/* Organic Farming */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-10">
                                <img
                                    src={img4}
                                    alt="Organic Farming"
                                    className="w-72 h-72 object-cover rounded mb-2 sm:mb-0 sm:mr-10 mx-auto sm:mx-0"
                                />
                                <span className="font-medium mx-0 sm:mx-0 mt-4 sm:mt-0 text-center sm:text-left text-justify">
                                    Organic Farming Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate quod doloribus at exercitationem voluptates eaque possimus non necessitatibus ut laborum soluta vitae quia, incidunt ipsam labore suscipit recusandae fugiat quasi.
                                </span>
                            </div>
                            <div className="w-full h-px bg-gray-300 my-6"></div>
                            {/* Rabies Control */}
                            <div className="flex flex-col items-center mb-10">
                                <img src={img5} alt="Rabies Control" className="w-72 h-72 object-cover rounded mb-2 mx-auto" />
                                <span className="font-medium my-10 text-center text-justify">
                                    Rabies Control Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime quam deserunt voluptatem assumenda possimus repellendus exercitationem expedita, molestiae itaque perspiciatis dolorum nisi dignissimos ex non sapiente veniam velit! At, dolore.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Navbar>
    )
}
