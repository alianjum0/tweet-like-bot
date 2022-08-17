//import your handler file or main file of Lambda
import { handler } from './index.js'

//In AWS lambda these are event, content, and callback
//event and content are JSON object and callback is a function
//In my example i'm using empty JSON
handler(
  {}, //event
  function (data) {
    //callback function with two arguments
    console.log(data)
  }
)
