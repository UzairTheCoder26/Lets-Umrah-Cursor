export interface UmrahPackage {
  id: string;
  title: string;
  duration: string;
  price: number;
  originalPrice: number;
  image: string;
  hotelMakkah: string;
  hotelMadinah: string;
  distanceMakkah: string;
  distanceMadinah: string;
  directFlight: boolean;
  fiveStar: boolean;
  mealsIncluded: boolean;
  visaIncluded: boolean;
  featured: boolean;
  seatsLeft: number;
  rating: number;
  itinerary: { day: number; title: string; description: string }[];
  included: string[];
  notIncluded: string[];
  cancellationPolicy: string;
  refundPolicy: string;
  faqs: { question: string; answer: string }[];
}

export const samplePackages: UmrahPackage[] = [
  {
    id: "premium-umrah-14",
    title: "Premium Umrah Experience",
    duration: "14 Days / 13 Nights",
    price: 185000,
    originalPrice: 225000,
    image: "makkah",
    hotelMakkah: "Hilton Suites Makkah",
    hotelMadinah: "Oberoi Madinah",
    distanceMakkah: "200m from Haram",
    distanceMadinah: "150m from Masjid Nabawi",
    directFlight: true,
    fiveStar: true,
    mealsIncluded: true,
    visaIncluded: true,
    featured: true,
    seatsLeft: 8,
    rating: 4.9,
    itinerary: [
      { day: 1, title: "Departure & Arrival in Madinah", description: "Depart from your city. Arrive at Madinah airport. Private transfer to hotel. Rest and freshen up." },
      { day: 2, title: "Masjid Nabawi & Rawdah", description: "Visit Masjid Nabawi. Pray in Rawdah Sharif. Explore the Prophet's Mosque." },
      { day: 3, title: "Madinah Ziyarat", description: "Visit Uhud, Quba Mosque, Qiblatain Mosque, and other historical sites." },
      { day: 4, title: "Free Day in Madinah", description: "Personal prayers and exploration of Madinah." },
      { day: 5, title: "Travel to Makkah", description: "Private transport to Makkah. Hotel check-in. Evening Umrah." },
      { day: 6, title: "Umrah Completion", description: "Complete Umrah rituals with guided assistance. Tawaf and Sa'i." },
      { day: 7, title: "Makkah Exploration", description: "Visit historical sites in Makkah. Jabal al-Nour, Cave of Hira." },
      { day: 8, title: "Free Day", description: "Personal ibadah and prayers at Masjid al-Haram." },
      { day: 9, title: "Makkah Ziyarat", description: "Visit Mina, Arafat, and Muzdalifah." },
      { day: 10, title: "Shopping & Leisure", description: "Visit local markets. Shopping for souvenirs and gifts." },
      { day: 11, title: "Free Day", description: "Personal prayers and rest." },
      { day: 12, title: "Free Day", description: "Continue ibadah at Masjid al-Haram." },
      { day: 13, title: "Farewell Tawaf", description: "Perform farewell Tawaf. Prepare for departure." },
      { day: 14, title: "Return", description: "Transfer to airport. Return flight home." },
    ],
    included: ["Return flights", "5-star hotel accommodation", "Daily breakfast & dinner", "Private airport transfers", "Umrah visa processing", "Guided Ziyarat tours", "24/7 support", "Travel insurance"],
    notIncluded: ["Personal expenses", "Lunch", "Laundry services", "Tips and gratuities", "Extra baggage charges"],
    cancellationPolicy: "Free cancellation up to 30 days before departure. 50% refund for cancellations 15-29 days before. No refund within 14 days of departure.",
    refundPolicy: "Refunds are processed within 7-10 business days to the original payment method.",
    faqs: [
      { question: "Is the visa included in the package?", answer: "Yes, Umrah visa processing is included in the package price." },
      { question: "What meals are provided?", answer: "Daily breakfast and dinner are included at the hotel." },
      { question: "Can I extend my stay?", answer: "Yes, extensions can be arranged at additional cost. Please contact us at least 7 days before your departure." },
    ],
  },
  {
    id: "economy-umrah-10",
    title: "Economy Umrah Package",
    duration: "10 Days / 9 Nights",
    price: 95000,
    originalPrice: 120000,
    image: "madinah",
    hotelMakkah: "Al Safwah Hotel",
    hotelMadinah: "Madinah Harmony",
    distanceMakkah: "500m from Haram",
    distanceMadinah: "400m from Masjid Nabawi",
    directFlight: false,
    fiveStar: false,
    mealsIncluded: true,
    visaIncluded: true,
    featured: true,
    seatsLeft: 15,
    rating: 4.5,
    itinerary: [
      { day: 1, title: "Departure", description: "Depart from your city to Madinah." },
      { day: 2, title: "Arrive Madinah", description: "Arrive and check-in. Visit Masjid Nabawi." },
      { day: 3, title: "Madinah Ziyarat", description: "Guided tour of historical sites." },
      { day: 4, title: "Travel to Makkah", description: "Bus transfer to Makkah. Evening Umrah." },
      { day: 5, title: "Umrah Day", description: "Complete Umrah rituals." },
      { day: 6, title: "Makkah Ziyarat", description: "Visit historical sites around Makkah." },
      { day: 7, title: "Free Day", description: "Personal ibadah." },
      { day: 8, title: "Free Day", description: "Prayers at Masjid al-Haram." },
      { day: 9, title: "Farewell Tawaf", description: "Perform farewell Tawaf." },
      { day: 10, title: "Return", description: "Transfer to airport. Return home." },
    ],
    included: ["Return flights", "4-star hotel", "Daily breakfast", "Airport transfers", "Umrah visa", "Guided tours", "24/7 support"],
    notIncluded: ["Personal expenses", "Lunch & dinner", "Travel insurance", "Extra baggage"],
    cancellationPolicy: "Free cancellation up to 21 days before departure. 50% charge within 21 days.",
    refundPolicy: "Refunds processed within 10 business days.",
    faqs: [
      { question: "Is it a group package?", answer: "Yes, this is a group package with up to 25 travelers." },
      { question: "Are meals included?", answer: "Daily breakfast is included. Other meals are at your expense." },
    ],
  },
  {
    id: "luxury-umrah-21",
    title: "Luxury Umrah Retreat",
    duration: "21 Days / 20 Nights",
    price: 350000,
    originalPrice: 420000,
    image: "premium",
    hotelMakkah: "Raffles Makkah Palace",
    hotelMadinah: "The Ritz-Carlton Madinah",
    distanceMakkah: "50m from Haram",
    distanceMadinah: "100m from Masjid Nabawi",
    directFlight: true,
    fiveStar: true,
    mealsIncluded: true,
    visaIncluded: true,
    featured: true,
    seatsLeft: 4,
    rating: 5.0,
    itinerary: [
      { day: 1, title: "VIP Departure", description: "Business class flight. VIP lounge access." },
      { day: 2, title: "Arrive Madinah", description: "Private luxury transfer. Suite check-in." },
      { day: 3, title: "Rawdah Visit", description: "Exclusive Rawdah visit arrangement." },
      { day: 4, title: "Madinah Ziyarat", description: "Private guided historical tour." },
      { day: 5, title: "Leisure Day", description: "Spa and relaxation. Evening prayers." },
      { day: 6, title: "Transfer to Makkah", description: "Luxury vehicle transfer." },
      { day: 7, title: "Umrah", description: "Guided Umrah with personal scholar." },
      { day: 8, title: "Makkah Heritage", description: "Premium heritage tour." },
      { day: 9, title: "Spiritual Day", description: "Full day ibadah at Haram." },
      { day: 10, title: "Rest Day", description: "Personal time and prayers." },
    ],
    included: ["Business class flights", "5-star suite accommodation", "All meals (buffet)", "Private luxury transfers", "VIP visa processing", "Personal guide", "Scholar sessions", "Full travel insurance", "Spa access", "24/7 concierge"],
    notIncluded: ["Personal shopping", "Gratuities"],
    cancellationPolicy: "Full refund up to 45 days before. 70% refund 30-44 days. 30% refund 15-29 days.",
    refundPolicy: "Priority refund processing within 5 business days.",
    faqs: [
      { question: "Is this a private package?", answer: "Yes, this is an exclusive private package with personalized service." },
      { question: "Can I customize the itinerary?", answer: "Absolutely. Our concierge team will work with you to personalize every detail." },
    ],
  },
];

