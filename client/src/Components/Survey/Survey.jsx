import React from "react";
import Navbar from "../Navigation/Navbar";
const SurveyForm = () => {
  return (
    <>
    
        
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-25">
                {/* Header */}
                <div className="bg-blue-900 text-white p-4 text-center">
                    <h2 className="text-lg font-bold my-2">Customer Satisfactory Survey</h2>
                    <p className="text-sm my-2">Please help Fits improve by taking this short survey. We value your feedback.</p>
                </div>

                {/* Satisfaction Section */}
                <div className="p-6">
                    <p className="text-gray-700 mb-2">How satisfied are you with the service you received?</p>
                    <div className="space-y-2">
                    {["Highly satisfied", "Moderately satisfied", "Satisfied", "Barely Satisfied", "Not Satisfied"].map((option) => (
                        <label key={option} className="flex items-center space-x-2">
                        <input type="radio" name="satisfaction" value={option.toLowerCase().replace(" ", "_")} className="accent-blue-900" />
                        <span className="text-gray-800">{option}</span>
                        </label>
                    ))}
                    </div>
                </div>

            {/* Remarks Section */}
            <div className="p-6">
                <label className="block text-gray-700">Remarks</label>
                <textarea className="w-full mt-2 p-3 border rounded-lg focus:ring focus:ring-blue-300" rows="4" placeholder="Write your feedback here..."></textarea>
            </div>

            {/* Submit Button */}
            <div className="px-6 pb-6">
                <button className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition">Submit</button>
            </div>
            </div>
          
</>
  );
};

export default SurveyForm;