import axios from 'axios';

export async function getData(endpoint){
  const res = await fetch(`http://localhost:1337/api/${endpoint}`)
  console.log(res,endpoint)
  return res.json()
}
