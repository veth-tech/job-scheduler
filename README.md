# Serverless Job Service
Hello and welcome to the serverless job service! This project has 2 lambda functions and a DB (supabase) to create a job service. 

The service allows you to schedule jobs with a POST request. You can schedule them in the future, as recurring, immediately, recurring weekly or daily.

The first lambda function, app.js in the job-service/job-service folder, is an express server that manages CRUD for the jobs. It writes all of its data to the DB. 

The second lambda function, app.js in the job-scheduler/job-executer folder, is a simple lambda function that is invoked every minute with a CRON job to read the active jobs from the DB and execute any that are ready to go. 

## About
[DEMO VIDEO](https://www.loom.com/share/9c2d93ce7ffb42ce99026c7c2a17ac0f)

I originally created this repo as a challenge for a potential client. I realized it was a perfect demo for future job/clients. Instead of doing a code challenge (which doesn't scale) this repo allows you to assess my skills without wasting anyone's time.

The entire project was completed in about 6 hours. Which means it's not perfect, which is by design! Now we can talk about how we would improve it. Or what changes it needs to go to production. Additionally, you can see what decisions I made knowing that I had to deliver this "in a timely matter."

 It has many benefits including:

- Solves a real world problem
- Shows off my ability to collaborate and communicate async
- Shows actual code written with packages we are likely to use in the real world
- Demonstrates my skills with infrastructre, DBs, and new packages



## You can test it out at:
`https://64yecfqnn0.execute-api.us-east-1.amazonaws.com/prod`

I also added a postman export to the root here, if you're into that kind of thing. 

## The routes are super simple
- Get all jobs:
GET `https://64yecfqnn0.execute-api.us-east-1.amazonaws.com/prod`

 - POST a job, with body from job-service README:
POST `https://64yecfqnn0.execute-api.us-east-1.amazonaws.com/prod/jobs`

 - Update a job, with body containing any key-value pairs to update, some are immutable:
PUT `https://64yecfqnn0.execute-api.us-east-1.amazonaws.com/prod/jobs/{{jobId}}`

 - Delete a job:
DELETE `https://64yecfqnn0.execute-api.us-east-1.amazonaws.com/prod/jobs/{{jobId}}`


I highly recommend you watch the demo video. I explain my thought process, point out potential problems, and show you how to deploy and test it on your machine. 
