const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const client = new MongoClient(URI);

// You will understand this boilerplate in session 6.
// For now, your job is to fill in the seven TODOs below.

async function main() {
  await client.connect();
  const users = client.db("blog_db").collection("users");

  await users.deleteMany({});

  // TODO 1: insert a user with an embedded address object.
  // The address must have at least a city and a country field.
  await users.insertOne({
    name: "Selena Decroos",
    date_of_birth: "12/04/2006",
    address : {city: "Paris", country: "France"}
  })

  // TODO 2: insert a user with a skills array containing at least 3 items.
  await users.insertOne({
    name: "Elise Sourget",
    date_of_birth: "06/01/2002",
    skills: ["Data&Tech", "Design", "Cooking", "Editing"]
  })

  // TODO 3: use insertMany to insert at least 5 users in a single call.
  // Requirements:
  //   - At least 2 users must have address.country set to "France"
  //   - At least 2 users must have a skills array with at least 1 item
  await users.insertMany([
    {name: "Zaky Kamel", date_of_birth: "02/08/2005", address:{city: "Annecy", country: "France"}, skills: ["coding", "drawing", "jokes"]},
    {name: "Malek Sidjil", date_of_birth: "19/08/1999", skills: []},
    {name: "Walid Hammoud", date_of_birth: "14/04/2009", address: {city: "Abu Dhabi", country : "UAE"}, skills: ["pokemon"]},
    {name: "Laetitia Anis", date_of_birth: "13/12/2005", address:{city: "Paris", country: "France"}, skills: ["spanish", "drawing"]},
    {name: "Samia Kahlout", date_of_birth: "05/11/1976", skills: ["Cooking", "Driving", "Turkish"]}
  ])

  // TODO 4: retrieve all documents and log each user's name.
  const allUsers = await users.find().toArray();
  for (const u of allUsers){
    console.log(u.name);
  }
  

  // TODO 5: use dot notation to find the user whose address.city is "Paris" and log the result.
  const firstInParis = await users.findOne({"address.city" : "Paris"});
  console.log(firstInParis);

  // TODO 6: find all users whose address.country is "France" and log their names.
  const livesInParis = await users.find({"address.country" : "France"}).toArray();
  for (const u of livesInParis){
    console.log(u.name);
  }

  // TODO 7: find all users who have a skills field and log their names.
  const skilledUsers = await users.find({skills : {$exists: true}}).toArray();
  for (const u of skilledUsers){
    console.log(u.name);
  }


  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