export const testimonials = [
  { name: "Ahmed Khan", location: "Mumbai", rating: 5, text: "Let's Umrah made our family's spiritual journey absolutely seamless. The 5-star accommodation and guided Ziyarat exceeded all expectations.", avatar: "AK" },
  { name: "Fatima Begum", location: "Delhi", rating: 5, text: "From visa processing to hotel bookings, everything was handled with utmost care. I felt truly at peace throughout the journey.", avatar: "FB" },
  { name: "Mohammed Salim", location: "Hyderabad", rating: 5, text: "The premium package was worth every penny. The proximity to Haram and the quality of service was exceptional.", avatar: "MS" },
  { name: "Aisha Patel", location: "Ahmedabad", rating: 4, text: "Very professional team. They guided us through every step of the Umrah process. Highly recommended!", avatar: "AP" },
];

export const islamicQuotes = [
  { text: "And complete the Hajj and Umrah for Allah.", source: "Quran 2:196" },
  { text: "The performers of Hajj and Umrah are guests of Allah.", source: "Ibn Majah" },
  { text: "One Umrah to the next is an expiation for what comes in between them.", source: "Sahih Muslim" },
  { text: "O Allah, make it an accepted Hajj and forgive sins.", source: "Dua of Ibrahim (AS)" },
];

export const faqs = [
  { question: "How do I book an Umrah package?", answer: "Simply browse our packages, select one that suits your needs, and click 'Book Now'. Our team will guide you through the entire process." },
  { question: "What documents do I need?", answer: "You'll need a valid passport (with at least 6 months validity), passport-size photographs, vaccination certificates, and any additional documents as per visa requirements." },
  { question: "Is visa processing included?", answer: "Yes, most of our packages include Umrah visa processing. Please check the specific package details for confirmation." },
  { question: "Can I customize my package?", answer: "Yes, we offer customization options. Contact our team to discuss your specific requirements and preferences." },
  { question: "What is your cancellation policy?", answer: "Cancellation policies vary by package. Generally, free cancellation is available up to 30 days before departure. Please refer to the specific package terms." },
  { question: "Do you provide travel insurance?", answer: "Premium and luxury packages include comprehensive travel insurance. For economy packages, insurance can be added as an optional extra." },
];
