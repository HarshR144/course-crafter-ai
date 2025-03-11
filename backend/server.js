// backend/server.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { strict_output } = require('./lib/gpt');
const { getUnsplashImage } = require('./lib/unsplash');
const { z } = require('zod');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(
    cors({
        origin:"*",   //change on deploy
        credentials:true,
    })
)
app.options('*', cors());  
app.use(bodyParser.json());

// Schema validation
const createChaptersSchema = z.object({
  title: z.string().min(1),
  units: z.array(z.string().min(1)).min(1)
});

// Course creation endpoint
app.post('/api/course/createChapters', async (req, res) => {
  try {
    const { title, units } = createChaptersSchema.parse(req.body);
    
    // Generate course content using AI
    let output_units = await strict_output(
      "You are an AI assistant capable of creating course content. Your task is to generate a list of chapters and corresponding YouTube search queries for a given course and units.",
      `Course Title:${title}\nUnit titles:${units.join(",")}`,
      "Provide your output in the following array of JSON format"
    );
    
    // Get image search term for course
    const imageSearchTerm = await strict_output(
      'You are an AI assistant tasked with finding relevant image search terms for a given course title.',
      `Course Title: ${title}`,
      'Provide your output in the JSON format'
    );
    
    console.log("Image search term:", imageSearchTerm);
    
    // Get course image
    const course_image = await getUnsplashImage(imageSearchTerm.image_search_term);
    
    console.log("Course image:", course_image);
    
    // Create course in database
    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
      },
    });
    
    // Create units and chapters
    for (const unit of output_units) {
      const unitTitle = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: unitTitle,
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
    
    res.json({ course_id: course.id });
  } catch (error) {
    console.error("Error creating course:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request body", details: error.errors });
    }
    
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Course creation backend running on port ${port}`);
});