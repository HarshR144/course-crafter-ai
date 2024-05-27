import { strict_output } from "@/lib/gpt"
import { getUnsplashImage } from "@/lib/unsplash"
import { createChaptersSchema } from "@/validators/course"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(req,res){
    try{
        const body = await req.json()
        const {title,units} = createChaptersSchema.parse(body)
        const unitPrompts = units.map((unit,index) => 
            `It is your job to create a course about ${title}. The user has requested to create chapters for the unit titled titled ${unit}. For each chapter, provide a detailed YouTube search query that can be used to find an informative educational video. Each query should give an educational informative course in YouTube.`
          );
        let output_units = await strict_output(
            'you are an AI capable of curating course content, coming up with relevant chapter titles and finding relevant youtube videos for each chapter',

           unitPrompts,
            {
                title:"title of the unit",
                chapters:"an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object",

            }
        );

        const imageSearchTerm = await strict_output(
            'You are an AI capable of finding the most relevant image for a course',
            `Please provide a good image search term for title of course about ${title}. This search term will be fed into the unsplash api, so make sure it is a good search term  that will return good result`,
            {
                image_search_term:"a good search term for the title of the course"
            }
        )
        const course_image = await getUnsplashImage(imageSearchTerm.image_search_term);
        console.log(output_units);

        const course = await prisma.course.create({
            data:{
                name:title,
                image:course_image,

            }
        })
        for (const unit of output_units){
            const title= init.title;
            const prismaUnit = await prisma.unit.create({
                data:{
                    name:title,
                    courseId:course.id
                }
            })
            await prisma.chapter.createMany({
                data:unit.chapters.map((chapter)=>{
                    return {
                        name:chapter.chapter_title,
                        youtubeSearchQuery:chapter.youtube_search_query,
                        unitId:prismaUnit.id
                    }
                })
            })
        } 
        return NextResponse.json({course_id:course.id});


    }catch(error){
        if(error instanceof ZodError){
            return new NextResponse("invalid body",{status:400})
        }
    }
}