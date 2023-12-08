
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'

const Alert = ({ open, setOpen }) => {
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setOpen(false)
            }, 5000);
        }
    }, [open])

    return (
        <>
            {open && <div className='fixed top-0 left-0 right-0 w-screen flex items-center justify-center'>
                <div className="rounded-md bg-green-50 p-4 mt-2">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">Successfully uploaded</p>
                        </div>
                        <div className="ml-auto pl-3">
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


export default Alert