import { Link, NavLink } from 'react-router-dom'
import images from '~/assets/images'

import { routes } from '~/config'
import { ADMIN_SIDEBAR_ROUTES } from '~/constants/interfaceData'

function AdminSidebar() {
    return (
        <div className='sticky left-0 top-0 z-50 h-screen w-[280px] min-w-[280px] bg-[#1c2434] text-[#e4e6eb]'>
            <Link to={routes.home} className='mx-5 my-6 flex cursor-pointer items-center gap-2'>
                <img src={images.logo} alt='logo' className='h-16' />
                <span className='text-4xl font-bold text-white'>CMICT</span>
            </Link>

            <nav className='p-4'>
                {ADMIN_SIDEBAR_ROUTES.map(({ path, title, icon }, index) => (
                    <NavLink
                        key={index}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center rounded-md px-4 py-3 transition-all hover:bg-[#333a48] [&+&]:mt-3 ${
                                isActive ? 'bg-[#333a48]' : 'bg-transparent'
                            }`
                        }
                    >
                        {icon}
                        <span className='flex-[1]'>{title}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default AdminSidebar
