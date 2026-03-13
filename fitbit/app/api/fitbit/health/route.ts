import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(request: Request){

 const { searchParams } = new URL(request.url)

 const token = searchParams.get("token")
 const date = searchParams.get("date") || "today"
 const metric = searchParams.get("metric") || "all"
 const period = searchParams.get("period") || "1d"

 if(!token){
  return NextResponse.json({error:"No token"})
 }

 try{

  // Default dashboard data
  if(metric==="all"){

   const steps = await axios.get(
    `https://api.fitbit.com/1/user/-/activities/steps/date/${date}/1d.json`,
    { headers:{ Authorization:`Bearer ${token}` } }
   )

   const calories = await axios.get(
    `https://api.fitbit.com/1/user/-/activities/calories/date/${date}/1d.json`,
    { headers:{ Authorization:`Bearer ${token}` } }
   )

   const distance = await axios.get(
    `https://api.fitbit.com/1/user/-/activities/distance/date/${date}/1d.json`,
    { headers:{ Authorization:`Bearer ${token}` } }
   )

   const heart = await axios.get(
    `https://api.fitbit.com/1/user/-/activities/heart/date/${date}/1d.json`,
    { headers:{ Authorization:`Bearer ${token}` } }
   )

   let sleepData=null

   try{

    const sleep = await axios.get(
     `https://api.fitbit.com/1.2/user/-/sleep/date/${date}.json`,
     { headers:{ Authorization:`Bearer ${token}` } }
    )

    sleepData=sleep.data

   }catch{
    console.log("No sleep data")
   }

   return NextResponse.json({
    steps:steps.data,
    calories:calories.data,
    distance:distance.data,
    heart:heart.data,
    sleep:sleepData
   })

  }

  // Metric specific analytics

  let endpoint=""

  if(metric==="steps"){
   endpoint=`https://api.fitbit.com/1/user/-/activities/steps/date/${date}/${period}.json`
  }

  if(metric==="calories"){
   endpoint=`https://api.fitbit.com/1/user/-/activities/calories/date/${date}/${period}.json`
  }

  if(metric==="distance"){
   endpoint=`https://api.fitbit.com/1/user/-/activities/distance/date/${date}/${period}.json`
  }

  if(metric==="heartrate"){
   endpoint=`https://api.fitbit.com/1/user/-/activities/heart/date/${date}/${period}.json`
  }

  const data = await axios.get(endpoint,{
   headers:{ Authorization:`Bearer ${token}` }
  })

  return NextResponse.json(data.data)

 }catch(error){

  console.error(error)

  return NextResponse.json({
   error:"Failed to fetch Fitbit data"
  })

 }
}