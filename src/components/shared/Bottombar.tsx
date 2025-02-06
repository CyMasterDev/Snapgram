import { bottombarLinks } from '@/constants';
import { Link, useLocation } from 'react-router-dom'

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Link
            to={link.route}
            key={link.label}
            className={`${isActive && 'bg-primary-500 rounded-2xl'
              } flex-center flex-col gap-1 p-4 transition`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              /*width={25}
              height={25}*/
              draggable="false"
              className=
              {`select-none ${isActive && 'invert-white'
                }`}
            />
            <p className='tiny-medium text-light-2'>{link.label}</p>
          </Link>
        )
      })}
    </section>
  )
}

export default Bottombar