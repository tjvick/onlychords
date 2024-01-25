import {BigQuery} from "@google-cloud/bigquery";
import {GoogleAuth} from "google-auth-library";

import acctKey from "./service_account_key.json" assert { type: "json" };

const datasetId = Netlify.env.get("BIGQUERY_DATASET_ID");
const tableId = Netlify.env.get("BIGQUERY_ANALYTICS_TABLE_ID");

const googleAuth = new GoogleAuth({
  credentials: {
    client_email: acctKey.client_email,
    private_key: acctKey.private_key,
  },
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});


async function handler(req, context) {
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

export default handler;