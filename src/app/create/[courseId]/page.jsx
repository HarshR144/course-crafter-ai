import ConfirmChapters from '@/components/ConfirmChapters'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Info } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const CreateChapters = async({params:{courseId}}) => {
    const session = await getAuthSession()
    if(!session?.user){
        return redirect('/gallery')
    }

    const course = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        include: {
          units: {
            include: {
              chapters: true,
            },
          },
        },
      });
    if(!course){
        console.log("Course not found in create[courseId]: ",courseId)
        return redirect('/create');
    }
    return (
        <div className='flex flex-col items-start max-w-xl mx-auto my-16'>
            <h5 className='text-sm uppercase text-secondary-foreground/60'>
                Course Name
            </h5>
            <h1 className='text-5xl font-bold'>
                {course.name}
            </h1>

            <div className='flex p-4 mt-5 border-none bg-secondary'>
                <Info className='h-12 w-12 mr-3 text-blue-400'/>
                <div>
                    We generated chapter for each of your units.Look over them and then click on the button confirm and continue
                </div>
                
            </div>
            <ConfirmChapters course = {course}/>
        </div>
    )
}

export default CreateChapters