import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext';

const Sidebar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess])

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className='flex gap-3 items-center'>
          <img
            src='/assets/images/logo.svg'
            alt='logo'
            draggable="false"
            className="select-none"
            width={170}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user.id}`} className='flex gap-3 items-center select-none'  draggable="false">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            draggable="false"
            className="select-none"
          />
        </Link>
      </div>
    </nav>
  )
}

export default Sidebar