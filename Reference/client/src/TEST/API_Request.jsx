import { useEffect, useRef, useState } from 'react';

function API_Request() {

    // INPUT
    const [inputData1, setInputData1] = useState('');
    const [inputData2, setInputData2] = useState('');
    const data1_ref = useRef(null);
    const data2_ref = useRef(null);

    // OUTPUT
    const [dataList, setDataList] = useState([]);

    const testRequest = async ()=>{

        const response = await fetch("/api/TEST/API_Response", {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                data1: inputData1,
                data2: inputData2
            })
        });

        // console.log(await response.text());
        const data = await response.json();

        if(!response.ok){
            alert("Response Failed\n" + data.message);
            return;
        }

        console.log("\n________________________________________________\n\nData: ");
        console.log(data);

        setDataList((prev)=>[...prev, ...data.payload])

        setInputData1('');
        setInputData2('');
        data1_ref.current.value = "";
        data2_ref.current.value = "";
    }

    useEffect(()=>{
        console.log("\nCurrent: ");
        console.log(dataList);
    }, [dataList])

    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 space-y-6">

                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    API Test Form
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        ref={data1_ref}
                        value={inputData1}
                        onChange={(e)=> setInputData1(e.target.value)}
                        placeholder="Enter test data"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        ref={data2_ref}
                        value={inputData2}
                        onChange={(e)=> setInputData2(e.target.value)}
                        placeholder="Enter test data"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                        onClick={testRequest}
                    >
                        Send Request
                    </button>
                </div>

            </div>

            <div className="bg-white p-8 rounded-lg shadow-md w-96 ml-6 h-[80vh] flex flex-col">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Response Data
                </h2>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {dataList.map((item, index) => (
                        <div key={index} className="p-6 border rounded-md hover:shadow-lg transition-shadow duration-200 bg-gray-50">
                            <p className="text-gray-800 text-center text-lg">
                                Data {index+1}: 
                                <span className="font-medium ml-2">{item}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default API_Request;
