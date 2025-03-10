import { useState } from 'react'
import { Disclosure, Tab } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

const product = {
    name: 'Zip Tote Basket',
    price: '$140',
    rating: 4,
    images: [
        {
            id: 1,
            name: 'Angled view',
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
            alt: 'Angled front view with bag zipped and handles upright.',
        },
        {
            id: 2,
            name: 'Angled view',
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
            alt: 'Angled front view with bag zipped and handles upright.',
        },
        {
            id: 3,
            name: 'Angled view',
            src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
            alt: 'Angled front view with bag zipped and handles upright.',
        },

    ],
    description: `
    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
  `,
    details: [
        {
            name: 'Features',
            items: [
                'Multiple strap configurations',
                'Spacious interior with top zip',
                'Leather handle and tabs',
                'Interior dividers',
                'Stainless strap loops',
                'Double stitched construction',
                'Water-resistant',
            ],
        },
        {
            name: 'Care',
            items: [
                'Multiple strap configurations',
                'Spacious interior with top zip',
                'Leather handle and tabs',
                'Interior dividers',
                'Stainless strap loops',
                'Double stitched construction',
                'Water-resistant',
            ],
        },

    ],
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const toggleConfirmationModal = () => {
        setOpenConfirmation(!openConfirmation)
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                    {/* Image gallery */}
                    <Tab.Group as="div" className="flex flex-col-reverse">
                        {/* Image selector */}
                        <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                            <Tab.List className="grid grid-cols-4 gap-6">
                                {product.images.map((image) => (
                                    <Tab
                                        key={image.id}
                                        className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className="sr-only">{image.name}</span>
                                                <span className="absolute inset-0 overflow-hidden rounded-md">
                                                    <img src={image.src} alt="" className="h-full w-full object-cover object-center" />
                                                </span>
                                                <span
                                                    className={classNames(
                                                        selected ? 'ring-indigo-500' : 'ring-transparent',
                                                        'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </>
                                        )}
                                    </Tab>
                                ))}
                            </Tab.List>
                        </div>

                        <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                            {product.images.map((image) => (
                                <Tab.Panel key={image.id}>
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="h-full w-full object-cover object-center sm:rounded-lg"
                                    />
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">{product.price}</p>
                        </div>

                        {/* Reviews */}
                        <div className="mt-3">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            className={classNames(
                                                product.rating > rating ? 'text-indigo-500' : 'text-gray-300',
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
                            <h3 className="sr-only">Description</h3>

                            <div
                                className="space-y-6 text-base text-gray-700"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>

                        <form className="mt-6">
                            <div className="mt-10 flex">
                                <button
                                    type="button"
                                    onClick={toggleConfirmationModal}
                                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                                >
                                    Add to bag
                                </button>
                            </div>
                        </form>

                        <section aria-labelledby="details-heading" className="mt-12">
                            <h2 id="details-heading" className="sr-only">
                                Additional details
                            </h2>

                            <div className="divide-y divide-gray-200 border-t">
                                {product.details.map((detail) => (
                                    <Disclosure defaultOpen as="div" key={detail.name}>
                                        {({ open }) => (
                                            <>
                                                <h3>
                                                    <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                                                        <span
                                                            className={classNames(open ? 'text-indigo-600' : 'text-gray-900', 'text-sm font-medium')}
                                                        >
                                                            {detail.name}
                                                        </span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon
                                                                    className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <PlusIcon
                                                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                                                    <ul role="list">
                                                        {detail.items.map((item) => (
                                                            <li key={item}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            {openConfirmation && <div className='fixed inset-0 bg-gray-300/60 flex items-center justify-center'>
                <div className='w-1/3 min-w-[400px] h-[300px] bg-white rounded-2xl text-black px-4 py-8 relative flex flex-col items-center justify-start'>
                    <h2 className='text-lg font-semibold mt-8 text-center'>Are you sure ?</h2>
                    <p className='text-center w-2/3 my-6'>Do you really want to delete these records? This process cannot be undone.</p>
                    <div className='space-x-8 mt-8'>
                        <button className='bg-red-600 hover:bg-red-700 py-2 px-6 rounded-lg text-white' onClick={toggleConfirmationModal}>Cancel</button>
                        <button className='bg-green-600 hover:bg-green-700 py-2 px-6 rounded-lg text-white'>Confirm</button>
                    </div>
                    <XMarkIcon
                        className="block h-8 w-8 text-red-400 cursor-pointer hover:text-red-700 absolute right-3 top-3"
                        aria-hidden="true"
                        onClick={toggleConfirmationModal}
                    />

                </div>

            </div>}
        </div>
    )
}
