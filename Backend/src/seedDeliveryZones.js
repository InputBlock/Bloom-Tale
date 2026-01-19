import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { DB_NAME } from "./constants.js";
import DeliveryZone from "./models/deliveryZone.model.js";

// Mumbai Delivery Zones with ALL pincodes
const zones = [
  {
    zone_id: "ZONE1",
    name: "South Mumbai",
    description: "Fort, Colaba, Churchgate, Marine Lines, Nariman Point, CST area",
    pricing: { nextDay: 49, sameDay: 149, express: 249 },
    pincodes: [
      "400001", // Fort, GPO, Stock Exchange, Town Hall
      "400002", // Kalbadevi, Thakurdwar
      "400003", // Masjid, Mandvi, Null Bazar
      "400004", // Girgaon, Charni Road, Opera House
      "400005", // Colaba, Navy Nagar
      "400006", // Malabar Hill
      "400007", // Grant Road, Tardeo
      "400020", // Churchgate, Marine Lines
      "400021", // Nariman Point, NCPA
      "400032", // Mantralaya, Secretariate
      "400034", // Haji Ali, Tulsiwadi
      "400035", // Rajbhavan, Walkeshwar
    ]
  },
  {
    zone_id: "ZONE2",
    name: "Central Mumbai",
    description: "Dadar, Parel, Worli, Lower Parel, Byculla, Matunga",
    pricing: { nextDay: 149, sameDay: 199, express: 299 },
    pincodes: [
      "400008", // Mumbai Central, Kamathipura
      "400009", // Chinchbunder, Princess Dock
      "400010", // Mazgaon, Dockyard Road
      "400011", // Agripada, Jacob Circle, Chinchpokli
      "400012", // Parel, Lalbaug, Haffkin Institute
      "400013", // Delisle Road, CGS Colony
      "400014", // Dadar, Naigaon
      "400015", // Sewri
      "400016", // Mahim
      "400017", // Dharavi
      "400018", // Worli
      "400019", // Matunga
      "400025", // Prabhadevi
      "400026", // Cumballa Hill, Gowalia Tank
      "400027", // VJB Udyan
      "400028", // Dadar West, Shivaji Park
      "400029", // Santacruz P&T Colony
      "400030", // Worli Sea Face, Century Mill
      "400031", // Wadala, Kidwai Nagar
      "400033", // Reay Road, Cotton Exchange
      "400037", // Antop Hill
    ]
  },
  {
    zone_id: "ZONE3",
    name: "Western Suburbs",
    description: "Bandra, Khar, Santacruz, Vile Parle, Andheri, Goregaon, Malad, Kandivali, Borivali",
    pricing: { nextDay: 199, sameDay: 249, express: 349 },
    pincodes: [
      "400049", // Juhu
      "400050", // Bandra West
      "400051", // Bandra East
      "400052", // Khar, Danda
      "400053", // Andheri West
      "400054", // Santacruz West
      "400055", // Santacruz East, Vakola
      "400056", // Vile Parle West
      "400057", // Vile Parle East
      "400058", // Andheri Railway Station
      "400059", // Marol, JB Nagar
      "400060", // Jogeshwari East
      "400061", // Madh, Versova
      "400062", // Goregaon West
      "400063", // Goregaon East
      "400064", // Malad West
      "400065", // Aarey Milk Colony
      "400066", // Borivali East
      "400067", // Kandivali West, Charkop
      "400068", // Dahisar
      "400069", // Andheri East
      "400090", // Bangur Nagar
      "400091", // Borivali
      "400092", // Borivali West
      "400093", // Chakala MIDC
      "400095", // INS Hamla, Kharodi
      "400096", // SEEPZ
      "400097", // Malad East
      "400098", // Vidyanagari
      "400099", // Airport
      "400101", // Kandivali East
      "400102", // Jogeshwari West, Oshiwara
      "400103", // Mandapeshwar
      "400104", // Motilal Nagar
    ]
  },
  {
    zone_id: "ZONE4",
    name: "Eastern Suburbs",
    description: "Kurla, Ghatkopar, Vikhroli, Bhandup, Mulund, Chembur, Powai",
    pricing: { nextDay: 199, sameDay: 249, express: 349 },
    pincodes: [
      "400070", // Kurla West
      "400071", // Kurla East
      "400072", // Chunabhatti
      "400074", // Chembur
      "400075", // Trombay
      "400076", // Mankhurd
      "400077", // Chembur East
      "400078", // Bhandup West
      "400079", // Vikhroli West
      "400080", // Mulund West
      "400081", // Mulund East
      "400082", // Bhandup East
      "400083", // Ghatkopar West
      "400084", // Ghatkopar East
      "400086", // Vikhroli East
      "400087", // Kanjurmarg
      "400088", // Tilak Nagar
      "400089", // Ghatkopar
    ]
  },
  {
    zone_id: "ZONE5",
    name: "Thane & Navi Mumbai",
    description: "Thane, Navi Mumbai, Vashi, Airoli, Nerul, Panvel, Kharghar, Belapur",
    pricing: { nextDay: 249, sameDay: 349, express: 449 },
    pincodes: [
      // Thane
      "400601", // Thane West
      "400602", // Thane Naupada
      "400603", // Thane East, Kopri
      "400604", // Wagle IE
      "400605", // Kalwa
      "400606", // Jekegram
      "400607", // Chitalsar Manpada
      "400608", // Balkum
      "400610", // Apna Bazar
      "400612", // Mumbra, Diva
      // Navi Mumbai
      "400614", // Belapur, CBD
      "400701", // Ghansoli
      "400703", // Vashi, Turbhe
      "400705", // Sanpada
      "400706", // Nerul
      "400708", // Airoli
      "400709", // Kopar Khairne
      "400710", // Millennium Business Park
      // Extended Thane/Navi Mumbai
      "410206", // Kharghar
      "410208", // Taloja
      "410209", // Panvel
      "410210", // New Panvel
    ]
  }
];

async function seedDeliveryZones() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("✅ Connected to MongoDB");

    // Clear existing zones
    await DeliveryZone.deleteMany({});
    console.log("🗑️  Cleared existing delivery zones");

    // Insert new zones
    for (const zone of zones) {
      await DeliveryZone.create(zone);
      console.log(`✅ Created ${zone.name} with ${zone.pincodes.length} pincodes`);
    }

    const totalPincodes = zones.reduce((sum, z) => sum + z.pincodes.length, 0);
    console.log(`\n🎉 Seeding complete! Created ${zones.length} zones with ${totalPincodes} total pincodes`);

    console.log("\n📍 Zone Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    zones.forEach(z => {
      console.log(`${z.zone_id} - ${z.name}: ${z.pincodes.length} pincodes`);
      console.log(`   Next Day: ₹${z.pricing.nextDay} | Same Day: ₹${z.pricing.sameDay} | Express: ₹${z.pricing.express}`);
    });

    await mongoose.disconnect();
    console.log("\n✅ MongoDB disconnected");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDeliveryZones();
