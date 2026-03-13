import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(request: Request) {

 const { searchParams } = new URL(request.url)

 const token = searchParams.get("token")
 const date = searchParams.get("date") || "today"

 if (!token) {
  return NextResponse.json({ error: "No token" })
 }

 const headers = {
  Authorization: `Bearer ${token}`
 }

 const steps = await axios.get(
  `https://api.fitbit.com/1/user/-/activities/steps/date/${date}/1d.json`,
  { headers }
 )

 const calories = await axios.get(
  `https://api.fitbit.com/1/user/-/activities/calories/date/${date}/1d.json`,
  { headers }
 )

 const distance = await axios.get(
  `https://api.fitbit.com/1/user/-/activities/distance/date/${date}/1d.json`,
  { headers }
 )

 const heart = await axios.get(
  `https://api.fitbit.com/1/user/-/activities/heart/date/${date}/1d.json`,
  { headers }
 )

 let sleep = null

 try {
  const res = await axios.get(
   `https://api.fitbit.com/1.2/user/-/sleep/date/${date}.json`,
   { headers }
  )
  sleep = res.data
 } catch {}

 return NextResponse.json({
  steps: steps.data,
  calories: calories.data,
  distance: distance.data,
  heart: heart.data,
  sleep
 })
}