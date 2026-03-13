import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(req: Request){

 const body = await req.json()

 const {
  goal,
  dietType,
  todaySteps,
  todayCalories,
  todayDistance,
  todaySleep,
  heartRate,
  weekSteps,
  monthSteps
 } = body

 const prompt = `
You are an expert Indian fitness coach and nutritionist.

User Goal:
${goal}

Diet Preference:
${dietType}

Health Data

Today's Activity
Steps: ${todaySteps}
Calories: ${todayCalories}
Distance: ${todayDistance} km
Sleep: ${todaySleep} minutes
Resting Heart Rate: ${heartRate}

Weekly Steps Total:
${weekSteps}

Monthly Steps Total:
${monthSteps}

Create a structured Indian daily routine.

Morning
• wake up routine
• Indian breakfast suggestion
• exercise suggestion

Afternoon
• lunch suggestion
• activity advice

Evening
• workout suggestion
• dinner suggestion

Night
• sleep routine

Also include:

Foods to Eat
Foods to Avoid

Rules:
• If vegetarian → give only veg food
• If non-veg → include eggs/chicken/fish options

Feedback:
• If weekly steps low → suggest improvement
• If monthly activity good → praise progress
• If sleep low → suggest recovery tips

Keep suggestions realistic for an Indian lifestyle.
`

 const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
   model:"openai/gpt-4o-mini",
   messages:[
    {role:"user",content:prompt}
   ]
  },
  {
   headers:{
    Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type":"application/json"
   }
  }
 )

 const suggestion = response.data.choices[0].message.content

 return NextResponse.json({suggestion})
}