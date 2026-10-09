import { Outlet } from 'react-router'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto box-border flex w-full max-w-[1200px] flex-[1_0_auto] flex-col gap-6 px-6 pt-8 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
