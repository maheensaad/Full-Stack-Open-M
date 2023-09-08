require('dotenv').config()
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument.');
  process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  if (process.argv.length === 3) {
    // If only the password is provided, display all entries in the phonebook
    Person.find({})
      .then((persons) => {
        console.log('phonebook:');
        persons.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
      })
      .finally(() => {
        mongoose.connection.close();
      });
  } else if (process.argv.length === 5) {
    // If password, name, and number are provided, add an entry to the phonebook
    const name = process.argv[3];
    const number = process.argv[4];

    const newPerson = new Person({
      name,
      number,
    });

    newPerson
      .save()
      .then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
      })
      .catch((error) => {
        console.error('Error adding data:', error.message);
      })
      .finally(() => {
        mongoose.connection.close();
      });
  } else {
    console.log('Invalid number of arguments.');
    mongoose.connection.close();
  }
});
