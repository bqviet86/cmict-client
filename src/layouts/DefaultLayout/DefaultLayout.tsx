import Header from '../components/Header'
import Footer from '../components/Footer'

function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className='mx-auto mt-[60px] box-content min-h-[calc(100vh-60px-268px)] max-w-7xl px-2'>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default DefaultLayout
