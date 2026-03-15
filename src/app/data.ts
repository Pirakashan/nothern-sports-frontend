export interface Facility {
  id: string;
  name: string;
  nameSi: string;
  nameTa: string;
  slug: string;
  description: string;
  descriptionSi: string;
  descriptionTa: string;
  image: string;
  sports: string[];
  pricingData: FacilityPricingData;
}

export interface FacilityPricingData {
  competition: PricingRow[];
  practices: PricingRow[];
  refundableDeposits: DepositRow[];
}

export interface PricingRow {
  no: number;
  event: string;
  eventSi: string;
  eventTa: string;
  sports: string;
  sportsSi: string;
  sportsTa: string;
  duration: string;
  govtSchools: number;
  club: number;
  intlSchools: number;
  international: number;
}

export interface DepositRow {
  no: number;
  customerType: string;
  customerTypeSi: string;
  customerTypeTa: string;
  duration: string;
  deposit: number;
}

// Keep old interfaces for backward compatibility
export interface PricingTier {
  category: string;
  categorySi: string;
  categoryTa: string;
  govtSchools: number;
  club: number;
  intlSchools: number;
  international: number;
}

export interface DepositInfo {
  customerType: string;
  amount: number;
}

export interface NewsItem {
  id: string;
  title: string;
  titleSi: string;
  titleTa: string;
  excerpt: string;
  excerptSi: string;
  excerptTa: string;
  date: string;
  image: string;
}

export interface BookingSlot {
  id: string;
  facilityId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked';
  bookedBy?: string;
}

