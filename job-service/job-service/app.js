const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const { createClient } = require("@supabase/supabase-js");
var dayjs = require("dayjs");
const app = express();
const router = express.Router();

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const supabaseUrl = "https://qhzyckxjlrnhacqmxydk.supabase.co";
// Once again this is a secret and should be stored in an ENV variable, but for the sake of the demo, I did not. 
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoenlja3hqbHJuaGFjcW14eWRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NDQ1OTc2MCwiZXhwIjoxOTYwMDM1NzYwfQ.Ij5wbt0-HKKHK-OpkkxzonRV_ovfva0wkYT7D2e_KI0";
const supabase = createClient(supabaseUrl, supabaseKey);

// Lists all of the jobs in the DB. 
router.get("/", async (req, res) => {
  let { data: jobs, error } = await supabase.from("jobs").select("*");
  res.json(jobs);
});


router.get("/jobs/:jobId", async (req, res) => {
  const jobId = req.params.jobId;
  if (!jobId) return res.status(404).json({});

  let { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId);

  return res.json(jobs);
});


router.post("/jobs", async (req, res) => {
  //   Destructure arguments to make sure we only set what the DB needs
  const { name, type, isRecurring, nextExecutionTime, frequency, desc_test } = req.body;
  console.log('req.body', req.body)

  // I have done a little safety here, but in PROD this could probably be more robust.
  if (isRecurring && !frequency) {
    return res
      .status(500)
      .json({ error: "If isRecurring = true, frequency must be supplied" });
  }
  if (frequency && frequency !== "weekly" && frequency !== "daily") {
    return res
      .status(500)
      .json({ error: "frequency must equal 'weekly' or 'daily'" });
  }
  if (nextExecutionTime && !dayjs(nextExecutionTime).isValid()) {
    return res
      .status(500)
      .json({
        error: "nextExecutionTime is not a valid unix timestamp in seconds",
      });
  }
  if (nextExecutionTime && dayjs().unix() > nextExecutionTime) {
    return res
      .status(500)
      .json({
        error:
          "nextExecutionTime is not in the future, pick a time in the future, current time: " +
          dayjs().unix(),
      });
  }

  const { data, error } = await supabase.from("jobs").insert([
    {
      name: name,
      type: type,
      isRecurring: isRecurring,
      nextExecutionTime: nextExecutionTime ? nextExecutionTime : dayjs().unix(),
      frequency: frequency,
      desc_test: desc_test
    },
  ]);
  if (error) return res.status(500).json(error);

  res.status(201).json(data);
});


router.put("/jobs/:jobId", async (req, res) => {
  const jobId = req.params.jobId;
  if (!jobId) return res.status(404).json({});

  const { type, isRecurring, nextExecutionTime, frequency, isActive, name } =
    req.body;

  const { data, error } = await supabase
    .from("jobs")
    .upsert([
      {
        id: jobId,
        type: type,
        isRecurring: isRecurring,
        nextExecutionTime: nextExecutionTime,
        frequency: frequency,
        isActive: isActive,
        name: name,
      },
    ]);

  if (error) return res.status(500).json(error);
  
  res.status(200).json(data);
});

router.delete("/jobs/:jobId", async (req, res) => {
  const jobId = req.params.jobId;

  if (!jobId) return res.status(404).json({});

  const { data, error } = await supabase.from("jobs").delete().eq("id", jobId);
  res.status(200).json(data);
});

app.use("/", router);
module.exports = app;
