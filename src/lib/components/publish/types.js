/**
 * @typedef {Object} TicketCategory
 * @property {string} id
 * @property {string} name
 * @property {string} price
 * @property {string} quantity
 * @property {string} description
 */

/**
 * @typedef {Object} FormData
 * @property {string} title
 * @property {string} category
 * @property {string} categoryEmoji
 * @property {string} description
 * @property {string} language
 * @property {string} dateStart
 * @property {string} timeStart
 * @property {string} dateEnd
 * @property {string} timeEnd
 * @property {boolean} multiDay
 * @property {string} venue
 * @property {string} address
 * @property {string} city
 * @property {string} capacity
 * @property {boolean} isOnline
 * @property {string} onlineUrl
 * @property {string|null} coverImage
 * @property {string[]} gallery
 * @property {boolean} isFree
 * @property {TicketCategory[]} tickets
 * @property {string} saleStart
 * @property {string} saleEnd
 * @property {string[]} tags
 * @property {string} ageRestriction
 * @property {string} contactEmail
 * @property {string} website
 */

/**
 * @typedef {Object} StepDefinition
 * @property {number} id
 * @property {string} label
 * @property {string} sublabel
 * @property {any} icon
 */

/**
 * @typedef {Object} PreviewData
 * @property {string} title
 * @property {string} category
 * @property {string} categoryEmoji
 * @property {string} date
 * @property {string} location
 * @property {string} price
 * @property {string|null} image
 */

/** @type {FormData} */
export const INITIAL_FORM = {
  title: '',
  category: '',
  description: '',

  dateStart: '',
  timeStart: '',
  dateEnd: '',
  timeEnd: '',
  multiDay: false,
  venue: '',
  address: '',
  city: '',
  capacity: '',
  isOnline: false,
  onlineUrl: '',

  coverImage: null,
  gallery: [],

  isFree: false,
  tickets: [],
  saleStart: '',
  saleEnd: '',

  tags: [],
  ageRestriction: '',
  contactEmail: '',
  website: ''
};

export const beninCities = [
  "Banikoara",
  "Gogounou",
  "Kandi",
  "Karimama",
  "Malanville",
  "Ségbana",
  "Boukoumbé",
  "Cobly",
  "Kérou",
  "Kouandé",
  "Matéri",
  "Natitingou",
  "Péhunco",
  "Tanguiéta",
  "Toucountouna",
  "Abomey-Calavi",
  "Allada",
  "Kpomassè",
  "Ouidah",
  "Sô-Ava",
  "Toffo",
  "Tori-Bossito",
  "Zè",
  "Bembèrèkè",
  "Kalalé",
  "N'Dali",
  "Nikki",
  "Parakou",
  "Pèrèrè",
  "Sinendé",
  "Tchaourou",
  "Bantè",
  "Dassa-Zoumè",
  "Glazoué",
  "Ouèssè",
  "Savalou",
  "Savè",
  "Aplahoué",
  "Djakotomey",
  "Dogbo",
  "Klouékanmè",
  "Lalo",
  "Toviklin",
  "Bassila",
  "Copargo",
  "Djougou",
  "Ouaké",
  "Cotonou",
  "Athiémé",
  "Bopa",
  "Comè",
  "Grand-Popo",
  "Houéyogbé",
  "Lokossa",
  "Adjarra",
  "Adjohoun",
  "Aguégués",
  "Akpro-Missérété",
  "Avrankou",
  "Bonou",
  "Dangbo",
  "Porto-Novo",
  "Sèmè-Kpodji",
  "Adja-Ouèrè",
  "Ifangni",
  "Kétou",
  "Pobè",
  "Sakété",
  "Abomey",
  "Agbangnizoun",
  "Bohicon",
  "Covè",
  "Djidja",
  "Ouinhi",
  "Za-Kpota",
  "Zagnanado",
  "Zogbodomey"
];
