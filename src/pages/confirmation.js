import { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

const product = {
    name: 'Zip Tote Basket',
    price: '$220',
    rating: 3.9,
    href: '#',
    description:
        'The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
    imageAlt: 'Back angled view with bag open and handles to the side.',
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const [open, setOpen] = useState(true)
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const toggleConfirmationModal = () => {
        setOpenConfirmation(!openConfirmation)
        setOpen(false)
    }

    const onClose = () => {
        //  close logic here 
    }

    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                                enterTo="opacity-100 translate-y-0 md:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            >
                                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                    <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                        <button
                                            type="button"
                                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>

                                        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                                            <div className="sm:col-span-4 lg:col-span-5">
                                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                                                    <img src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center" />
                                                </div>
                                            </div>
                                            <div className="sm:col-span-8 lg:col-span-7">
                                                <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

                                                <section aria-labelledby="information-heading" className="mt-3">
                                                    <h3 id="information-heading" className="sr-only">
                                                        Product information
                                                    </h3>

                                                    <p className="text-2xl text-gray-900">{product.price}</p>

                                                    {/* Reviews */}
                                                    <div className="mt-3">
                                                        <h4 className="sr-only">Reviews</h4>
                                                        <div className="flex items-center">
                                                            <div className="flex items-center">
                                                                {[0, 1, 2, 3, 4].map((rating) => (
                                                                    <StarIcon
                                                                        key={rating}
                                                                        className={classNames(
                                                                            product.rating > rating ? 'text-gray-400' : 'text-gray-200',
                                                                            'h-5 w-5 flex-shrink-0'
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className="sr-only">{product.rating} out of 5 stars</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6">
                                                        <h4 className="sr-only">Description</h4>

                                                        <p className="text-sm text-gray-700">{product.description}</p>
                                                    </div>
                                                </section>

                                                <section aria-labelledby="options-heading" className="mt-6">
                                                    <h3 id="options-heading" className="sr-only">
                                                        Product options
                                                    </h3>

                                                    <form>
                                                        <div className="grid gap-6 mb-3 md:grid-cols-2">
                                                            <div>
                                                                <label for="name" className="block mb-2 text-sm font-medium text-black">Name</label>
                                                                <input type="text" id="name" className="border border-indigo-600 bg-gray-50 text-gray-900 text-sm rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Name" required />
                                                            </div>
                                                            <div>
                                                                <label for="number" className="block mb-2 text-sm font-medium text-black">Phone number</label>
                                                                <input type="tel" id="number" className="border border-indigo-600 bg-gray-50 text-black text-sm rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Phone number" required />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label for="address" className="block mb-1 text-sm font-medium text-black">Address</label>
                                                            <input type="text" id="address" className="border border-indigo-600 bg-gray-50 text-gray-900 text-sm rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Address" required />
                                                        </div>
                                                        <div className="mt-6">
                                                            <button
                                                                type="button"
                                                                onClick={toggleConfirmationModal}
                                                                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                                            >
                                                                Add to bag
                                                            </button>
                                                        </div>
                                                    </form>
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {openConfirmation && <div className='fixed z-50 inset-0 bg-gray-300/60 flex items-center justify-center'>
                <div className='w-1/3 min-w-[400px] h-[300px] bg-white rounded-2xl text-black px-4 py-8 relative flex flex-col items-center justify-center'>
                    <h2 className='text-lg font-semibold mt-8 text-center'>Order recevied</h2>
                    <Link href={'/'} className='bg-green-600 mt-8 hover:bg-green-700 py-2 px-6 rounded-lg text-white cursor-pointer'>Ok</Link>
                    <XMarkIcon
                        className="block h-8 w-8 text-red-400 cursor-pointer hover:text-red-700 absolute right-3 top-3"
                        aria-hidden="true"
                        onClick={toggleConfirmationModal}
                    />
                </div>
            </div>}
        </>

    )
}
