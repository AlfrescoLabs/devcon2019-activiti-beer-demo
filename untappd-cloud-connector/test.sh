#!/usr/bin/env bash
CLIENT_ID=51B5BAED65B9556BB46B0F1788E83A13A8E22C19
CLIENT_SECRET=2843392EFC7BA90B8747A754B6201410B1A8CD1D
curl -q "https://api.untappd.com/v4/search/beer?q=Pliny&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET" > search-result.json
cat search-result.json | jq
