import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { Separator } from './ui/separator'




const CourseSideBar = async ({course, currentChapterId}) => {
  return (
    <div className='w-[400px] absolute  p-6 rounded-r-3xl bg-secondary'>
        <h2 className='text-4xl font-bold'>
            {course.name}
            {
                course.units.map((unit,unitIndex)=>{
                    return (
                        <div key={unit.id} className='mt-4'>
                            <h2 className='text-sm uppercase text-secondary-foreground/60'>Unit {unitIndex+1}</h2>
                            <h2 className='text-2xl font-bold'>
                                {unit.name}
                            </h2>
                            {
                                unit.chapters.map((chapter,chapterIndex)=>{
                                    return(
                                        <div key={chapter.id}>
                                            <Link 
                                            className={
                                                cn('text-secondary-foreground/60 text-xl'
                                                    ,{
                                                        'text-green-500 font-bold':chapter.id === currentChapterId,
                                                        
                                                    }                                                
                                                )}
                                            href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}>
                                                {chapter.name}
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                            <Separator
                                className="mt-2 text-gray-500 bg-gray-500"
                            />
                        </div>
                    )
                })
            }
        </h2>
    </div>
  )
}

export default CourseSideBar