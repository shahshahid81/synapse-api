#!/bin/bash
docker compose exec -it database psql -U synapse-db-admin -d synapse-db
