import {BigQuery} from "@google-cloud/bigquery";
import {GoogleAuth} from "google-auth-library";

import acctKey from "./service_account_key.json" assert { type: "json" };

export const handler = async (req, context) => {
  const datasetId = process.env.BIGQUERY_DATASET_ID;
  const tableId = process.env.BIGQUERY_ANALYTICS_TABLE_ID;

  const googleAuth = new GoogleAuth({
    credentials: acctKey,
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
    projectId: acctKey.project_id,
  });

  const projectId = await googleAuth.getProjectId()
  const client = await googleAuth.getClient();
  console.log({projectId});

  const bigQueryClient = new BigQuery({
    projectId: projectId,
    authClient: client
  });

  const rows = [
    {event: req.body}
  ]

  await bigQueryClient.dataset(datasetId).table(tableId).insert(rows);

  console.log("Inserted row into bigquery");

  return new Response("Welcome!");
}
