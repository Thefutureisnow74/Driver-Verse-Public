// Script to insert companies from JSON file into the database using Prisma
const { PrismaClient } = require('./src/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function insertCompanies() {
  try {
    console.log('🚀 Starting company insertion process...\n');

    // Read the companies JSON file
    const companiesPath = path.join(__dirname, 'src', 'data', 'companies.json');
    const companiesData = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));

    console.log(`📊 Found ${companiesData.length} companies to insert\n`);

    // Check if companies already exist
    const existingCount = await prisma.company.count();
    if (existingCount > 0) {
      console.log(`⚠️  Warning: ${existingCount} companies already exist in the database.`);
      console.log('This script will skip companies that already exist (based on name).\n');
    }

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process companies in batches to avoid overwhelming the database
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < companiesData.length; i += batchSize) {
      batches.push(companiesData.slice(i, i + batchSize));
    }

    console.log(`📦 Processing ${batches.length} batches of ${batchSize} companies each...\n`);

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} companies)...`);

      for (const companyData of batch) {
        try {
          // Check if company already exists by name
          const existingCompany = await prisma.company.findFirst({
            where: { name: companyData.name }
          });

          if (existingCompany) {
            console.log(`⏭️  Skipping "${companyData.name}" - already exists`);
            skippedCount++;
            continue;
          }

          // Transform the data to match our Prisma schema
          const companyToInsert = {
            name: companyData.name,
            vehicleTypes: companyData.vehicle_types || [],
            averagePay: companyData.average_pay || null,
            serviceVertical: companyData.service_vertical || [],
            contractType: companyData.contract_type || 'Unknown',
            areasServed: companyData.areas_served || [],
            insuranceRequirements: companyData.insurance_requirements || null,
            licenseRequirements: companyData.license_requirements || null,
            certificationsRequired: companyData.certifications_required || [],
            website: companyData.website || null,
            contactEmail: companyData.contact_email || null,
            contactPhone: companyData.contact_phone || null,
            description: companyData.description || null,
            logoUrl: companyData.logo_url || null,
            isActive: companyData.is_active !== undefined ? companyData.is_active : true,
            workflowStatus: companyData.workflow_status || null,
            yearEstablished: companyData.year_established || null,
            companySize: companyData.company_size || null,
            headquarters: companyData.headquarters || null,
            businessModel: companyData.business_model || null,
            companyMission: companyData.company_mission || null,
            targetCustomers: companyData.target_customers || null,
            companyCulture: companyData.company_culture || null,
            videoUrl: companyData.video_url || null,
          };

          // Insert the company
          await prisma.company.create({
            data: companyToInsert
          });

          console.log(`✅ Inserted "${companyData.name}"`);
          insertedCount++;

        } catch (error) {
          console.error(`❌ Error inserting "${companyData.name}":`, error.message);
          errorCount++;
        }
      }

      // Add a small delay between batches to be gentle on the database
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log('\n🎉 Company insertion process completed!');
    console.log(`📈 Summary:`);
    console.log(`   ✅ Successfully inserted: ${insertedCount} companies`);
    console.log(`   ⏭️  Skipped (already exist): ${skippedCount} companies`);
    console.log(`   ❌ Errors: ${errorCount} companies`);
    console.log(`   📊 Total processed: ${insertedCount + skippedCount + errorCount} companies`);

    // Verify the final count
    const finalCount = await prisma.company.count();
    console.log(`\n🗄️  Total companies in database: ${finalCount}`);

  } catch (error) {
    console.error('💥 Fatal error during company insertion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the insertion script
insertCompanies();
