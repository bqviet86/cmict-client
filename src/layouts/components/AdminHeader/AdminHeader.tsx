import { useContext } from 'react'

import images from '~/assets/images'
import { AppContext } from '~/contexts/appContext'

function AdminHeader() {
    const { user } = useContext(AppContext)

    return (
        user && (
            <header className='sticky top-0 z-50 flex items-center justify-between bg-white px-5 py-4 shadow-md'>
                <h2 className='text-2xl font-semibold'>Admin</h2>

                <div className='flex items-center gap-4'>
                    <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#eff4fb]'>
                        <svg
                            className='h-6 w-6 text-[#64748b]'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z'
                            />
                        </svg>
                    </div>

                    <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#eff4fb]'>
                        <svg
                            className='h-7 w-7 text-[#64748b]'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z'
                            />
                        </svg>
                    </div>

                    <div className='h-10 w-10 cursor-pointer overflow-hidden rounded-full'>
                        <img
                            src={
                                user.avatar ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${user.avatar}` : images.avatar
                            }
                            alt='avatar'
                            className='h-full w-full object-cover'
                        />
                    </div>
                </div>
            </header>
        )
    )
}

export default AdminHeader
