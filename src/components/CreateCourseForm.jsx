'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { ArrowRight, Plus, Trash, Loader2 } from 'lucide-react'
import {motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { useToast } from './ui/use-toast'
import { createChaptersSchema } from '@/validators/course'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import SubscriptionAction from './SubscriptionAction'



const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';


const CreateCourseForm = () => {
    const {toast} = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {mutate:createChapters, mutationLoading} = useMutation({
        mutationFn:async({title,units})=>{
            const response = await axios.post(`${BACKEND_URL}/api/course/createChapters`,{title,units})
            return response.data
        }
    })
    
    const form = useForm({
        resolver:zodResolver(createChaptersSchema),
        defaultValues:{
            title:"",
            units:['','','']
        }
    })

    function onSubmit(data){
        setIsSubmitting(true)
        if (data.units.some((unit) => unit === "")) {
            
            setIsSubmitting(false)
            toast({
              title: "Error",
              description: "Please fill all the units",
              variant: "destructive",
            });
            return;
          }

        createChapters(data,{
        onSuccess:({course_id})=>{
            toast({
                title: "Success",
                description: "Course created successfully",
              });
            router.push(`/create/${course_id}`)
            setIsSubmitting(false)
            
        },
        onError:(error)=>{
            console.error(error);
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
              });
              setIsSubmitting(false)
            
        }
    })
    }
    const isLoading = isSubmitting || mutationLoading;
    // console.log(form.watch())
    return (
        <div className='w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="w-full mt-4">
                    <FormField control = {form.control} 
                        name='title'
                        render= {
                            ({field})=>{
                                return(
                                    <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                                        <FormLabel className="flex-[1] text-xl ">
                                            Title
                                        </FormLabel>
                                        <FormControl className="flex-[6] ">
                                            <Input 
                                            placeholder="Enter the main topic of the course"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )
                            }
                        }
                    />
                    <AnimatePresence>
                        {
                            form.watch('units').map((_,index)=>(
                                <motion.div 
                                 key={index}
                                 initial={{opacity:0,height:0 }}
                                 animate={{opacity:1, height:"auto"}}
                                 exit={{ opacity:0, height:0}}
                                 transition={{
                                    opacity:{duration:0.3},
                                    height:{duration:0.2}
                                 }}
                                 >
                                    <FormField
                                    control={form.control}
                                    name={`units.${index}`}
                                    key={index}
                                    render={({field})=>(
                                        <FormItem
                                        className='flex flex-col items-start w-full sm:items-center sm:flex-row'
                                        >
                                            <FormLabel className="flex-[1] text-xl">
                                                Unit  {index+1}
                                            </FormLabel>
                                            <FormControl className='flex-[6] '>
                                                <Input 
                                                placeholder="Enter sub-topic of course"
                                                {...field}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                </motion.div>
                            ))
                        }
                    </AnimatePresence>                    
                    <div
                    className='flex items-center justify-center mt-4'
                    >
                        <Separator className="flex-[1] "/>
                        <div className='mx-4 flex gap-4'>
                            <Button
                             type='button' 
                             variant='secondary'
                             className='font-semibold select-none'
                             onClick={()=>{
                                form.setValue('units',[...form.watch('units'),''])
                             }}
                             >
                                Add Unit 
                                <Plus className='w-4 h-4 ml-2 text-green-500'/>
                            </Button>
                            <Button
                             type='button'
                             variant='secondary'
                             className='font-semibold select-none'
                             onClick={()=>{
                                form.setValue('units',form.watch('units').slice(0,-1))
                             }}
                             >
                                Remove Unit 
                                <Trash className='w-4 h-4 ml-2 text-red-500'/>
                            </Button>
                        </div>
                        <Separator className="flex-[1] "/>
                    </div>
                    <Button
                     disabled={isLoading}
                     type="submit"
                     className='w-full mt-6'
                     size='lg'>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                Let&#39;s Go
                                <ArrowRight className='w-5 h-5 ml-2' />
                            </>
                        )}
                    </Button>            

                     
                </form>
            </Form>
                
            {/* <SubscriptionAction/> */}
        </div>
  )
}

export default CreateCourseForm