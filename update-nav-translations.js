const fs = require('fs');
const path = require('path');
const dirs = ['en', 'am', 'om', 'ti'];

const navAdditions = {
  en: { pricing: "Pricing", about: "About", login: "Log In", signup: "Sign Up" },
  am: { pricing: "ዋጋ አሰጣጥ", about: "ስለ እኛ", login: "ግባ", signup: "ተመዝገብ" },
  om: { pricing: "Gatii", about: "Waa'ee keenya", login: "Seeni", signup: "Galmoofna" },
  ti: { pricing: "ዋጋ", about: "ብዛዕባና", login: "እቶ", signup: "ተመዝገብ" }
};

dirs.forEach(lang => {
    const p = path.join('messages', lang + '.json');
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    data.nav = { ...data.nav, ...navAdditions[lang] };
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    console.log(`Updated ${p}`);
});
