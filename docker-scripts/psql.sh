#!/bin/bash
docker compose -f docker-compose.local.yml --env-file .env.development.local exec -it database psql -U synapse-db-admin -d synapse-db
