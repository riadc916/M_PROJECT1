//this is use for reinitilize the database again


const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { data: sampleListings } = require("./data.js");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

const seedDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});
  // Ekta default user create koro
  const user = new User({ username: "admin", email: "admin@email.com" });
  await User.register(user, "password123");
  // Prottekta listing e owner set koro
  for (let listing of sampleListings) {
    listing.owner = user._id;
    await Listing.create(listing);
  }
  console.log("Database seeded!");
};

seedDB().then(() => {
  mongoose.connection.close();
});