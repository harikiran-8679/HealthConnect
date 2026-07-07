import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
  const userPasswordHash = await bcrypt.hash('User@123456', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@healthconnect.org' },
    update: {},
    create: {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@healthconnect.org',
      passwordHash: adminPasswordHash,
      role: 'admin',
      preferredLanguage: 'en',
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@healthconnect.org' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@healthconnect.org',
      passwordHash: userPasswordHash,
      role: 'user',
      preferredLanguage: 'te',
    },
  });

  const en = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: { code: 'en', name: 'English' },
  });

  const te = await prisma.language.upsert({
    where: { code: 'te' },
    update: {},
    create: { code: 'te', name: 'తెలుగు' },
  });

  const healthTipsData = [
    {
      category: 'hygiene',
      translations: [
        { languageCode: 'en', title: 'Wash Hands Regularly', description: 'Wash your hands with soap and water for at least 20 seconds, especially before eating and after using the toilet.' },
        { languageCode: 'te', title: 'క్రమం తప్పకుండా చేతులు కడుక్కోండి', description: 'భోజనానికి ముందు మరియు మరుగుదొడ్డి ఉపయోగించిన తర్వాత కనీసం 20 సెకన్ల పాటు సబ్బు మరియు నీటితో చేతులు కడుక్కోండి.' },
      ],
    },
    {
      category: 'nutrition',
      translations: [
        { languageCode: 'en', title: 'Eat a Balanced Diet', description: 'Include fruits, vegetables, grains, and protein in your daily meals for good health and immunity.' },
        { languageCode: 'te', title: 'సమతుల్య ఆహారం తీసుకోండి', description: 'మంచి ఆరోగ్యం మరియు రోగనిరోధక శక్తి కోసం మీ రోజువారీ భోజనంలో పండ్లు, కూరగాయలు, ధాన్యాలు మరియు ప్రోటీన్ చేర్చండి.' },
      ],
    },
    {
      category: 'sanitation',
      translations: [
        { languageCode: 'en', title: 'Use Clean Drinking Water', description: 'Always drink boiled or filtered water. Store water in clean covered containers to prevent diseases.' },
        { languageCode: 'te', title: 'శుభ్రమైన త్రాగునీరు ఉపయోగించండి', description: 'ఎల్లప్పుడూ ఉడికించిన లేదా ఫిల్టర్ చేసిన నీరు త్రాగండి. వ్యాధులను నివారించడానికి నీటిని శుభ్రమైన మూత ఉన్న పాత్రలలో నిల్వ చేయండి.' },
      ],
    },
    {
      category: 'seasonal',
      translations: [
        { languageCode: 'en', title: 'Prevent Mosquito Breeding', description: 'Do not let water collect around your home. Use mosquito nets while sleeping to prevent malaria and dengue.' },
        { languageCode: 'te', title: 'దోమల వృద్ధిని నిరోధించండి', description: 'మీ ఇంటి చుట్టూ నీరు నిల్వ ఉండనివ్వకండి. మలేరియా మరియు డెంగ్యూ నివారణకు నిద్రిస్తున్నప్పుడు దోమతెరలు ఉపయోగించండి.' },
      ],
    },
    {
      category: 'hygiene',
      translations: [
        { languageCode: 'en', title: 'Keep Your Surroundings Clean', description: 'Sweep and mop your home daily. Dispose garbage properly and keep the area around your house clean.' },
        { languageCode: 'te', title: 'మీ పరిసరాలను శుభ్రంగా ఉంచండి', description: 'మీ ఇంటిని ప్రతిరోజూ శుభ్రం చేయండి. చెత్తను సరిగ్గా పారవేయండి మరియు మీ ఇంటి చుట్టూ ఉన్న ప్రాంతాన్ని శుభ్రంగా ఉంచండి.' },
      ],
    },
    {
      category: 'nutrition',
      translations: [
        { languageCode: 'en', title: 'Breastfeeding Benefits', description: 'Breastfeed your baby exclusively for the first 6 months. It provides essential nutrients and protects against infections.' },
        { languageCode: 'te', title: 'తల్లిపాలు ఇవ్వడం వల్ల ప్రయోజనాలు', description: 'మొదటి 6 నెలల వరకు మీ బిడ్డకు ప్రత్యేకంగా తల్లిపాలు ఇవ్వండి. ఇది అవసరమైన పోషకాలను అందిస్తుంది మరియు ఇన్ఫెక్షన్ల నుండి రక్షిస్తుంది.' },
      ],
    },
  ];

  for (const tipData of healthTipsData) {
    await prisma.healthTip.create({ data: { category: tipData.category, translations: { create: tipData.translations } } });
  }

  const diseasesData = [
    {
      name: 'Malaria',
      translations: [
        { languageCode: 'en', symptoms: 'High fever, chills, sweating, headache, nausea, body aches', prevention: 'Use mosquito nets, remove stagnant water, use mosquito repellents, keep surroundings clean', careTips: 'Seek immediate medical help. Complete the full course of prescribed medication. Rest and drink plenty of fluids.' },
        { languageCode: 'te', symptoms: 'అధిక జ్వరం, చలి, చెమట, తలనొప్పి, వికారం, శరీర నొప్పులు', prevention: 'దోమతెరలు ఉపయోగించండి, నిల్వ ఉన్న నీటిని తొలగించండి, దోమల నివారణ మందులు ఉపయోగించండి, పరిసరాలను శుభ్రంగా ఉంచండి', careTips: 'వెంటనే వైద్య సహాయం పొందండి. సూచించిన మందుల పూర్తి కోర్సు పూర్తి చేయండి. విశ్రాంతి తీసుకోండి మరియు పుష్కలంగా ద్రవాలు త్రాగండి.' },
      ],
    },
    {
      name: 'Dengue',
      translations: [
        { languageCode: 'en', symptoms: 'High fever, severe headache, pain behind eyes, joint and muscle pain, skin rash', prevention: 'Prevent mosquito bites, use mosquito repellent, wear full-sleeve clothes, keep water containers covered', careTips: 'Consult a doctor immediately. Do not take aspirin or ibuprofen. Drink plenty of fluids and rest.' },
        { languageCode: 'te', symptoms: 'అధిక జ్వరం, తీవ్రమైన తలనొప్పి, కళ్ళ వెనుక నొప్పి, కీళ్ల మరియు కండరాల నొప్పి, చర్మంపై దద్దుర్లు', prevention: 'దోమ కాటును నివారించండి, దోమల నివారణ మందు ఉపయోగించండి, పూర్తి చేతి బట్టలు ధరించండి, నీటి పాత్రలను మూసి ఉంచండి', careTips: 'వెంటనే వైద్యుడిని సంప్రదించండి. ఆస్పిరిన్ లేదా ఇబుప్రోఫెన్ తీసుకోకండి. పుష్కలంగా ద్రవాలు త్రాగండి మరియు విశ్రాంతి తీసుకోండి.' },
      ],
    },
    {
      name: 'Diarrhea',
      translations: [
        { languageCode: 'en', symptoms: 'Frequent loose or watery stools, stomach cramps, dehydration, fever, nausea', prevention: 'Drink clean water, wash hands before eating, eat properly cooked food, maintain food hygiene', careTips: 'Drink ORS solution regularly. Continue eating light meals. See a doctor if symptoms last more than 2 days.' },
        { languageCode: 'te', symptoms: 'తరచుగా వదులుగా లేదా నీటి మలం, కడుపు తిమ్మిరి, నిర్జలీకరణం, జ్వరం, వికారం', prevention: 'శుభ్రమైన నీరు త్రాగండి, భోజనానికి ముందు చేతులు కడుక్కోండి, బాగా వండిన ఆహారం తినండి, ఆహార పరిశుభ్రత పాటించండి', careTips: 'క్రమం తప్పకుండా ఓఆర్ఎస్ ద్రావణం త్రాగండి. తేలికపాటి భోజనం కొనసాగించండి. లక్షణాలు 2 రోజుల కంటే ఎక్కువ ఉంటే వైద్యుడిని చూడండి.' },
      ],
    },
    {
      name: 'Tuberculosis (TB)',
      translations: [
        { languageCode: 'en', symptoms: 'Persistent cough for more than 3 weeks, chest pain, coughing up blood, fever, night sweats, weight loss', prevention: 'Cover mouth and nose when coughing, ensure good ventilation, get BCG vaccine, complete treatment if diagnosed', careTips: 'Take all TB medicines regularly for the full 6 months. Do not stop early. Eat nutritious food. Wear a mask.' },
        { languageCode: 'te', symptoms: '3 వారాల కంటే ఎక్కువ నిరంతర దగ్గు, ఛాతీ నొప్పి, రక్తం దగ్గు, జ్వరం, రాత్రి చెమట, బరువు తగ్గడం', prevention: 'దగ్గుతున్నప్పుడు నోరు మరియు ముక్కు కప్పండి, మంచి వెంటిలేషన్ నిర్ధారించుకోండి, బిసిజి టీకా వేయించుకోండి, నిర్ధారణ అయితే చికిత్స పూర్తి చేయండి', careTips: 'పూర్తి 6 నెలలు క్రమం తప్పకుండా అన్ని టిబి మందులు తీసుకోండి. ముందుగా ఆపకండి. పోషకమైన ఆహారం తినండి. మాస్క్ ధరించండి.' },
      ],
    },
    {
      name: 'Waterborne Diseases',
      translations: [
        { languageCode: 'en', symptoms: 'Diarrhea, vomiting, stomach pain, dehydration, fever, weakness', prevention: 'Drink boiled or purified water, avoid street food, wash fruits and vegetables, maintain personal hygiene', careTips: 'Stay hydrated with ORS. Eat light, easily digestible food. Seek medical help if severe dehydration occurs.' },
        { languageCode: 'te', symptoms: 'విరేచనాలు, వాంతులు, కడుపు నొప్పి, నిర్జలీకరణం, జ్వరం, బలహీనత', prevention: 'ఉడికించిన లేదా శుద్ధి చేసిన నీరు త్రాగండి, వీధి ఆహారాన్ని నివారించండి, పండ్లు మరియు కూరగాయలు కడగాలి, వ్యక్తిగత పరిశుభ్రత పాటించండి', careTips: 'ఓఆర్ఎస్ తో హైడ్రేటెడ్ గా ఉండండి. తేలికపాటి, సులభంగా జీర్ణమయ్యే ఆహారం తినండి. తీవ్రమైన నిర్జలీకరణం సంభవించినట్లయితే వైద్య సహాయం పొందండి.' },
      ],
    },
  ];

  for (const diseaseData of diseasesData) {
    await prisma.disease.create({ data: { name: diseaseData.name, translations: { create: diseaseData.translations } } });
  }

  const vaccinationTemplates = [
    { vaccineName: 'BCG', recommendedAgeDays: 0, description: 'At birth - protects against tuberculosis' },
    { vaccineName: 'Hepatitis B - Dose 1', recommendedAgeDays: 0, description: 'At birth - first dose of Hepatitis B vaccine' },
    { vaccineName: 'OPV - Dose 1', recommendedAgeDays: 0, description: 'At birth - Oral Polio Vaccine' },
    { vaccineName: 'Pentavalent - Dose 1', recommendedAgeDays: 42, description: '6 weeks - DTP+HepB+Hib combination' },
    { vaccineName: 'OPV - Dose 2', recommendedAgeDays: 42, description: '6 weeks - second dose' },
    { vaccineName: 'Rotavirus - Dose 1', recommendedAgeDays: 42, description: '6 weeks - protects against rotavirus diarrhea' },
    { vaccineName: 'PCV - Dose 1', recommendedAgeDays: 42, description: '6 weeks - Pneumococcal Conjugate Vaccine' },
    { vaccineName: 'Pentavalent - Dose 2', recommendedAgeDays: 70, description: '10 weeks - second dose' },
    { vaccineName: 'OPV - Dose 3', recommendedAgeDays: 70, description: '10 weeks - third dose' },
    { vaccineName: 'Rotavirus - Dose 2', recommendedAgeDays: 70, description: '10 weeks - second dose' },
    { vaccineName: 'Pentavalent - Dose 3', recommendedAgeDays: 98, description: '14 weeks - third dose' },
    { vaccineName: 'OPV - Dose 4', recommendedAgeDays: 98, description: '14 weeks - fourth dose' },
    { vaccineName: 'Rotavirus - Dose 3', recommendedAgeDays: 98, description: '14 weeks - third dose' },
    { vaccineName: 'PCV - Dose 2', recommendedAgeDays: 98, description: '14 weeks - second dose' },
    { vaccineName: 'Measles/Rubella - Dose 1', recommendedAgeDays: 270, description: '9-12 months - first dose' },
    { vaccineName: 'PCV - Booster', recommendedAgeDays: 365, description: '12-15 months - booster dose' },
    { vaccineName: 'Measles/Rubella - Dose 2', recommendedAgeDays: 540, description: '16-24 months - second dose' },
    { vaccineName: 'DPT - Booster', recommendedAgeDays: 540, description: '16-24 months - booster dose' },
    { vaccineName: 'OPV - Booster', recommendedAgeDays: 540, description: '16-24 months - booster dose' },
    { vaccineName: 'TT (Tetanus) - Dose 1', recommendedAgeDays: 3650, description: '10 years - Tetanus toxoid' },
    { vaccineName: 'TT (Tetanus) - Dose 2', recommendedAgeDays: 7300, description: '16 years - Tetanus toxoid booster' },
  ];

  for (const template of vaccinationTemplates) {
    await prisma.vaccinationScheduleTemplate.create({ data: template });
  }

  const emergencyContacts = [
    // National/Universal Emergency Numbers
    { name: 'National Ambulance Service', phone: '108', type: 'ambulance', state: null, district: null, village: null },
    { name: 'Medical Emergency', phone: '102', type: 'ambulance', state: null, district: null, village: null },
    { name: 'Emergency Response System', phone: '112', type: 'police', state: null, district: null, village: null },
    { name: 'Police Helpline', phone: '100', type: 'police', state: null, district: null, village: null },
    { name: 'Fire Services', phone: '101', type: 'fire', state: null, district: null, village: null },
    { name: 'Women\'s Helpline', phone: '181', type: 'women_helpline', state: null, district: null, village: null },
    { name: 'Child Helpline', phone: '1098', type: 'child_helpline', state: null, district: null, village: null },
    { name: 'Poison Control', phone: '1800-120-5253', type: 'poison_control', state: null, district: null, village: null },
    { name: 'Andhra Pradesh Health Helpline', phone: '104', type: 'ambulance', state: 'Andhra Pradesh', district: null, village: null },

    // Hospitals - Rajahmundry, East Godavari District
    { name: 'Government General Hospital, Rajahmundry', phone: '0883-2422202', type: 'hospital', state: 'Andhra Pradesh', district: 'East Godavari', village: 'Rajahmundry' },
    { name: 'GSL Medical College & General Hospital', phone: '0883-6699999', type: 'hospital', state: 'Andhra Pradesh', district: 'East Godavari', village: 'Rajahmundry' },
    { name: 'GSL Medical College (Alternate)', phone: '0883-2484999', type: 'hospital', state: 'Andhra Pradesh', district: 'East Godavari', village: 'Rajahmundry' },

    // Clinics - Bommuru Area, Rajahmundry Rural
    { name: 'Sruthi Hospital - Dwaraka Nagar', phone: '0883-2431919', type: 'clinic', state: 'Andhra Pradesh', district: 'East Godavari', village: 'Bommuru' },
    { name: 'Dr. G. Kasi Visalakshi Clinic', phone: '0883-2465990', type: 'clinic', state: 'Andhra Pradesh', district: 'East Godavari', village: 'Bommuru' },

    // District Health Office
    { name: 'DMHO Office - East Godavari', phone: '0884-2362842', type: 'hospital', state: 'Andhra Pradesh', district: 'East Godavari', village: 'Kakinada' },

    // Police - Rajahmundry Rural
    { name: 'Prakashnagar Police Station', phone: '0883-2443633', type: 'police', state: 'Andhra Pradesh', district: 'East Godavari', village: 'Rajahmundry' },
  ];

  for (const contact of emergencyContacts) {
    await prisma.emergencyContact.create({ data: contact });
  }

  const womenChildData = [
    {
      category: 'pregnancy_care',
      translations: [
        { languageCode: 'en', title: 'Healthy Diet During Pregnancy', body: 'Eat a balanced diet with plenty of fruits, vegetables, grains, and protein. Take folic acid and iron supplements as prescribed. Drink at least 8 glasses of water daily. Avoid alcohol, smoking, and raw or undercooked foods.' },
        { languageCode: 'te', title: 'గర్భధారణ సమయంలో ఆరోగ్యకరమైన ఆహారం', body: 'పండ్లు, కూరగాయలు, ధాన్యాలు మరియు ప్రోటీన్ తో సమతుల్య ఆహారం తీసుకోండి. సూచించిన విధంగా ఫోలిక్ యాసిడ్ మరియు ఐరన్ సప్లిమెంట్స్ తీసుకోండి. రోజూ కనీసం 8 గ్లాసుల నీరు త్రాగండి. మద్యం, ధూమపానం మరియు ముడి లేదా ఉడకని ఆహారాలను నివారించండి.' },
      ],
    },
    {
      category: 'newborn_care',
      translations: [
        { languageCode: 'en', title: 'Caring for Your Newborn', body: 'Breastfeed your baby within the first hour of birth. Keep the baby warm and clean. Immunize on schedule. Watch for signs of illness like fever, difficulty feeding, or unusual crying. Visit the health center for regular checkups.' },
        { languageCode: 'te', title: 'మీ నవజాత శిశువును సంరక్షించడం', body: 'పుట్టిన మొదటి గంటలో మీ బిడ్డకు తల్లిపాలు ఇవ్వండి. శిశువును వెచ్చగా మరియు శుభ్రంగా ఉంచండి. షెడ్యూల్ ప్రకారం టీకాలు వేయించండి. జ్వరం, ఆహారం తీసుకోవడంలో ఇబ్బంది లేదా అసాధారణ ఏడుపు వంటి అనారోగ్య సంకేతాల కోసం చూడండి. క్రమం తప్పకుండా తనిఖీల కోసం ఆరోగ్య కేంద్రాన్ని సందర్శించండి.' },
      ],
    },
    {
      category: 'child_growth',
      translations: [
        { languageCode: 'en', title: 'Child Growth Milestones', body: 'By 3 months: smiles, follows objects with eyes. By 6 months: sits with support, reaches for toys. By 12 months: stands with support, says simple words. By 2 years: runs, speaks short sentences. Track your child\'s growth at regular health checkups.' },
        { languageCode: 'te', title: 'పిల్లల అభివృద్ధి మైలురాళ్ళు', body: '3 నెలలకు: నవ్వుతుంది, కళ్ళతో వస్తువులను అనుసరిస్తుంది. 6 నెలలకు: మద్దతుతో కూర్చుంటుంది, బొమ్మల కోసం చేరుకుంటుంది. 12 నెలలకు: మద్దతుతో నిలబడుతుంది, సరళమైన పదాలు చెప్పింది. 2 సంవత్సరాలకు: పరిగెడుతుంది, చిన్న వాక్యాలు మాట్లాడుతుంది. క్రమం తప్పకుండా ఆరోగ్య తనిఖీలలో మీ పిల్లల పెరుగుదలను ట్రాక్ చేయండి.' },
      ],
    },
    {
      category: 'maternal_nutrition',
      translations: [
        { languageCode: 'en', title: 'Nutrition Tips for New Mothers', body: 'Eat protein-rich foods like dal, eggs, and milk. Include green leafy vegetables and fruits. Drink plenty of water and get adequate rest. Continue taking iron and calcium supplements as prescribed by your doctor.' },
        { languageCode: 'te', title: 'కొత్త తల్లుల కోసం పోషకాహార చిట్కాలు', body: 'పప్పు, గుడ్లు మరియు పాలు వంటి ప్రోటీన్ అధికంగా ఉండే ఆహారాలు తినండి. ఆకుకూరలు మరియు పండ్లు చేర్చండి. పుష్కలంగా నీరు త్రాగండి మరియు తగినంత విశ్రాంతి తీసుకోండి. మీ డాక్టర్ సూచించిన విధంగా ఐరన్ మరియు కాల్షియం సప్లిమెంట్స్ కొనసాగించండి.' },
      ],
    },
  ];

  for (const contentData of womenChildData) {
    await prisma.womenChildContent.create({ data: { category: contentData.category, translations: { create: contentData.translations } } });
  }

  console.log('Seed data created successfully!');
  console.log('');
  console.log('Admin Login:');
  console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@healthconnect.org'}`);
  console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  console.log('');
  console.log('Demo User Login:');
  console.log('  Email: demo@healthconnect.org');
  console.log('  Password: User@123456');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
