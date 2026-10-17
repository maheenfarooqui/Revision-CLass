import dns from 'node:dns/promises'
dns.setServers(['1.1.1.1','8.8.8.8'])

import mongoose from "mongoose"
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://maheenzuhra_db_user:IGq1uTzHUQ0tYiEM@postapp.f2rxqhm.mongodb.net');
  console.log("Connected to DB");
}
export default main