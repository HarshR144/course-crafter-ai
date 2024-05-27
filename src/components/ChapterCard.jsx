'use client'
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useToast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';

const ChapterCard =React.forwardRef(({chapter, chapterIndex,completedChapters, setCompletedChapters},ref) => {
   
    const [success, setSuccess] = React.useState(null);
    const toast = useToast()
    const {mutate:getChapterInfo, isLoading} = useMutation({
        mutationFn:async()=>{
            const response = await axios.post('/api/chapter/getInfo',{chapterId:chapter.id})
            return response.data
        }
    });

    const addChapterIdtoSet = React.useCallback(()=>{
        setCompletedChapters((prev)=> {
            const newSet  = new Set(prev);
            newSet.add(chapter.id)
            return newSet
        })
    },[chapter.id, setCompletedChapters])
    
    React.useEffect(()=>{
        if(chapter.videoId){
            setSuccess(true)
            addChapterIdtoSet()
        }
    },[chapter,addChapterIdtoSet])

    React.useImperativeHandle(ref,()=>({
        async triggerLoad(){
            if(chapter.videoId){
                addChapterIdtoSet();
                    return

            }
            getChapterInfo(undefined,{
                onSuccess:()=>{
                    addChapterIdtoSet();
                    setSuccess(true);
                },
                onError:(error)=>{
                    console.log(error);
                    setSuccess(false);
                    toast({
                        title:"Error",
                        description:"There was an error loading your chapter ",
                        variant:'destructive'
                    })
                    addChapterIdtoSet();
                } 
            })
        }
    }))

    return (
        <div key={chapter.id} className={cn("px-4 py-2 mt-2 rounded flex justify-between",
        {
            "bg-secondary":success===null,
            "bg-red-500":success === false,
            "bg-green-500":success===true
        }
        )}>
            <h5>
                Chapter {chapterIndex + 1} {chapter.name}
            </h5>
            {isLoading && <Loader2 className='animate spin'/>}
        
        </div>
  )
});
ChapterCard.displayName = "ChapterCard"
export default ChapterCard