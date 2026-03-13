import axios from "axios"
import {NextResponse} from "next/server"

export async function GET(request:Request){

 const {searchParams} = new URL(request.url)
 const token = searchParams.get("token")

 const heart = await axios.get(
  "https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.heart_rate.bpm:com.google.android.gms:merge/datasets/0-9999999999999",
  {headers:{Authorization:`Bearer ${token}`}}
 )

 const spo2 = await axios.get(
  "https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.oxygen_saturation:com.google.android.gms:merge/datasets/0-9999999999999",
  {headers:{Authorization:`Bearer ${token}`}}
 )

 return NextResponse.json({
  heart:heart.data,
  spo2:spo2.data
 })
}