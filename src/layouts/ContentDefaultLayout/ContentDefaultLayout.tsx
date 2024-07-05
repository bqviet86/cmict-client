import NewPostsPanel from '~/components/NewPostsPanel'
import ReasonChooseICTPanel from '~/components/ReasonChooseICTPanel'
import DefaultLayout from '~/layouts/DefaultLayout'

function ContentDefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <DefaultLayout>
            <div className='-mx-2.5 flex flex-wrap justify-center py-5'>
                <div className='mx-2.5 w-[calc(100%-20px)] max-w-[720px] lg:w-[calc(66.66667%-20px)] lg:max-w-full'>
                    {children}
                </div>

                <div className='mx-2.5 mt-4 w-[calc(100%-20px)] max-w-[720px] lg:mt-0 lg:w-[calc(33.33333%-20px)] lg:max-w-full'>
                    <NewPostsPanel />
                    <ReasonChooseICTPanel className='mt-4' />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default ContentDefaultLayout
