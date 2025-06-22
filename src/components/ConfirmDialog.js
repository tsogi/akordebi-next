import { XMarkIcon } from '@heroicons/react/20/solid';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const ConfirmDialog = ({ open, setOpen, message, onConfirm, type = "error" }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!open || !mounted) return null;

    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const dialogContent = (
        <div 
            className='fixed top-0 left-0 w-full flex justify-center z-[9999]' 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
        >
            {/* Backdrop */}
            <div 
                className='fixed inset-0 bg-black bg-opacity-50' 
                onClick={handleCancel}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998 }}
            ></div>
            
            {/* Dialog positioned at top */}
            <div 
                className={`relative rounded-md ${type === "error" ? "bg-red-50" : "bg-blue-50"} p-4 m-4 max-w-md w-full shadow-lg`}
                style={{ marginTop: '20px', position: 'relative', zIndex: 10000 }}
            >
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-medium ${type === "error" ? "text-red-800" : "text-blue-800"}`}>
                            {message}
                        </h3>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`inline-flex rounded-md ${type === "error" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-blue-50 text-blue-500 hover:bg-blue-100"} p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === "error" ? "focus:ring-red-600 focus:ring-offset-red-50" : "focus:ring-blue-600 focus:ring-offset-blue-50"}`}
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${type === "error" ? "text-red-700 bg-red-100 hover:bg-red-200" : "text-blue-700 bg-blue-100 hover:bg-blue-200"} focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === "error" ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                        >
                            გათიშვა
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className={`px-4 py-2 text-sm font-medium rounded-md text-white ${type === "error" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === "error" ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                        >
                            დადასტურება
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(dialogContent, document.body);
};

export default ConfirmDialog; 