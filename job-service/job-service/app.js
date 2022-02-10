const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const { getCurrentInvoke } = require("@vendia/serverless-express");
const { createClient } = require("@supabase/supabase-js");
const app = express();
const router = express.Router();

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const supabaseUrl = "https://qhzyckxjlrnhacqmxydk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoenlja3hqbHJuaGFjcW14eWRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NDQ1OTc2MCwiZXhwIjoxOTYwMDM1NzYwfQ.Ij5wbt0-HKKHK-OpkkxzonRV_ovfva0wkYT7D2e_KI0";
const supabase = createClient(supabaseUrl, supabaseKey);

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
  // const { event, context } = getCurrentInvoke()
  console.log("req.body", req.body);
  const { type, isRecurring } = req.body
  const { data, error } = await supabase
    .from("jobs")
    .insert([{ type: type, isRecurring: isRecurring, }]);
    if(error) return res.status(500).json(error)
  res.status(201).json(data);
});

router.put("/jobs/:jobId", async (req, res) => {
  const jobId = req.params.jobId;

  if (!jobId) return res.status(404).json({});
  const { type, isRecurring } = req.body
  const { data, error } = await supabase
    .from("jobs")
    .upsert([{ id: jobId, type: type, isRecurring: isRecurring, }]);
    
    if(error) return res.status(500).json(error)
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
