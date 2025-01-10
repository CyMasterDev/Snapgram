import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext';

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const user = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess])

  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link to='/' className='flex gap-3 items-center'>
          <img
          src='/assets/images/logo.svg'
          alt='logo'
          draggable="false"
          className="select-none"
          width={130}
          height={325}
          />
        </Link>

        <div className='flex gap-4'>
          <Button variant='ghost' className='shad-button_ghost' onClick={() => signOut()}>
              <img
              src='/assets/icons/logout.svg'
              alt='logout'
              draggable="false"
              className="select-none"
              />
          </Button>
        </div>
        <Link to={`/profile`}>
        </Link>
      </div>
    </section>
  )
}

export default Topbar