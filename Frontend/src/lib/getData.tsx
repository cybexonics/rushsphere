import axios from 'axios';

export async function getData(endpoint){
  const res = await fetch(`https://rushsphere.onrender.com/api/${endpoint}`)
  console.log(res,endpoint)
  return res.json()
}
