// ------------------------------------------------------------
// Lab 01 - From the terminal to Node.js
// ------------------------------------------------------------
// In session 1 you typed MongoDB commands directly in mongosh:
//
//   db.books.insertOne({ title: "Dune", author: "Frank Herbert" })
//   db.books.find()
//
// Here you will write the exact same operations, but as a Node.js
// script. The MongoDB driver translates your JavaScript calls into
// the same commands mongosh sends to the database.
// ------------------------------------------------------------

const { MongoClient } = require("mongodb");

// The connection string tells the driver where MongoDB is running.
// "mongodb://localhost:27017" is the default for a local installation.
const URI = "mongodb://localhost:27017";

// MongoClient is the entry point to the driver.
// You create one client per application.
const client = new MongoClient(URI);

// ------------------------------------------------------------
// Everything that talks to the database must happen inside an
// async function, because network calls take time.
// "await" pauses execution until the operation completes.
// ------------------------------------------------------------
async function main() {
  // Open the connection to MongoDB.
  await client.connect();

  // Select the database and collection to work with.
  // If they do not exist yet, MongoDB creates them on first write.
  const books = client.db("book_db").collection("books");

  // Start fresh on every run.
  await books.deleteMany({});

  // ----------------------------------------------------------
  // TODO 1 - insertOne with an embedded object
  // ----------------------------------------------------------
  // In mongosh you would write:
  //   db.books.insertOne({ title: "...", publisher: { name: "...", country: "..." } })
  //
  // Do the same here. Insert one book that has a publisher field
  // containing an embedded object with at least a name and a country.
  await  books.insertOne({
    title: "Dune",
    author: "Frank Herbert",
    publisher: { name: "Robert Laffont", country: "France"},
    tags: ["sci-fi", "desert", "classic"],
  });

  // ----------------------------------------------------------
  // TODO 2 - insertOne with an array
  // ----------------------------------------------------------
  // Insert one book that has a tags field containing
  // an array of at least 3 strings.

  await  books.insertOne({
    title: "Frankestein",
    author: "Mary Shelly",
    tags: ["gothic", "horror", "sci-fi", "classic"],
  });

  // ----------------------------------------------------------
  // TODO 3 - insertMany
  // ----------------------------------------------------------
  // Insert at least 5 books in a single call using insertMany.
  // Include a mix: some with a publisher object, some with tags, some with both.

  await books.insertMany([
    { title: "Les Misérables", author: "Victor Hugo", publisher:{ name: "Gallimard", country:"France"}, 
      tags: ["novel", "history"]},
    { title: "1984", author: "George Orwell",
      tags: ["dystopia", "politics", "classic"] },
    { title: "L'Étranger", author: "Albert Camus",
      publisher: { name: "Gallimard", country: "France" }, tags: ["philosophy", "absurdism"] },
    { title: "Ce que le jour doit à la nuit", author: "Yasmina Khadra", publisher: { name: "Julliard", country: "France" },
      tags: ["novel", "drama", "politics", "middle-east"] },
    { title: "The Hobbit", author: "J.R.R. Tolkien",
      publisher: { name: "Allen & Unwin", country: "UK" }, tags: ["fantasy"] },
  ])

  // ----------------------------------------------------------
  // TODO 4 - find all documents
  // ----------------------------------------------------------
  // Retrieve every document in the collection and log each title.
  // Hint: find() returns a cursor - call .toArray() to get an array.
  const allBooks = await books.find().toArray();
  for (const b of allBooks) {
    console.log(b.title);
  }

  // ----------------------------------------------------------
  // TODO 5 - findOne with dot notation
  // ----------------------------------------------------------
  // Find the first book whose publisher.country is "France".
  // Dot notation lets you filter on a field inside an embedded object:
  //   { "publisher.country": "France" }
  // Log the title of the result.
  const firstFrench = await books.findOne({"publisher.country": "France" })
  console.log(firstFrench.title);

  // ----------------------------------------------------------
  // TODO 6 - find with a filter
  // ----------------------------------------------------------
  // Find all books whose publisher.country is "France".
  // Log how many there are and list their titles.

  const allFrenchBooks = await books.find({"publisher.country": "France" }).toArray();
  const numOfFrenchBooks = allFrenchBooks.length;
  console.log(numOfFrenchBooks);
  for (const b of allFrenchBooks){
    console.log(b.title);
  }


  // ----------------------------------------------------------
  // TODO 7 - find with $exists
  // ----------------------------------------------------------
  // Find all books that have a tags field, regardless of its value.
  //   { tags: { $exists: true } }
  // Log each title and its tags array.
  const taggedBooks = await books.find({ tags: { $exists: true } }).toArray();
  for (const b of taggedBooks){
    console.log(b.title, b.tags);
  }

  // Always close the connection when you are done.
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
