import AdminSidebar from '../components/AdminSidebar'
import AdminHeader from '../components/AdminHeader'

function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex'>
            <AdminSidebar />

            <div className='w-[calc(100%-280px)] bg-[#f0f2f5]'>
                <AdminHeader />
                <div className='mx-auto max-w-full p-4'>{children}</div>
            </div>
        </div>
    )
}

export default AdminLayout
