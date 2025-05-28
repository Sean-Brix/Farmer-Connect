import React from 'react'
import Navbar from '../../../Components/Navigation/Navbar'
import Shovel from '../Assets/shovel.webp'
import Pandilig from '../Assets/pandilig.webp'  
import '../../../index.css' 

const equipmentList = [
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Pandilig',
        desc: 'njwdwsdwdwd. ',
        img: Pandilig,
    },
    {
        name: 'Plows',
        desc: 'Pang hukay ng bangkay to boss',
        img: Shovel,
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
    {
        name: 'Plows',
        desc: 'Used for turning over soil to prepare for planting.',
        img: 'plow-image-url',
    },
]


export default function EIC() {
    return (
        <>
            <Navbar>
                <div className="relative mt-30">
                    <hr className="border-black-300" />
                    <span className="absolute left-1/8 -translate-x-1/4 -top-5 bg-white  rounded-lg px-4 text-2xl font-semibold text-gray-700">
                        Available Programs
                    </span>
                </div>

                <div className="bg-gradient-to-b from-blue-400 to-blue-200 text-white mt-10 w-full rounded-lg max-h-[70vh] overflow-y-auto p-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {equipmentList.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center w-full mb-8 relative" style={{ minHeight: '350px' }}>
                                <img src={item.img} alt={item.name} className="w-full bg-blue-800 h-48 object-contain rounded-md mb-4" />
                                <div className="flex flex-col justify-center p-2 w-full pb-15">
                                    <h3 className="text-xl font-semibold mb-2 text-black ">{item.name}</h3>
                                    <p className="text-gray-600 mb-4">{item.desc}</p>
                                </div>
                                <div className="flex space-x-2 absolute bottom-4 left-1/2 -translate-x-1/2">
                                    <button className="bg-blue-900 text-white px-4 py-2 rounded-md border-2 border-black bg-blue-800 hover:bg-blue-600 transition-colors duration-200 font-bold ">Borrow</button>
                                    <button className="bg-gray-300 text-black px-4 py-2 rounded-md bg-white border-2 border-black hover:bg-gray-200 transition-colors duration-200  font-bold text-black">Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Navbar>
        </>
    )
}
