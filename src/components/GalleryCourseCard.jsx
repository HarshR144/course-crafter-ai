import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const GalleryCourseCard = ({course}) => {
  return (
    <>
        <div className=' border border-rounded-lg border-secondary w-[14rem] h-[20rem] m-4 flex flex-col'>
            <div className='relative w-full h-[60%]'>
                <Link
                href={`/course/${course.id}/0/0`}
                className="relative block w-full h-full">
                    <Image
                    src={course.image || ''}
                    className=' object-cover w-full h-full rounded-t-lg
                    '
                    width={300}
                    height={300}
                    alt="picture of course"
                    />
                    <span className='absolute px-2 py-1 text-white rounded-md bg-black/50 w-fit bottom-2 left-2 right-2'>
                        {course.name}
                    </span>

                </Link>
            </div>
            <div className='p-2 flex-1 overflow-hidden'>
                <h4 className='text-sm text-secondary-foreground/60 mb-2 '>
                    Units
                </h4>
                <div className='space-y-1'>
                    {course.units.map((unit,unitIndex)=>{
                        return(
                            <Link key={unit.id}
                            href={`/course/${course.id}/${unitIndex}/0`}
                            className='block hover:underline w-fit'>
                                Unit {unitIndex + 1}:{unit.name}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    </>
  )
}

export default GalleryCourseCard