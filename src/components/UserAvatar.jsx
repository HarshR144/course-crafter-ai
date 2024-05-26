import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'

const UserAvatar = ({user}) => {
  return (
    <Avatar>
        {user?.image ? (<div className='relative w-full h-full aspect-square'>
            <Image fill src={user.image} alt='user-profile'referrerPolicy='noreferrer'/>
        </div>): 
        (<AvatarFallback>
            <span className='sr-only'>{user?.name}</span>
        </AvatarFallback>)}
    </Avatar>
  )
}

export default UserAvatar