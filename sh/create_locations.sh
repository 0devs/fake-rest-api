 #!/bin/bash
 http POST  localhost:8080/api/locations url=/topics method=GET response='{"fake": "GET"}'
 http POST  localhost:8080/api/locations url=/topics method=POST response='{"fake": "POST"}'
 http POST  localhost:8080/api/locations url=/topics method=PUT response='{"fake": "PUT"}'
 http POST  localhost:8080/api/locations url=/topics method=PATCH response='{"fake": "PATCH"}'
 http POST  localhost:8080/api/locations url=/topics method=DELETE response='{"fake": "DELETE"}'