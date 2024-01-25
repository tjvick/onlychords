# Only Chords

A tool for learning the chords on your musical instrument.

Visit https://onlychords.com

## Contributing

This project uses Node.js and npm.

### Install Dependencies

`npm install`

### Run Development Server

`npm run dev`


## Analytics

Website events and analytics are stored in a BigQuery table within Google Cloud Platform.

The BigQuery dataset and table IDs are defined in the `opentofu/main.tf` file,
and are set as netlify environment variables in `netlify.toml`.

Events are written to BigQuery via a netlify function (see `netlify/functions` directory)

## Infrastructure as Code, using OpenTofu

OpenTofu is used to deploy resources to GCP

1. Login to gcloud:
    ```sh
    gcloud auth application-default login
    ```

2. Enter the `opentofu` directory:
   ```shell
   cd opentofu
   ```

3. Do tofu things:
    ```shell
    tofu init
    tofu plan
    tofu apply
    ```
