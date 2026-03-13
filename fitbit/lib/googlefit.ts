export async function getGoogleHealth(token:string){

 const body={

  aggregateBy:[
   {dataTypeName:"com.google.step_count.delta"},
   {dataTypeName:"com.google.heart_rate.bpm"},
   {dataTypeName:"com.google.oxygen_saturation"},
   {dataTypeName:"com.google.sleep.segment"}
  ],

  bucketByTime:{durationMillis:60000},

  startTimeMillis:Date.now()-60000,
  endTimeMillis:Date.now()

 }

 const res=await fetch(
  "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
  {
   method:"POST",
   headers:{
    Authorization:`Bearer ${token}`,
    "Content-Type":"application/json"
   },
   body:JSON.stringify(body)
  }
 )

 return await res.json()

}