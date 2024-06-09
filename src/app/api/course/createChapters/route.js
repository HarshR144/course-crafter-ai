import { prisma } from "@/lib/db"
import { strict_output } from "@/lib/gpt"
import { getUnsplashImage } from "@/lib/unsplash"
import { createChaptersSchema } from "@/validators/course"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(req,res){
    try{
        const body = await req.json();
        const { title, units } = createChaptersSchema.parse(body);
        
          
          let output_units = await strict_output(
            "You are an AI assistant capable of creating course content. Your task is to generate a list of chapters and corresponding YouTube search queries for a given course and units.",
            `Course Title:${title}\n Unit titles:${units.join(",")}`,
            "Provide your output in the following array of JSON format"
          );
        
          const imageSearchTerm = await strict_output(
            'You are an AI assistant tasked with finding relevant image search terms for a given course title.',
            `Course Title: ${title}`,
            'Provide your output in the JSON format'
           
          );

      
        const course_image = await getUnsplashImage(imageSearchTerm.image_search_term);


        const course = await prisma.course.create({
            data: {
              name: title,
              image: course_image,
            },
          });
        
       
          for (const unit of output_units) {
            const title = unit.title;
            const prismaUnit = await prisma.unit.create({
              data: {
                name: title,
                courseId: course.id,
              },
            });
            await prisma.chapter.createMany({
              data: unit.chapters.map((chapter) => {
                return {
                  name: chapter.chapter_title,
                  youtubeSearchQuery: chapter.youtube_search_query,
                  unitId: prismaUnit.id,
                };
              }),
            });
          }
          

          return NextResponse.json({ course_id: course.id });


    }catch(error){
        if(error instanceof ZodError){
            return new NextResponse("invalid body",{status:400})
        }
        else{
            return new NextResponse(JSON.stringify({error:error.message}),{status:500});
        }
       
    }
}