provider "google" {
  project = "onlychords"
  region  = "us-central1"
  zone    = "us-central1-c"
}

resource "google_bigquery_dataset" "default" {
  dataset_id                  = "onlychords_dataset"
  friendly_name               = "OnlyChords dataset"
  description                 = "Storage for OnlyChords website"
  location                    = "us-central1"
}

resource "google_bigquery_table" "default" {
  dataset_id = google_bigquery_dataset.default.dataset_id
  table_id   = "analytics"
  schema = <<EOF
[
  {
    "name": "timestamp",
    "type": "TIMESTAMP",
    "mode": "REQUIRED",
    "description": "Timestamp",
    "defaultValueExpression": "CURRENT_TIMESTAMP"
  },
  {
    "name": "event",
    "type": "JSON",
    "mode": "NULLABLE"
  }
]
EOF
  time_partitioning {
    type = "MONTH"
  }
  deletion_protection=false
}
