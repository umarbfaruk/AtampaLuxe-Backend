import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){

await prisma.product.deleteMany();

await prisma.product.createMany({
 data:[
 {
  vendorId:"test-vendor-001",
  name:"Laptop",
  description:"Enterprise Laptop",
  category:"Electronics",
  subcategory:"Computer",
  price:150000,
  stock:10,
  brand:"Dell",
  sku:"LAP-001"
 },
 {
  vendorId:"test-vendor-001",
  name:"Phone",
  description:"Smart Phone",
  category:"Electronics",
  subcategory:"Mobile",
  price:80000,
  stock:20,
  brand:"Samsung",
  sku:"PH-001"
 }
 ]
});

console.log("Products seeded");

}

main()
.catch(console.error)
.finally(async()=>{
 await prisma.$disconnect();
});