var dayjs = require("dayjs");
const { createClient } = require("@supabase/supabase-js");
const { sendEmail, callAPI } = require("./jobs");

const supabaseUrl = "https://qhzyckxjlrnhacqmxydk.supabase.co";
// This is a SECRET, I should not have commited this to a public repo, but setting up env variables was too much extra work and time for this demo. 
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoenlja3hqbHJuaGFjcW14eWRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NDQ1OTc2MCwiZXhwIjoxOTYwMDM1NzYwfQ.Ij5wbt0-HKKHK-OpkkxzonRV_ovfva0wkYT7D2e_KI0";
const supabase = createClient(supabaseUrl, supabaseKey);

let response;

const handleJobFinish = async (job) => {
  const { isRecurring, id, frequency, succesfulExecutions } = job;

  let response;

  const handleUpsert = async (upsertObj) => {
    const { data, error } = await supabase
      .from("jobs")
      .upsert([{ ...upsertObj, succesfulExecutions: succesfulExecutions + 1 }]);

    if (error) {
      console.log(error);
      new Error(error);
    }
    return data;
  };

  if (!isRecurring) {
    response = await handleUpsert({
      id: id,
      nextExecutionTime: null,
      isActive: false,
    });
  } else {
    if (frequency === "daily") {
      response = await handleUpsert({
        id: id,
        nextExecutionTime: dayjs().add(1, "day").unix(),
      });
    } else if (frequency === "weekly") {
      response = await handleUpsert({
        id: id,
        nextExecutionTime: dayjs().add(7, "day").unix(),
      });
    }
  }
  return response;
};

exports.lambdaHandler = async (event, context) => {
  try {
    let { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("isActive", true)
      .lt("nextExecutionTime", dayjs().unix());

    error && new Error(error);

    if (jobs.length > 0) {
      for (let job of jobs) {
        switch (job.type) {
          case "sendEmail":
            const emailJob = sendEmail(job);
            emailJob["success"] && (await handleJobFinish(job));
            break;
          case "callAPI":
            const runJob = callAPI(job);
            runJob["success"] && (await handleJobFinish(job));
            break;
          default:
            break;
        }
      }
    }

    response = {
      statusCode: 200,
      body: JSON.stringify(jobs),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
