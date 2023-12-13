
import { CheckCircleIcon, XMarkIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { useEffect } from 'react';

const Alert = ({ open, setOpen, message, duration, type="success" }) => {
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setOpen(false)
            }, duration * 1000);
        }
    }, [open])

    if(type == "success"){
        return (
            <>
                {open && <div className='fixed top-0 left-0 right-0 w-screen flex items-center justify-center'>
                    <div className="rounded-md bg-green-50 p-4 m-2">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{message}</p>
                            </div>
                            <div className="ml-auto pl-3 flex items-center">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </>
        )
    }
    
    if(type == "error"){
        return (
            // Todo: remove duplicate jsx from success and error blocks
            <>
                {open && <div className='fixed top-0 left-0 right-0 w-screen flex items-center justify-center'>
                <div className="rounded-md bg-red-50 p-4 m-2">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{message}</h3>
                        </div>
                        <div className="ml-auto pl-3 flex items-center">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>}
            </>
        )
    }
}

export default Alert