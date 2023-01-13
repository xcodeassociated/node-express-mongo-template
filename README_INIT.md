docker exec -it mongo mongosh -u user -p password

use example1

db

db.foo.insert({"name":"tutorials point"})

db.createUser(
  {
    user: "app",
    pwd:  "password", // passwordPrompt(),  // or cleartext password
    roles: [
       { role: "readWrite", db: "example1" }
    ]
  }
)

exit

docker-compose -f ./docker-compose.yml down

rm -rf volumes/mongodb && mkdir volumes/mongodb && docker system prune -af && docker volume rm node-mongo-ts-api_mongo-init  node-mongo-ts-api_mongo-data

docker-compose -f ./docker-compose.yml up -d
