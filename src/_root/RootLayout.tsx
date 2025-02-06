import Bottombar from '@/components/shared/Bottombar'
import Topbar from '@/components/shared/Topbar'
import Sidebar from '@/components/shared/Sidebar'

import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex select-none'>
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