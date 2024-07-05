import { useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Icon } from '@iconify/react'

import { getMe, logoutUser } from '~/apis/users.apis'
import images from '~/assets/images'
import { routes } from '~/config'
import {
    HEADER_MENU_ITEMS_ADMIN,
    HEADER_MENU_ITEMS_LOGGED_IN,
    HEADER_NAVIGATIONS_ROUTES,
    HEADER_NAVIGATIONS_ROUTES_LOGGED_IN
} from '~/constants/interfaceData'
import { UserRole } from '~/constants/enums'
import { AppContext } from '~/contexts/appContext'
import { User } from '~/types/users.types'
import { removeTokenFromLS, removeUserFromLS, setUserToLS } from '~/utils/localStorage'
import { listenEvent } from '~/utils/event'

function Header() {
    const { user, setUser, token } = useContext(AppContext)
    const [isShowNav, setIsShowNav] = useState<boolean>(false)
    const [showMenuUser, setShowMenuUser] = useState<boolean>(false)

    const navRef = useRef<HTMLDivElement>(null)

    const access_token = token?.access_token || null
    const refresh_token = token?.refresh_token || null

    const handleShowNav = () => {
        setIsShowNav(!isShowNav)
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof Element && !e.target.closest('.closest-header-menu')) {
                setShowMenuUser(false)
            }
        }

        if (showMenuUser) {
            window.addEventListener('click', handleClick)
        }

        return () => window.removeEventListener('click', handleClick)
    }, [showMenuUser])

    const { data: myProfile } = useQuery({
        queryKey: ['me'],
        queryFn: () => getMe(),
        enabled: !!access_token
    })

    useEffect(() => {
        if (myProfile) {
            setUser(myProfile.data.result as User)
            setUserToLS(myProfile.data.result as User)
        }
    }, [myProfile])

    const { mutate: mutateLogout } = useMutation({
        mutationFn: (refresh_token: string) => logoutUser(refresh_token)
    })

    const handleLogoutSuccess = () => {
        removeUserFromLS()
        removeTokenFromLS()
        window.location.href = routes.home
    }

    const handleLogout = () => {
        mutateLogout(refresh_token as string, {
            onSuccess: handleLogoutSuccess
        })
    }

    useEffect(() => {
        const remove = listenEvent('force-logout', handleLogoutSuccess)
        return remove
    }, [])

    return (
        <header className='fixed inset-x-0 top-0 z-40 h-[60px] border-b border-solid border-[#295173] bg-[#5cb3ff] px-4 shadow-md'>
            <div className='mx-auto flex h-full max-w-7xl items-center justify-between bg-[#5cb3ff]'>
                <Link to={routes.home} className='flex items-center'>
                    <img src={images.logo} alt='logo' className='w-10' />
                    <span className='ml-2 text-xl text-white'>CMICT</span>
                </Link>

                <div className='flex items-center gap-2 lg:gap-1'>
                    <button
                        className='rounded-md border-[2px] border-solid border-[#fff] text-[32px] text-[#fff] lg:hidden'
                        onClick={handleShowNav}
                    >
                        <Icon icon='ic:baseline-menu' />
                    </button>

                    <nav
                        ref={navRef}
                        className='absolute left-0 top-[calc(100%+1px)] w-full overflow-hidden bg-[#5cb3ff] transition-all lg:static lg:!h-auto lg:w-auto'
                        style={{ height: isShowNav ? navRef.current?.scrollHeight : 0 }}
                    >
                        <div className='py-2 lg:flex lg:h-full lg:items-center lg:gap-1 lg:p-0'>
                            {(user ? HEADER_NAVIGATIONS_ROUTES_LOGGED_IN : HEADER_NAVIGATIONS_ROUTES).map(
                                ({ path, title, icon }, index) => (
                                    <NavLink key={index} to={path} onClick={() => setIsShowNav(false)}>
                                        {({ isActive }) => (
                                            <div
                                                className={`flex items-center px-4 py-2 text-white transition-all lg:rounded-md lg:px-2 lg:py-1 xl:px-3 xl:py-1.5 [&>svg]:text-[20px] ${
                                                    isActive ? 'bg-[#295173]' : 'hover:text-[#295173]'
                                                }`}
                                            >
                                                {icon}
                                                <span className='ml-2 lg:ml-1 xl:ml-2'>{title}</span>
                                            </div>
                                        )}
                                    </NavLink>
                                )
                            )}
                        </div>
                    </nav>

                    {user && (
                        <div className='relative'>
                            <div
                                className='closest-header-menu flex cursor-pointer items-center'
                                onClick={() => {
                                    setIsShowNav(false)
                                    setShowMenuUser(!showMenuUser)
                                }}
                            >
                                <img
                                    src={
                                        user.avatar
                                            ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${user.avatar}`
                                            : images.avatar
                                    }
                                    alt='avatar'
                                    className='h-8 w-8 rounded-full object-cover'
                                />
                            </div>

                            <ul
                                className={`closest-header-menu absolute right-0 top-[calc(100%+20px)] w-max min-w-[160px] overflow-hidden rounded-md shadow-md transition-all ${
                                    showMenuUser ? 'visible opacity-100' : 'invisible opacity-0'
                                }`}
                            >
                                <li className='relative bg-[#5cb3ff] p-1 after:absolute after:inset-x-0 after:bottom-0 after:mx-3 after:h-[1px] after:bg-[#ddd] after:content-[""]'>
                                    <div className='flex items-center rounded p-2'>
                                        <img
                                            src={
                                                user.avatar
                                                    ? `${import.meta.env.VITE_IMAGE_URL_PREFIX}/${user.avatar}`
                                                    : images.avatar
                                            }
                                            alt='avatar'
                                            className='h-10 w-10 rounded-full object-cover'
                                        />
                                        <div className='ml-2 flex flex-col'>
                                            <span className='text-base font-medium leading-none text-white'>
                                                {user.name}
                                            </span>
                                            <span className='mt-1 text-[13px] leading-none text-white'>
                                                {user.username}
                                            </span>
                                        </div>
                                    </div>
                                </li>

                                {(user.role === UserRole.User
                                    ? HEADER_MENU_ITEMS_LOGGED_IN
                                    : HEADER_MENU_ITEMS_ADMIN
                                ).map((item, index) => {
                                    const Comp: React.ElementType<any> = item.path ? Link : 'div'
                                    return (
                                        <li key={index} className='bg-[#5cb3ff] p-1'>
                                            <Comp
                                                className='flex cursor-pointer items-center rounded p-2 transition-all hover:bg-white/10 [&>svg]:text-xl [&>svg]:text-white'
                                                onClick={() => setShowMenuUser(false)}
                                                {...(item.path ? { to: item.path } : { onClick: handleLogout })}
                                            >
                                                {item.icon}
                                                <span className='ml-2 text-white'>{item.title}</span>
                                            </Comp>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
