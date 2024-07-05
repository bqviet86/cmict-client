import { useRef } from 'react'
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { SwiperModule } from 'swiper/types'
import { Icon } from '@iconify/react'

import 'swiper/css/bundle'

type SliderProps = {
    children: React.ReactNode[]
    slidesPerView?: number
    loop?: boolean
    delay?: number
    modules?: SwiperModule[]
    onSlideChange?: (swiper: SwiperClass) => void
    data: any[]
}

function Slider({
    children,
    slidesPerView = 1,
    loop = false,
    delay = 5000,
    modules = [],
    onSlideChange = () => {},
    data
}: SliderProps) {
    const swiperRef = useRef<SwiperRef>(null)

    const handlePrevSlider = () => {
        if (!swiperRef.current) return
        swiperRef.current.swiper.slidePrev()
    }

    const handleNextSlider = () => {
        if (!swiperRef.current) return
        swiperRef.current.swiper.slideNext()
    }

    return (
        <div className='relative aspect-[16/5] max-h-[280px] w-full'>
            <Swiper
                ref={swiperRef}
                slidesPerView={slidesPerView}
                loop={loop}
                modules={modules}
                {...(modules.includes(Pagination) && {
                    pagination: {
                        clickable: true,
                        renderBullet: function (_, className) {
                            return `<span class="${className}"></span>`
                        }
                    }
                })}
                {...(modules.includes(Autoplay) && { autoplay: { delay } })}
                {...(modules.includes(EffectFade) && { effect: 'fade' })}
                onSlideChange={onSlideChange}
                className='h-full w-full'
            >
                {data.map((_, index) => (
                    <SwiperSlide key={index}>{children[index]}</SwiperSlide>
                ))}
            </Swiper>

            <button
                className='absolute left-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(0,0,0,0.3)] text-xl text-white sm:h-12 sm:w-12'
                onClick={handlePrevSlider}
            >
                <Icon icon='ph:caret-left-bold' />
            </button>

            <button
                className='absolute right-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(0,0,0,0.3)] text-xl text-white sm:h-12 sm:w-12'
                onClick={handleNextSlider}
            >
                <Icon icon='ph:caret-right-bold' />
            </button>
        </div>
    )
}

export default Slider
