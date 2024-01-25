import {BigQuery} from "@google-cloud/bigquery";
import * as acctKey from "service_account_key.json";

const datasetId = Netlify.env.get("BIGQUERY_DATASET_ID");
const tableId = Netlify.env.get("BIGQUERY_ANALYTICS_TABLE_ID");

const bigQueryClient = new BigQuery();

async function handler(req, context) {
  const rows = [
    {event: req.body}
  ]

  await bigQueryClient.dataset(datasetId).table(tableId).insert(rows);

  console.log("Inserted row into bigquery");

  return new Response("Welcome!");
}

export default handler;
