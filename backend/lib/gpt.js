
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

async function strict_output(system_prompt, input_prompt, output_prompt) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {text: "You are an AI assistant capable of creating course content. Your task is to generate a list of chapters and corresponding YouTube search queries for a given course and unit.\nInstructions:\nRead the provided course title and unit title.\nGenerate a list of chapters for the unit.\nFor each chapter, provide a detailed YouTube search query that would find an informative educational video on that topic. Ensure the queries are suitable for finding educational content.\nInputs\nCourse Title: <course_title>\nUnits Titles :<unit_title1>,<unit_title2>\nOutput:**\nProvide your output in the following array of JSON format:\n[\n{\n\"title\": \"title of the unit 1 :example Linear equations\",\n\"chapters\": [\n{\n\"chapter_title\": \"chapter title\",\n\"youtube_search_query\": \"youtube search query\"\n}\n]\n},\n{\n\"title\": \"title of the unit 2 :example - Quadratic equations\",\n\"chapters\": [\n{\n\"chapter_title\": \"chapter title\",\n\"youtube_search_query\": \"youtube search query\"\n}\n]\n}]\nExample:\nInput:\nCourse Title:Python Programming\nUnit Title: Data Structures, conditional statements, functions\nOutput:\n[\n{\n\"title\": \"Data Structures\",\n\"chapters\": [\n{\n\"chapter_title\": \"Lists\",\n\"youtube_search_query\": \"Python lists tutorial for beginners\"\n},\n{\n\"chapter_title\": \"Dictionaries\",\n\"youtube_search_query\": \"Python dictionaries explained\"\n},\n{\n\"chapter_title\": \"Sets\",\n\"youtube_search_query\": \"Python sets tutorial\"\n},\n{\n\"chapter_title\": \"Tuples\",\n\"youtube_search_query\": \"Python tuples explained\"\n}\n]\n},\n{\n\"title\": \"Conditional Statements\",\n\"chapters\": [\n{\n\"chapter_title\": \"if, elif, else statements\",\n\"youtube_search_query\": \"Python conditional statements explained\"\n},\n{\n\"chapter_title\": \"Nested conditional statements\",\n\"youtube_search_query\": \"Nested if-else statements in Python\"\n}\n]\n},\n{\n\"title\": \"Functions\",\n\"chapters\": [\n{\n\"chapter_title\": \"Defining and Calling Functions\",\n\"youtube_search_query\": \"Python functions tutorial for beginners\"\n},\n{\n\"chapter_title\": \"Parameters and Arguments\",\n\"youtube_search_query\": \"Passing arguments to Python functions\"\n},\n{\n\"chapter_title\": \"Return Values\",\n\"youtube_search_query\": \"Returning values from Python functions\"\n}\n]\n}\n]"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Got it! Please provide the Course Title and Unit Titles so I can generate the JSON output for you. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Input:\nCourse Title:Python Programming\nUnit Title: Data Structures, conditional statements, functions"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  {\n    \"title\": \"Data Structures\",\n    \"chapters\": [\n      {\n        \"chapter_title\": \"Lists\",\n        \"youtube_search_query\": \"Python lists tutorial for beginners\"\n      },\n      {\n        \"chapter_title\": \"Dictionaries\",\n        \"youtube_search_query\": \"Python dictionaries explained\"\n      },\n      {\n        \"chapter_title\": \"Sets\",\n        \"youtube_search_query\": \"Python sets tutorial\"\n      },\n      {\n        \"chapter_title\": \"Tuples\",\n        \"youtube_search_query\": \"Python tuples explained\"\n      }\n    ]\n  },\n  {\n    \"title\": \"Conditional Statements\",\n    \"chapters\": [\n      {\n        \"chapter_title\": \"if, elif, else statements\",\n        \"youtube_search_query\": \"Python conditional statements explained\"\n      },\n      {\n        \"chapter_title\": \"Nested conditional statements\",\n        \"youtube_search_query\": \"Nested if-else statements in Python\"\n      },\n      {\n        \"chapter_title\": \"Logical Operators\",\n        \"youtube_search_query\": \"Python logical operators and, or, not\"\n      }\n    ]\n  },\n  {\n    \"title\": \"Functions\",\n    \"chapters\": [\n      {\n        \"chapter_title\": \"Defining and Calling Functions\",\n        \"youtube_search_query\": \"Python functions tutorial for beginners\"\n      },\n      {\n        \"chapter_title\": \"Parameters and Arguments\",\n        \"youtube_search_query\": \"Passing arguments to Python functions\"\n      },\n      {\n        \"chapter_title\": \"Return Values\",\n        \"youtube_search_query\": \"Returning values from Python functions\"\n      },\n      {\n        \"chapter_title\": \"Scope of Variables\",\n        \"youtube_search_query\": \"Local and global variables in Python functions\"\n      }\n    ]\n  }\n]\n```\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "You are an AI assistant tasked with finding relevant image search terms for a given course title.\n\nInstructions:\nRead the course title.\nGenerate a concise and descriptive image search term that would return high-quality images related to the course topic. Ensure the term is suitable for use with the Unsplash API.\nInput:\nCourse Title: Python Programming\nOutput:\nProvide your output in the following JSON format:\n{\n    \"image_search_term\": \"image search term\" \n}\n\nExample:\nInput:\nCourse Title: Python Programming\n\nOutput:\n{\n    \"image_search_term\": \"python programming code on screen\"\n}"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n    \"image_search_term\": \"python programming code on laptop\"\n}\n``` \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "You are an AI assistant capable of summarizing text.\n\nInstructions:\nRead the provided YouTube transcript.\nSummarize the transcript concisely and accurately in 250 words or less.\nDo not include mentions of sponsors or any unrelated content.\nAvoid stating what the summary is about; directly present the summary.\nInput:<Transcript from youtube>\nOutput:\nProvide your output in the following JSON format:\n{\n    \"summary\": \"summary of the transcript\"\n}"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Please provide the YouTube transcript. I'm ready to summarize it for you! \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "input:# tactiq.io free youtube transcript\n# Python in 100 Seconds\n# https://www.youtube.com/watch/x7X9w_GIm1s\n\n00:00:00.160 python a high-level interpreted\n00:00:02.320 programming language famous for its\n00:00:04.240 zen-like code it's arguably the most\n00:00:06.319 popular language in the world because\n00:00:08.080 it's easy to learn yet practical for\n00:00:10.320 serious projects in fact you're watching\n00:00:12.480 this youtube video in a python web\n00:00:14.480 application right now it was created by\n00:00:16.160 guido van rossum and released in 1991\n00:00:18.880 who named it after monty python's flying\n00:00:21.119 circus which is why you'll sometimes\n00:00:22.800 find spam and eggs instead of foo and\n00:00:24.800 bar in code samples it's commonly used\n00:00:27.039 to build server-side applications like\n00:00:28.960 web apps with the django framework and\n00:00:30.800 is the language of choice for big data\n00:00:32.719 analysis and machine learning many\n00:00:34.719 students choose python to start learning\n00:00:36.559 to code because of its emphasis on\n00:00:38.160 readability as outlined by the zen of\n00:00:40.559 python beautiful is better than ugly\n00:00:42.640 while explicit is better than implicit\n00:00:44.879 python is very simple but avoids the\n00:00:46.640 temptation to sprinkle in magic that\n00:00:48.640 causes ambiguity its code is often\n00:00:50.879 organized into notebooks where\n00:00:52.480 individual cells can be executed then\n00:00:54.559 documented in the same place we're\n00:00:56.399 currently at version 3 of the language\n00:00:58.160 and you can get started by creating a\n00:00:59.840 file that ends in py or ipymb to create\n00:01:03.440 an interactive notebook create a\n00:01:04.879 variable by setting a name equal to a\n00:01:07.200 value it's strongly typed which means\n00:01:09.040 values won't change in unexpected ways\n00:01:11.040 but dynamic so type annotations are not\n00:01:13.200 required the syntax is highly efficient\n00:01:15.439 allowing you to declare multiple\n00:01:16.720 variables on a single line and define\n00:01:18.720 tuples lists and dictionaries with a\n00:01:20.960 literal syntax semicolons are not\n00:01:22.799 required and if you use them and\n00:01:24.400 experience pythonista will say that your\n00:01:26.479 code is not pythonic instead of\n00:01:28.159 semicolons python uses indentation to\n00:01:31.040 terminate or determine the scope of a\n00:01:32.799 line of code define a function with the\n00:01:34.640 def keyword then indent the next line\n00:01:36.720 usually by four spaces to define the\n00:01:38.720 function body we might then add a for\n00:01:40.479 loop to it and indent that by another\n00:01:42.240 four spaces this eliminates the need for\n00:01:44.399 curly braces and semicolons found in\n00:01:46.560 many other languages python is a\n00:01:48.320 multi-paradigm language we can apply\n00:01:50.079 functional programming patterns with\n00:01:51.600 things like anonymous functions using\n00:01:53.280 lambda it also uses objects as an\n00:01:55.280 abstraction for data allowing you to\n00:01:57.280 implement object-oriented patterns with\n00:01:59.200 things like classes and inheritance it\n00:02:01.280 also has a huge ecosystem of third-party\n00:02:03.680 libraries such as deep learning\n00:02:05.439 frameworks like tensorflow and wrappers\n00:02:07.360 for many high performance low level\n00:02:08.959 packages like open computer vision which\n00:02:11.200 are most often installed with the pip\n00:02:13.200 package manager this has been the python\n00:02:15.200 programming language in 100 seconds hit\n00:02:17.280 the like button if you want to see more\n00:02:18.480 short videos like this thanks for\n00:02:20.000 watching and i will see you in the next\n00:02:22.080 one\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n\"summary\": \"Python is a high-level, interpreted programming language known for its clear, readable code. It's widely popular due to its ease of learning and suitability for complex projects. Python's applications range from web development (with frameworks like Django) to data analysis and machine learning.  It emphasizes readability, as reflected in its 'Zen of Python' principles: beautiful is better than ugly, and explicit is better than implicit. Python is dynamically typed, meaning type annotations aren't required. Its syntax is efficient, with features like multi-variable declarations on a single line and literal syntax for data structures. Indentation, rather than semicolons, defines code scope. Python's multi-paradigm nature allows for functional programming (using lambda functions) and object-oriented programming (with classes and inheritance). A rich ecosystem of third-party libraries, including deep learning frameworks like TensorFlow and OpenCV wrappers, expands Python's capabilities. These libraries are commonly installed using the pip package manager.\"\n}\n```"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "You are a helpful AI assistant that can generate multiple-choice questions and answers.\n\nInstructions:\nRead the provided course title and YouTube transcript.\nGenerate  five  hard multiple-choice questions about the course topic. The question should be based on the content of the transcript.\nProvide four options, one of which is the correct answer.\nEnsure the answer and each option are no more than 15 words long.\nInput:\nCourse Title: Python Programming\nTranscript:\nOutput:\nProvide your output in the following array of JSON format:\n[{\n    \"question\": \"question\",\n    \"answer\": \"answer with max length of 15 words\",\n    \"option1\": \"option1 with max length of 15 words\",\n    \"option2\": \"option2 with max length of 15 words\",\n    \"option3\": \"option3 with max length of 15 words\"\n},\n{\n    \"question\": \"question\",\n    \"answer\": \"answer with max length of 15 words\",\n    \"option1\": \"option1 with max length of 15 words\",\n    \"option2\": \"option2 with max length of 15 words\",\n    \"option3\": \"option3 with max length of 15 words\"\n}]"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  {\n    \"question\": \"What Python framework is commonly used for building web applications?\",\n    \"answer\": \"Django framework\",\n    \"option1\": \"Flask framework\",\n    \"option2\": \"NumPy library\",\n    \"option3\": \"TensorFlow library\"\n  },\n  {\n    \"question\": \"What is the primary purpose of indentation in Python code?\",\n    \"answer\": \"Define code scope\",\n    \"option1\": \"Improve readability\",\n    \"option2\": \"Declare variable types\",\n    \"option3\": \"Terminate code lines\"\n  },\n  {\n    \"question\": \"Which of these is NOT a Python data structure?\",\n    \"answer\": \"Class\",\n    \"option1\": \"Tuple\",\n    \"option2\": \"Dictionary\",\n    \"option3\": \"List\"\n  },\n  {\n    \"question\": \"What type of programming paradigm does Python support?\",\n    \"answer\": \"Object-oriented programming\",\n    \"option1\": \"Procedural programming\",\n    \"option2\": \"Functional programming\",\n    \"option3\": \"All of the above\"\n  },\n  {\n    \"question\": \"What is the package manager used to install Python libraries?\",\n    \"answer\": \"Pip package manager\",\n    \"option1\": \"NPM package manager\",\n    \"option2\": \"Maven package manager\",\n    \"option3\": \"Conan package manager\"\n  }\n]\n``` \n"},
        ],
      },
    ],
  });
  
  const result = await chatSession.sendMessage(`${system_prompt}\n\nInput:${input_prompt}\n\noutput:${output_prompt}`);
  let res = await result.response.text();

  // The key part:
  res = res.replace(/```json|```/g, ""); // Remove code block markers
  res = res.trim();
  let output = JSON.parse(res);
  // console.log(typeof(output)); 
  // console.log(output);
  // res = res.replace(/```json|```/g, ""); // Remove code block markers
  // res = res.trim();
  // output = JSON.parse(res);
  if(Array.isArray(output)){
    console.log("yes is array")
  }else{
    console.log("Not an array", typeof(output));
    // output = [output]
  }
  
  // console.log(output);
  return output;

}
module.exports = { strict_output };