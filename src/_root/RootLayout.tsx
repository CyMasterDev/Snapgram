import Bottombar from '@/components/shared/bottombar'
import Topbar from '@/components/shared/topbar'
import Sidebar from '@/components/shared/sidebar'

import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <Topbar />
      <Sidebar />

      <section className='flex flex-1 h-full'>
        <Outlet />
      </section>

      <Bottombar />
    </div>
  )
}

export default RootLayout