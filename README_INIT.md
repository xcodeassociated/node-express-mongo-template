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
