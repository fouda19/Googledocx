
import { useState } from "react";
function Doclist() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <section className="bg-white px-10 md:px-0">
            <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
                <div className="flex items-center justify-between pb-5 border-b-2 border-gray-200">
                    <h2 className="font-medium flex-grow">Recent documents</h2>
<div className="relative">
                    <button
                        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        Menu
                    </button>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl">
                            <a href="#" className="block px-4 py-2 text-black hover:bg-gray-200">Item 1</a>
                            <a href="#" className="block px-4 py-2 text-black hover:bg-gray-200">Item 2</a>
                            <a href="#" className="block px-4 py-2 text-black hover:bg-gray-200">Item 3</a>
                        </div>
                    )}

</div>
                    <p className="mr-12 italic">Date created</p>
                    {/* <Icon name="folder" size="3xl" color="blue" /> */}
                </div>
                {/* {snapshot?.docs.map((doc) => (
          <DocumentRow
            key={doc.id}
            id={doc.id}
            fileName={doc.data().filename}
            date={doc.data().timestamp}
          />
        ))} */}
            </div>
        </section>
    );
}

export default Doclist;