export const facilities: Facility[] = [
  {
    id: 'outdoor-stadium',
    name: 'Outdoor Stadium',
    nameSi: 'එළිමහන් ක්‍රීඩාංගනය',
    nameTa: 'வெளிப்புற அரங்கம்',
    slug: 'outdoor-stadium',
    description: 'State-of-the-art outdoor stadium for team sports, athletics, and large-scale events. Features professional-grade field with spectator seating for 5,000.',
    descriptionSi: 'කණ්ඩායම් ක්‍රීඩා, මලල ක්‍රීඩා සහ මහා පරිමාණ සිදුවීම් සඳහා නවීන එළිමහන් ක්‍රීඩාංගනය. ප්‍රේක්ෂකයින් 5,000 සඳහා ආසන සහිත වෘත්තීය ශ්‍රේණියේ පිටිය.',
    descriptionTa: 'குழு விளையாட்டுகள், தடகளம் மற்றும் பெரிய அளவிலான நிகழ்வுகளுக்கான அதிநவீன வெளிப்புற அரங்கம். 5,000 பார்வையாளர்களுக்கான இருக்கைகளுடன் கூடிய தொழில்முறை தர மைதானம்.',
    image: 'sports stadium field',
    sports: ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Kabbadi', 'Hockey', 'Rugby', 'Tennis', 'Badminton', 'Baseball', 'Softball', 'Athletics', 'Cycling', 'Swimming', 'Running', 'Long Jump', 'High Jump', 'Kho Kho', 'Elle', 'NetBall', 'Judo', 'Wrestling'],
    pricingData: {
      competition: [
        {
          no: 1, event: 'Outdoor Team Sports', eventSi: 'එළිමහන් කණ්ඩායම් ක්‍රීඩා', eventTa: 'வெளிப்புற குழு விளையாட்டுகள்',
          sports: 'Football, Rugby, Hockey, Elle, Kabbadi', sportsSi: 'පාපන්දු, රග්බි, හොකී, එල්ලේ, කබඩි', sportsTa: 'கால்பந்து, ரக்பி, ஹாக்கி, எல்லே, கபடி',
          duration: 'Per hour', govtSchools: 1760, club: 2820, intlSchools: 2820, international: 5630
        },
        {
          no: 2, event: 'Athletic meet/Other', eventSi: 'මලල ක්‍රීඩා රැස්වීම/වෙනත්', eventTa: 'தடகள கூட்டம்/மற்றவை',
          sports: 'Athletic', sportsSi: 'මලල ක්‍රීඩා', sportsTa: 'தடகளம்',
          duration: 'Per hour', govtSchools: 2110, club: 3520, intlSchools: 3520, international: 5630
        }
      ],
      practices: [
        {
          no: 1, event: 'Plan A', eventSi: 'සැලසුම A', eventTa: 'திட்டம் A',
          sports: 'Football, Rugby, Hockey, Elle, Cricket, NetBall, Kabbadi', sportsSi: 'පාපන්දු, රග්බි, හොකී, එල්ලේ, ක්‍රිකට්, නෙට්බෝල්, කබඩි', sportsTa: 'கால்பந்து, ரக்பி, ஹாக்கி, எல்லே, கிரிக்கெட், நெட்பால், கபடி',
          duration: 'Per hour', govtSchools: 1410, club: 2120, intlSchools: 2120, international: 5630
        },
        {
          no: 2, event: 'Other practice', eventSi: 'වෙනත් පුහුණුව', eventTa: 'பிற பயிற்சி',
          sports: 'Other practice', sportsSi: 'වෙනත් පුහුණුව', sportsTa: 'பிற பயிற்சி',
          duration: 'Per hour', govtSchools: 1410, club: 2820, intlSchools: 2820, international: 7040
        },
        {
          no: 3, event: 'Hall - Judo/Wrestling & Other Martial Arts and Other Practices', eventSi: 'ශාලාව - ජුඩෝ/මල්ලව පොර සහ වෙනත් සටන් කලා', eventTa: 'ஹால் - ஜூடோ/மல்யுத்தம் & பிற தற்காப்பு கலைகள்',
          sports: 'Judo, Wrestling, Other practice', sportsSi: 'ජුඩෝ, මල්ලව පොර, වෙනත්', sportsTa: 'ஜூடோ, மல்யுத்தம், பிற பயிற்சி',
          duration: 'Per hour', govtSchools: 710, club: 710, intlSchools: 710, international: 710
        },
        {
          no: 4, event: 'Rehearsal', eventSi: 'පුහුණුව', eventTa: 'ஒத்திகை',
          sports: 'Athletic', sportsSi: 'මලල ක්‍රීඩා', sportsTa: 'தடகளம்',
          duration: 'Per hour', govtSchools: 1410, club: 2820, intlSchools: 2820, international: 5630
        }
      ],
      refundableDeposits: [
        { no: 1, customerType: 'Government Schools', customerTypeSi: 'රජයේ පාසල්', customerTypeTa: 'அரசுப் பள்ளிகள்', duration: 'Per hour', deposit: 12000 },
        { no: 2, customerType: 'Club/Institute', customerTypeSi: 'සමාජය/ආයතනය', customerTypeTa: 'கிளப்/நிறுவனம்', duration: 'Per hour', deposit: 24000 },
        { no: 3, customerType: 'International Schools', customerTypeSi: 'ජාත්‍යන්තර පාසල්', customerTypeTa: 'சர்வதேச பள்ளிகள்', duration: 'Per hour', deposit: 24000 },
        { no: 4, customerType: 'International', customerTypeSi: 'ජාත්‍යන්තර', customerTypeTa: 'சர்வதேசம்', duration: 'Per hour', deposit: 36000 }
      ]
    }
  },
  {
    id: 'swimming-pool',
    name: 'Swimming Pool',
    nameSi: 'පිහිනුම් තටාකය',
    nameTa: 'நீச்சல் குளம்',
    slug: 'swimming-pool',
    description: 'Olympic-sized swimming pool with 8 lanes, heated water system, and professional timing equipment. Separate diving area and children\'s pool available.',
    descriptionSi: 'පටි 8ක්, රත් කළ ජල පද්ධතියක් සහ වෘත්තීය කාල ගණන උපකරණ සහිත ඔලිම්පික් ප්‍රමාණයේ පිහිනුම් තටාකය. වෙනම කිමිදුම් ප්‍රදේශය සහ ළමා තටාකය තිබේ.',
    descriptionTa: '8 பாதைகள், சூடான நீர் அமைப்பு மற்றும் தொழில்முறை நேர உபகரணங்களுடன் கூடிய ஒலிம்பிக் அளவு நீச்சல் குளம். தனி டைவிங் பகுதி மற்றும் குழந்தைகள் குளம் உள்ளது.',
    image: 'olympic swimming pool lanes',
    sports: ['Swimming', 'Diving', 'Water Polo'],
    pricingData: {
      competition: [
        {
          no: 1, event: 'Swimming Competition', eventSi: 'පිහිනුම් තරඟය', eventTa: 'நீச்சல் போட்டி',
          sports: 'Swimming, Diving, Water Polo', sportsSi: 'පිහිනුම, කිමිදීම, වතුර පෝලෝ', sportsTa: 'நீச்சல், டைவிங், வாட்டர் போலோ',
          duration: 'Per hour', govtSchools: 2000, club: 3500, intlSchools: 3500, international: 6000
        }
      ],
      practices: [
        {
          no: 1, event: 'Swimming Training', eventSi: 'පිහිනුම් පුහුණුව', eventTa: 'நீச்சல் பயிற்சி',
          sports: 'Swimming, Diving', sportsSi: 'පිහිනුම, කිමිදීම', sportsTa: 'நீச்சல், டைவிங்',
          duration: 'Per hour', govtSchools: 1500, club: 2500, intlSchools: 2500, international: 4500
        },
        {
          no: 2, event: 'Public Swimming', eventSi: 'මහජන පිහිනීම', eventTa: 'பொது நீச்சல்',
          sports: 'Swimming', sportsSi: 'පිහිනුම', sportsTa: 'நீச்சல்',
          duration: 'Per person', govtSchools: 200, club: 300, intlSchools: 300, international: 500
        }
      ],
      refundableDeposits: [
        { no: 1, customerType: 'Government Schools', customerTypeSi: 'රජයේ පාසල්', customerTypeTa: 'அரசுப் பள்ளிகள்', duration: 'Per hour', deposit: 10000 },
        { no: 2, customerType: 'Club/Institute', customerTypeSi: 'සමාජය/ආයතනය', customerTypeTa: 'கிளப்/நிறுவனம்', duration: 'Per hour', deposit: 20000 },
        { no: 3, customerType: 'International Schools', customerTypeSi: 'ජාත්‍යන්තර පාසල්', customerTypeTa: 'சர்வதேச பள்ளிகள்', duration: 'Per hour', deposit: 20000 },
        { no: 4, customerType: 'International', customerTypeSi: 'ජාත්‍යන්තර', customerTypeTa: 'சர்வதேசம்', duration: 'Per hour', deposit: 30000 }
      ]
    }
  },
  {
    id: 'indoor-stadium',
    name: 'Indoor Stadium',
    nameSi: 'ගෘහස්ථ ක්‍රීඩාංගනය',
    nameTa: 'உட்புற அரங்கம்',
    slug: 'indoor-stadium',
    description: 'Multi-purpose indoor stadium with climate control, professional lighting, and sound system. Suitable for basketball, volleyball, badminton, and indoor events.',
    descriptionSi: 'දේශගුණ පාලනය, වෘත්තීය ආලෝකකරණය සහ ශබ්ද පද්ධතිය සහිත බහුකාර්ය ගෘහස්ථ ක්‍රීඩාංගනය. පැසිපන්දු, වොලිබෝල්, බැඩ්මින්ටන් සහ ගෘහස්ථ සිදුවීම් සඳහා සුදුසුය.',
    descriptionTa: 'காலநிலை கட்டுப்பாடு, தொழில்முறை விளக்குகள் மற்றும் ஒலி அமைப்புடன் பல்நோக்கு உட்புற அரங்கம். கூடைப்பந்து, கைப்பந்து, பேட்மிண்டன் மற்றும் உட்புற நிகழ்வுகளுக்கு ஏற்றது.',
    image: 'indoor basketball court arena',
    sports: ['Chess', 'Carrom', 'Ludo', 'Snakes and Ladders', 'Scrabble', 'Table Tennis', 'Playing Cards', 'Darts', 'Billiards', 'Pool', 'Foosball', 'Video Games', 'Board Games', 'Dominoes', 'Puzzle Games', 'Basketball', 'Volleyball', 'Badminton', 'Futsal', 'Handball'],
    pricingData: {
      competition: [
        {
          no: 1, event: 'Indoor Tournament', eventSi: 'ගෘහස්ථ තරඟාවලිය', eventTa: 'உட்புற போட்டி',
          sports: 'Basketball, Volleyball, Badminton, Futsal, Handball', sportsSi: 'පැසිපන්දු, වොලිබෝල්, බැඩ්මින්ටන්, ෆුට්සල්, හෑන්ඩ්බෝල්', sportsTa: 'கூடைப்பந்து, கைப்பந்து, பேட்மிண்டன், ஃபுட்சால், ஹேண்ட்பால்',
          duration: 'Per hour', govtSchools: 1800, club: 2800, intlSchools: 2800, international: 5000
        },
        {
          no: 2, event: 'Table Games Tournament', eventSi: 'මේස ක්‍රීඩා තරඟාවලිය', eventTa: 'டேபிள் விளையாட்டு போட்டி',
          sports: 'Chess, Carrom, Table Tennis', sportsSi: 'චෙස්, කැරම්, මේස පන්දු', sportsTa: 'செஸ், கேரம், டேபிள் டென்னிஸ்',
          duration: 'Per hour', govtSchools: 1000, club: 1500, intlSchools: 1500, international: 2500
        }
      ],
      practices: [
        {
          no: 1, event: 'Full Court Practice', eventSi: 'සම්පූර්ණ පිටිය පුහුණු', eventTa: 'முழு மைதான பயிற்சி',
          sports: 'Basketball, Volleyball, Badminton, Futsal', sportsSi: 'පැසිපන්දු, වොලිබෝල්, බැඩ්මින්ටන්, ෆුට්සල්', sportsTa: 'கூடைப்பந்து, கைப்பந்து, பேட்மிண்டன், ஃபுட்சால்',
          duration: 'Per hour', govtSchools: 1400, club: 2200, intlSchools: 2200, international: 4000
        },
        {
          no: 2, event: 'Half Court Practice', eventSi: 'අර්ධ පිටිය පුහුණු', eventTa: 'அரை மைதான பயிற்சி',
          sports: 'Basketball, Badminton', sportsSi: 'පැසිපන්දු, බැඩ්මින්ටන්', sportsTa: 'கூடைப்பந்து, பேட்மிண்டன்',
          duration: 'Per hour', govtSchools: 800, club: 1200, intlSchools: 1200, international: 2000
        }
      ],
      refundableDeposits: [
        { no: 1, customerType: 'Government Schools', customerTypeSi: 'රජයේ පාසල්', customerTypeTa: 'அரசுப் பள்ளிகள்', duration: 'Per hour', deposit: 15000 },
        { no: 2, customerType: 'Club/Institute', customerTypeSi: 'සමාජය/ආයතනය', customerTypeTa: 'கிளப்/நிறுவனம்', duration: 'Per hour', deposit: 25000 },
        { no: 3, customerType: 'International Schools', customerTypeSi: 'ජාත්‍යන්තර පාසල්', customerTypeTa: 'சர்வதேச பள்ளிகள்', duration: 'Per hour', deposit: 25000 },
        { no: 4, customerType: 'International', customerTypeSi: 'ජාත්‍යන්තර', customerTypeTa: 'சர்வதேசம்', duration: 'Per hour', deposit: 35000 }
      ]
    }
  },
  {
    id: 'basketball-court',
    name: 'Basketball Court',
    nameSi: 'පැසිපන්දු පිටිය',
    nameTa: 'கூடைப்பந்து மைதானம்',
    slug: 'basketball-court',
    description: 'Professional outdoor basketball court with high-traction surface and adjustable hoops. Perfect for matches and individual practice.',
    descriptionSi: 'ඉහළ ආකර්ෂණීය මතුපිටක් සහ සකස් කළ හැකි වළලු සහිත වෘත්තීය එළිමහන් පැසිපන්දු පිටිය. තරඟ සහ පුද්ගලික පුහුණුව සඳහා පරිපූර්ණයි.',
    descriptionTa: 'அதிக இழுவை மேற்பரப்பு மற்றும் சரிசெய்யக்கூடிய வளையங்களுடன் தொழில்முறை வெளிப்புற கூடைப்பந்து மைதானம். போட்டிகள் மற்றும் தனிப்பட்ட பயிற்சிக்காக சரியானது.',
    image: 'basketball court outdoor hoops',
    sports: ['Basketball', '3x3 Basketball'],
    pricingData: {
      competition: [
        {
          no: 1, event: 'Basketball Tournament', eventSi: 'පැසිපන්දු තරඟාවලිය', eventTa: 'கூடைப்பந்து போட்டி',
          sports: 'Basketball, 3x3 Basketball', sportsSi: 'පැසිපන්දු, 3x3 පැසිපන්දු', sportsTa: 'கூடைப்பந்து, 3x3 கூடைப்பந்து',
          duration: 'Per hour', govtSchools: 800, club: 1200, intlSchools: 1200, international: 2500
        }
      ],
      practices: [
        {
          no: 1, event: 'Full Court Practice', eventSi: 'සම්පූර්ණ පිටිය පුහුණු', eventTa: 'முழு மைதான பயிற்சி',
          sports: 'Basketball, 3x3 Basketball', sportsSi: 'පැසිපන්දු, 3x3 පැසිපන්දු', sportsTa: 'கூடைப்பந்து, 3x3 கூடைப்பந்து',
          duration: 'Per hour', govtSchools: 600, club: 1000, intlSchools: 1000, international: 2000
        },
        {
          no: 2, event: 'Half Court Practice', eventSi: 'අර්ධ පිටිය පුහුණු', eventTa: 'அரை மைதான பயிற்சி',
          sports: 'Basketball', sportsSi: 'පැසිපන්දු', sportsTa: 'கூடைப்பந்து',
          duration: 'Per hour', govtSchools: 400, club: 650, intlSchools: 650, international: 1200
        }
      ],
      refundableDeposits: [
        { no: 1, customerType: 'Government Schools', customerTypeSi: 'රජයේ පාසල්', customerTypeTa: 'அரசுப் பள்ளிகள்', duration: 'Per hour', deposit: 5000 },
        { no: 2, customerType: 'Club/Institute', customerTypeSi: 'සමාජය/ආයතනය', customerTypeTa: 'கிளப்/நிறுவனம்', duration: 'Per hour', deposit: 8000 },
        { no: 3, customerType: 'International Schools', customerTypeSi: 'ජාත්‍යන්තර පාසල්', customerTypeTa: 'சர்வதேச பள்ளிகள்', duration: 'Per hour', deposit: 8000 },
        { no: 4, customerType: 'International', customerTypeSi: 'ජාත්‍යන්තර', customerTypeTa: 'சர்வதேசம்', duration: 'Per hour', deposit: 12000 }
      ]
    }
  },
  {
    id: 'dormitory',
    name: 'Dormitory',
    nameSi: 'නේවාසිකාගාරය',
    nameTa: 'விடுதி',
    slug: 'dormitory',
    description: 'Comfortable accommodation facilities for athletes and teams. Features modern amenities, dining hall, and recreational areas. Capacity for 100+ guests.',
    descriptionSi: 'ක්‍රීඩක ක්‍රීඩිකාවන් සහ කණ්ඩායම් සඳහා සුවපහසු නවාතැන් පහසුකම්. නවීන පහසුකම්, භෝජන ශාලාව සහ විනෝදාත්මක ප්‍රදේශ ඇතුළත් වේ. අමුත්තන් 100+ සඳහා ධාරිතාව.',
    descriptionTa: 'விளையாட்டு வீரர்கள் மற்றும் அணிகளுக்கான வசதியான தங்குமிட வசதிகள். நவீன வசதிகள், சாப்பாட்டு அரங்கம் மற்றும் பொழுதுபோக்கு பகுதிகளுடன். 100+ விருந்தினர்களுக்கான திறன்.',
    image: 'dormitory accommodation rooms',
    sports: [],
    pricingData: {
      competition: [],
      practices: [
        {
          no: 1, event: 'Per Person Per Night', eventSi: 'පුද්ගලයෙකුට රාත්‍රියකට', eventTa: 'ஒரு நபருக்கு ஒரு இரவு',
          sports: 'Accommodation', sportsSi: 'නවාතැන්', sportsTa: 'தங்குமிடம்',
          duration: 'Per night', govtSchools: 500, club: 800, intlSchools: 800, international: 1500
        },
        {
          no: 2, event: 'Full Board (with meals)', eventSi: 'සම්පූර්ණ මණ්ඩලය (ආහාර සමඟ)', eventTa: 'முழு போர்டு (உணவுடன்)',
          sports: 'Accommodation + Meals', sportsSi: 'නවාතැන් + ආහාර', sportsTa: 'தங்குமிடம் + உணவு',
          duration: 'Per night', govtSchools: 1200, club: 1800, intlSchools: 1800, international: 3000
        }
      ],
      refundableDeposits: [
        { no: 1, customerType: 'Government Schools', customerTypeSi: 'රජයේ පාසල්', customerTypeTa: 'அரசுப் பள்ளிகள்', duration: 'Per night', deposit: 5000 },
        { no: 2, customerType: 'Club/Institute', customerTypeSi: 'සමාජය/ආයතනය', customerTypeTa: 'கிளப்/நிறுவனம்', duration: 'Per night', deposit: 10000 },
        { no: 3, customerType: 'International Schools', customerTypeSi: 'ජාත්‍යන්තර පාසල්', customerTypeTa: 'சர்வதேச பள்ளிகள்', duration: 'Per night', deposit: 10000 },
        { no: 4, customerType: 'International', customerTypeSi: 'ජාත්‍යන්තර', customerTypeTa: 'சர்வதேசம்', duration: 'Per night', deposit: 20000 }
      ]
    }
  },
  {
    id: 'conference-hall',
    name: 'Conference Hall',
    nameSi: 'සම්මන්ත්‍රණ ශාලාව',
    nameTa: 'மாநாட்டு அரங்கம்',
    slug: 'conference-hall',
    description: 'Modern conference facility with audio-visual equipment, Wi-Fi, and seating for 200. Perfect for seminars, workshops, and sports conferences.',
    descriptionSi: 'ශ්‍රව්‍ය-දෘශ්‍ය උපකරණ, Wi-Fi සහ 200 සඳහා ආසන සහිත නවීන සම්මන්ත්‍රණ පහසුකම. සම්මන්ත්‍රණ, වැඩමුළු සහ ක්‍රීඩා සම්මන්ත්‍රණ සඳහා පරිපූර්ණයි.',
    descriptionTa: 'ஆடியோ-விஷுவல் உபகரணங்கள், Wi-Fi மற்றும் 200 பேருக்கான இருக்கைகளுடன் நவீன மாநாட்டு வசதி. கருத்தரங்குகள், பட்டறைகள் மற்றும் விளையாட்டு மாநாடுகளுக்கு சரியானது.',
    image: 'modern conference hall auditorium',
    sports: [],
    pricingData: {
      competition: [
        {
          no: 1, event: 'Conference / Seminar', eventSi: 'සම්මන්ත්‍රණය / සම්මන්ත්‍රණය', eventTa: 'மாநாடு / கருத்தரங்கு',
          sports: 'Conference, Seminar, Workshop', sportsSi: 'සම්මන්ත්‍රණය, වැඩමුළුව', sportsTa: 'மாநாடு, பயிலரங்கம்',
          duration: 'Half Day (4h)', govtSchools: 5000, club: 8000, intlSchools: 8000, international: 15000
        },
        {
          no: 2, event: 'Full Day Event', eventSi: 'සම්පූර්ණ දිනය', eventTa: 'முழு நாள் நிகழ்வு',
          sports: 'Conference, Seminar, Workshop', sportsSi: 'සම්මන්ත්‍රණය, වැඩමුළුව', sportsTa: 'மாநாடு, பயிலரங்கம்',
          duration: 'Full Day (8h)', govtSchools: 8000, club: 12000, intlSchools: 12000, international: 25000
        }
      ],
      practices: [],
      refundableDeposits: [
        { no: 1, customerType: 'Government Schools', customerTypeSi: 'රජයේ පාසල්', customerTypeTa: 'அரசுப் பள்ளிகள்', duration: 'Per event', deposit: 10000 },
        { no: 2, customerType: 'Club/Institute', customerTypeSi: 'සමාජය/ආයතනය', customerTypeTa: 'கிளப்/நிறுவனம்', duration: 'Per event', deposit: 15000 },
        { no: 3, customerType: 'International Schools', customerTypeSi: 'ජාත්‍යන්තර පාසල්', customerTypeTa: 'சர்வதேச பள்ளிகள்', duration: 'Per event', deposit: 15000 },
        { no: 4, customerType: 'International', customerTypeSi: 'ජාත්‍යන්තර', customerTypeTa: 'சர்வதேசம்', duration: 'Per event', deposit: 25000 }
      ]
    }
  },
  {
    id: 'vehicle-parking',
    name: 'Vehicle Parking',
    nameSi: 'වාහන නැවැත්වීම',
    nameTa: 'வாகன நிறுத்துமிடம்',
    slug: 'vehicle-parking',
    description: 'Secure parking facility with capacity for 500+ vehicles. Separate areas for buses, cars, and motorcycles. 24/7 security and CCTV surveillance.',
    descriptionSi: 'වාහන 500+ සඳහා ධාරිතාව සහිත ආරක්ෂිත වාහන නැවැත්වීමේ පහසුකම. බස්, කාර් සහ යතුරුපැදි සඳහා වෙනම ප්‍රදේශ. 24/7 ආරක්ෂාව සහ CCTV නිරීක්ෂණය.',
    descriptionTa: '500+ வாகனங்களுக்கான திறன் கொண்ட பாதுகாப்பான வாகன நிறுத்துமிடம். பேருந்துகள், கார்கள் மற்றும் மோட்டார் சைக்கிள்களுக்கான தனி பகுதிகள். 24/7 பாதுகாப்பு மற்றும் CCTV கண்காணிப்பு.',
    image: 'parking lot facility outdoor',
    sports: [],
    pricingData: {
      competition: [],
      practices: [
        {
          no: 1, event: 'Car', eventSi: 'කාර්', eventTa: 'கார்',
          sports: 'Parking', sportsSi: 'නැවැත්වීම', sportsTa: 'நிறுத்துதல்',
          duration: 'Per day', govtSchools: 200, club: 300, intlSchools: 300, international: 500
        },
        {
          no: 2, event: 'Bus/Van', eventSi: 'බස්/වෑන්', eventTa: 'பேருந்து/வேன்',
          sports: 'Parking', sportsSi: 'නැවැත්වීම', sportsTa: 'நிறுத்துதல்',
          duration: 'Per day', govtSchools: 500, club: 800, intlSchools: 800, international: 1200
        },
        {
          no: 3, event: 'Motorcycle', eventSi: 'යතුරුපැදිය', eventTa: 'மோட்டார் சைக்கிள்',
          sports: 'Parking', sportsSi: 'නැවැත්වීම', sportsTa: 'நிறுத்துதல்',
          duration: 'Per day', govtSchools: 100, club: 150, intlSchools: 150, international: 250
        }
      ],
      refundableDeposits: []
    }
  }
];

