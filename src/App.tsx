import { Fragment, useContext } from 'react'
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Wrapper from './Wrapper'
import { routes as routesConfig } from './config'
import { UserRole } from './constants/enums'
import { AppContext } from './contexts/appContext'
import routes, { Route as RouteType } from './routes'

function App() {
    const { user } = useContext(AppContext)
    const renderRoutes = (routes: RouteType[]) => {
        return routes.map((route, index) => {
            const isParent = !!route.children && route.children.length > 0
            const Layout = route.layout || Fragment
            const Page = route.component

            let element = (
                <Layout>
                    <Page />
                </Layout>
            )

            // Nếu đã đăng nhập mà truy cập vào các trang không cần thiết như login, register, ...
            if (route.unnecessary && user) {
                if (user.role === UserRole.Admin) {
                    element = <Navigate to={routesConfig.adminPosts} />
                } else {
                    element = <Navigate to={routesConfig.home} />
                }
            }

            // Nếu chưa đăng nhập mà truy cập vào các trang đuợc bảo vệ như profile, ...
            if (route.protected && !user) {
                element = <Navigate to={routesConfig.login} />
            }

            // Khi truy cập vào trang chỉ dành cho admin
            if (route.onlyAdmin) {
                if (!user) {
                    element = <Navigate to={routesConfig.login} />
                } else if (user.role !== UserRole.Admin) {
                    element = <Navigate to={routesConfig.home} />
                }
            }

            return (
                <Route key={index} path={route.path} element={element}>
                    {isParent && renderRoutes(route.children as RouteType[])}
                </Route>
            )
        })
    }

    return (
        <Router>
            <Toaster
                position='top-right'
                toastOptions={{
                    duration: 5000,
                    style: { background: '#fff', color: '#333' }
                }}
            />
            <Wrapper>{renderRoutes(routes)}</Wrapper>
        </Router>
    )
}

export default App
