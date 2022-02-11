# Serverless Job Service

Hello and welcome to the serverless job service! This project has 2 lambda functions and a DB (supabase) to create a job service. 

The first lambda function, app.js in the job-service/job-service folder, is an express server the manages CRUD for the jobs. It writes all of its data to the DB. 

The second lambda function, app.js in the job-scheduler/job-executer folder, is a simple lambda function that is invoked every minute with a CRON job to read the active jobs from the DB and execute any that are ready to go. 

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