export interface FacilityLocation {
  id: string; // unique id for the location entry
  facilityId: string; // matches facility.id
  district: string; // e.g. 'vavuniya', 'killinochi'
  name?: string; // optional site name
  address: string;
  phone?: string;
  hours?: string;
  email?: string;
  sports?: string[];
  pricing?: PricingTier[];
  deposit?: DepositInfo[];
}

export const facilityLocations: FacilityLocation[] = [
  // Indoor Stadium locations
  {
    id: 'indoor-vavuniya-1',
    facilityId: 'indoor-stadium',
    district: 'vavuniya',
    name: 'Vavuniya Indoor Arena',
    address: 'No. 12, Main St, Vavuniya',
    phone: '+94 24 222 000',
    email: 'info@vavuniya-sports.lk',
    hours: 'Mon–Fri 08:00–18:00',
    sports: ['Chess', 'Carrom', 'Ludo', 'Snakes and Ladders', 'Scrabble', 'Table Tennis', 'Playing Cards', 'Darts', 'Billiards', 'Pool', 'Foosball', 'Video Games', 'Board Games', 'Dominoes', 'Puzzle Games', 'Basketball', 'Volleyball', 'Badminton', 'Futsal'],
    pricing: [
      {
        category: 'Full Court (per hour)',
        categorySi: 'සම්පූර්ණ පිටිය (පැයකට)',
        categoryTa: 'முழு மைதானம் (மணிக்கு)',
        govtSchools: 1600,
        club: 2600,
        intlSchools: 2600,
        international: 4800,
      },
      {
        category: 'Half Court (per hour)',
        categorySi: 'අර්ධ පිටිය (පැයකට)',
        categoryTa: 'அரை மைதானம் (மணிக்கு)',
        govtSchools: 900,
        club: 1400,
        intlSchools: 1400,
        international: 2200,
      }
    ],
    deposit: [
      { customerType: 'Government Schools', amount: 12000 },
      { customerType: 'Club/Institute', amount: 22000 },
    ],
  },
  {
    id: 'indoor-kilinochchi-1',
    facilityId: 'indoor-stadium',
    district: 'killinochi',
    name: 'Kilinochchi Indoor Hall',
    address: '5 Stadium Road, Kilinochchi',
    phone: '+94 21 333 444',
    email: 'info@kilinochchi-sports.lk',
    hours: 'Mon–Sat 09:00–17:00',
    sports: ['Chess', 'Carrom', 'Ludo', 'Snakes and Ladders', 'Scrabble', 'Table Tennis', 'Playing Cards', 'Darts', 'Billiards', 'Pool', 'Foosball', 'Video Games', 'Board Games', 'Dominoes', 'Puzzle Games', 'Basketball', 'Badminton', 'Volleyball', 'Futsal'],
    pricing: [
      {
        category: 'Full Court (per hour)',
        categorySi: 'සම්පූර්ණ පිටිය (පැයකට)',
        categoryTa: 'முழு மைதானம் (மணிக்கு)',
        govtSchools: 1700,
        club: 2700,
        intlSchools: 2700,
        international: 4900,
      },
      {
        category: 'Half Court (per hour)',
        categorySi: 'අර්ධ පිටිය (පැයකට)',
        categoryTa: 'அரை மைதானம் (மணிக்கு)',
        govtSchools: 950,
        club: 1500,
        intlSchools: 1500,
        international: 2400,
      }
    ],
    deposit: [
      { customerType: 'Government Schools', amount: 15000 },
      { customerType: 'Club/Institute', amount: 25000 },
    ],
  },

  // Outdoor Stadium locations
  {
    id: 'outdoor-vavuniya-1',
    facilityId: 'outdoor-stadium',
    district: 'vavuniya',
    name: 'Vavuniya Outdoor Stadium',
    address: 'Vavuniya Sports Complex, Vavuniya',
    phone: '+94 24 555 666',
    email: 'outdoor@vavuniya-sports.lk',
    hours: '07:00–20:00',
    sports: ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Kabbadi', 'Hockey', 'Rugby', 'Tennis', 'Badminton', 'Baseball', 'Softball', 'Athletics', 'Cycling', 'Swimming', 'Running', 'Long Jump', 'High Jump', 'Kho Kho', 'Elle', 'NetBall'],
  },
  {
    id: 'outdoor-kilinochchi-1',
    facilityId: 'outdoor-stadium',
    district: 'killinochi',
    name: 'Kilinochchi Field',
    address: 'Kilinochchi Central Ground',
    phone: '+94 21 777 888',
    email: 'outdoor@kilinochchi-sports.lk',
    hours: '06:00–19:00',
    sports: ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Kabbadi', 'Hockey', 'Rugby', 'Tennis', 'Badminton', 'Baseball', 'Softball', 'Athletics', 'Cycling', 'Swimming', 'Running', 'Long Jump', 'High Jump', 'Kho Kho', 'Elle', 'NetBall'],
  },

  // Swimming Pool locations
  {
    id: 'swim-vavuniya-1',
    facilityId: 'swimming-pool',
    district: 'vavuniya',
    name: 'Vavuniya Aquatics Centre',
    address: 'Pool Lane 3, Vavuniya',
    phone: '+94 24 999 000',
    email: 'aquatics@vavuniya-sports.lk',
    hours: '06:00–20:00',
    sports: ['Swimming', 'Diving', 'Water Polo'],
  },
  {
    id: 'swim-kilinochchi-1',
    facilityId: 'swimming-pool',
    district: 'killinochi',
    name: 'Kilinochchi Swim Hall',
    address: '12 Ocean Rd, Kilinochchi',
    phone: '+94 21 101 202',
    email: 'aquatics@kilinochchi-sports.lk',
    hours: '08:00–18:00',
    sports: ['Swimming', 'Diving', 'Water Polo'],
  },

  // Basketball Court (example)
  {
    id: 'basket-vavuniya-1',
    facilityId: 'basketball-court',
    district: 'vavuniya',
    name: 'Vavuniya Basketball Court',
    address: 'Court 2, Vavuniya Sports Park',
    phone: '+94 24 121 212',
    email: 'court@vavuniya-sports.lk',
    hours: '08:00–22:00',
    sports: ['Basketball', '3x3 Basketball'],
  },
  {
    id: 'basket-kilinochchi-1',
    facilityId: 'basketball-court',
    district: 'killinochi',
    name: 'Kilinochchi Hoop Ground',
    address: 'Kilinochchi Town, Hoop Street',
    phone: '+94 21 131 313',
    email: 'court@kilinochchi-sports.lk',
    hours: '09:00–20:00',
    sports: ['Basketball', '3x3 Basketball'],
  }
  ,
  // Fitness Center
  {
    id: 'fitness-vavuniya-1',
    facilityId: 'fitness-center',
    district: 'vavuniya',
    name: 'Vavuniya Fitness Centre',
    address: 'Wellness Rd, Vavuniya',
    phone: '+94 24 202 202',
    email: 'fitness@vavuniya-sports.lk',
    hours: '06:00–22:00',
    sports: ['Gym', 'Strength Training', 'Cardio'],
  },
  {
    id: 'fitness-kilinochchi-1',
    facilityId: 'fitness-center',
    district: 'killinochi',
    name: 'Kilinochchi Fitness Hub',
    address: 'Health Park, Kilinochchi',
    phone: '+94 21 202 303',
    email: 'fitness@kilinochchi-sports.lk',
    hours: '06:00–21:00',
    sports: ['Gym', 'Group Classes'],
  },

  // Dormitory
  {
    id: 'dorm-vavuniya-1',
    facilityId: 'dormitory',
    district: 'vavuniya',
    name: 'Vavuniya Dormitory',
    address: 'Residence Lane, Vavuniya',
    phone: '+94 24 303 303',
    email: 'dorm@vavuniya-sports.lk',
    hours: '24/7',
  },
  {
    id: 'dorm-kilinochchi-1',
    facilityId: 'dormitory',
    district: 'killinochi',
    name: 'Kilinochchi Athletes Dorm',
    address: 'Housing Rd, Kilinochchi',
    phone: '+94 21 303 404',
    email: 'dorm@kilinochchi-sports.lk',
    hours: '24/7',
  },

  // Conference Hall
  {
    id: 'conf-vavuniya-1',
    facilityId: 'conference-hall',
    district: 'vavuniya',
    name: 'Vavuniya Conference Hall',
    address: 'Conference Ave, Vavuniya',
    phone: '+94 24 404 404',
    email: 'conf@vavuniya-sports.lk',
    hours: '08:00–18:00',
  },
  {
    id: 'conf-kilinochchi-1',
    facilityId: 'conference-hall',
    district: 'killinochi',
    name: 'Kilinochchi Conference Centre',
    address: 'Seminar Rd, Kilinochchi',
    phone: '+94 21 404 505',
    email: 'conf@kilinochchi-sports.lk',
    hours: '08:00–17:00',
  },

  // Vehicle Parking
  {
    id: 'park-vavuniya-1',
    facilityId: 'vehicle-parking',
    district: 'vavuniya',
    name: 'Vavuniya Parking Lot',
    address: 'Parking Rd, Vavuniya',
    phone: '+94 24 505 505',
    email: 'parking@vavuniya-sports.lk',
    hours: '24/7',
  },
  {
    id: 'park-kilinochchi-1',
    facilityId: 'vehicle-parking',
    district: 'killinochi',
    name: 'Kilinochchi Parking Area',
    address: 'Main Parking, Kilinochchi',
    phone: '+94 21 505 606',
    email: 'parking@kilinochchi-sports.lk',
    hours: '24/7',
  }
];

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'National Athletics Championship 2024',
    titleSi: 'ජාතික මලල ක්‍රීඩා ශූරතාවලිය 2024',
    titleTa: 'தேசிய தடகள சாம்பியன்ஷிப் 2024',
    excerpt: 'The complex will host the National Athletics Championship from March 15-17, 2024. Over 500 athletes expected to participate.',
    excerptSi: '2024 මාර්තු 15-17 දක්වා ජාතික මලල ක්‍රීඩා ශූරතාවලිය සංකීර්ණයේ පවත්වනු ලැබේ. ක්‍රීඩක ක්‍රීඩිකාවන් 500කට වැඩි පිරිසක් සහභාගී වනු ඇතැයි අපේක්ෂා කෙරේ.',
    excerptTa: '2024 மார்ச் 15-17 வரை தேசிய தடகள சாம்பியன்ஷிப்பை வளாகம் நடத்தும். 500க்கும் மேற்பட்ட விளையாட்டு வீரர்கள் பங்கேற்பார்கள் எனஎதிர்பார்க்கப்படுகிறது.',
    date: '2024-02-15',
    image: 'athletics track competition'
  },
  {
    id: '2',
    title: 'New Swimming Pool Opens',
    titleSi: 'නව පිහිනුම් තටාකය විවෘත විය',
    titleTa: 'புதிய நீச்சல் குளம் திறக்கப்பட்டது',
    excerpt: 'Our newly renovated Olympic-sized swimming pool is now open for bookings. Features include heated water and professional timing systems.',
    excerptSi: 'අපගේ අලුතින් ප්‍රතිසංස්කරණය කළ ඔලිම්පික් ප්‍රමාණයේ පිහිනුම් තටාකය දැන් වෙන්කිරීම් සඳහා විවෘතයි. විශේෂාංගවලට රත් කළ ජලය සහ වෘත්තීය කාල ගණන පද්ධති ඇතුළත් වේ.',
    excerptTa: 'எங்கள் புதிதாக புதுப்பிக்கப்பட்ட ஒலிம்பிக் அளவு நீச்சல் குளம் இப்போது முன்பதிவுகளுக்கு திறக்கப்பட்டுள்ளது. சூடான நீர் மற்றும் தொழில்முறை நேர அமைப்புகள் அம்சங்களில் அடங்கும்.',
    date: '2024-02-10',
    image: 'swimming pool opening ceremony'
  },
  {
    id: '3',
    title: 'Inter-School Football Tournament',
    titleSi: 'අන්තර් පාසල් පාපන්දු තරඟාවලිය',
    titleTa: 'பள்ளிகளுக்கிடையேயான கால்பந்து போட்டி',
    excerpt: 'Registration now open for the annual Inter-School Football Tournament. Special rates for government schools.',
    excerptSi: 'වාර්ෂික අන්තර් පාසල් පාපන්දු තරඟාවලිය සඳහා ලියාපදිංචිය දැන් විවෘතය. රජයේ පාසල් සඳහා විශේෂ අනුපාත.',
    excerptTa: 'வருடாந்திர பள்ளிகளுக்கிடையேயான கால்பந்து போட்டிக்கான பதிவு இப்போது திறக்கப்பட்டுள்ளது. அரசு பள்ளிகளுக்கு சிறப்பு விலைகள்.',
    date: '2024-02-05',
    image: 'football tournament youth'
  },
  {
    id: '4',
    title: 'Fitness Center Upgrade Complete',
    titleSi: 'යෝග්‍යතා මධ්‍යස්ථානය උත්ශ්‍රේණි කිරීම සම්පූර්ණයි',
    titleTa: 'உடற்பயிற்சி மைய மேம்படுத்தல் முடிந்தது',
    excerpt: 'Our fitness center has been upgraded with new equipment including treadmills, ellipticals, and strength training machines.',
    excerptSi: 'අපගේ යෝග්‍යතා මධ්‍යස්ථානය ට්‍රෙඩ්මිල්, ඉලිප්ටිකල් සහ ශක්ති පුහුණු යන්ත්‍ර ඇතුළු නව උපකරණ සමඟ උත්ශ්‍රේණි කර ඇත.',
    excerptTa: 'எங்கள் உடற்பயிற்சி மையம் டிரெட்மில்கள், எலிப்டிகல்ஸ் மற்றும் வலிமை பயிற்சி இயந்திரங்கள் உட்பட புதிய உபகரணங்களுடன் மேம்படுத்தப்பட்டுள்ளது.',
    date: '2024-01-28',
    image: 'gym equipment modern'
  }
];

// Generate mock booking slots for the next 30 days
export const generateBookingSlots = (): BookingSlot[] => {
  const slots: BookingSlot[] = [];
  const startDate = new Date('2024-02-27');
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

  for (let day = 0; day < 30; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    const dateStr = currentDate.toISOString().split('T')[0];

    facilities.forEach(facility => {
      timeSlots.forEach((startTime, index) => {
        const endTime = timeSlots[index + 1] || '20:00';
        const randomBooked = Math.random() > 0.7; // 30% chance of being booked

        slots.push({
          id: `${facility.id}-${dateStr}-${startTime}`,
          facilityId: facility.id,
          date: dateStr,
          startTime,
          endTime,
          status: randomBooked ? 'booked' : 'available',
          bookedBy: randomBooked ? 'Sample Organization' : undefined
        });
      });
    });
  }

  return slots;
};

export const bookingSlots = generateBookingSlots();
