const images = [
  'https://images.craigslist.org/00e0e_2H8HNBNNC1K_600x450.jpg',
  'https://images.craigslist.org/01616_igIxaMBzbvJ_600x450.jpg',
  'https://images.craigslist.org/01515_2KIZAYf9TTH_600x450.jpg',
  'https://images.craigslist.org/00909_eo1gIKPVWbv_600x450.jpg',
  'https://images.craigslist.org/00u0u_80PIH8mziND_600x450.jpg',
  'https://images.craigslist.org/00g0g_gj1N1aJk6XZ_600x450.jpg',
  'https://images.craigslist.org/00U0U_e4mVmiNykxp_600x450.jpg',
  'https://images.craigslist.org/00x0x_i9XLb7yywZl_600x450.jpg',
  'https://images.craigslist.org/00y0y_9n8HZG5xNUl_600x450.jpg',
  'https://images.craigslist.org/00k0k_kqXUJaYHGtO_600x450.jpg',
  'https://images.craigslist.org/00r0r_gA1lWnTX1ga_600x450.jpg',
  'https://images.craigslist.org/00U0U_6E58xrCnGOp_600x450.jpg',
  'https://images.craigslist.org/00X0X_42PizLHsUOP_600x450.jpg',
];

const calculateHash = require('./hash');

module.exports = {
  listings: [...Array(50)].map((o, i)=> ({
    title: 'Nice House '+i,
    description: 'look at this house yo '+i,
    price: 1000 + Math.floor( Math.random()*500*i ),
    images: [
      images[ Math.floor( Math.random()*images.length ) ],
      images[ Math.floor( Math.random()*images.length ) ],
    ],
    author: (i % 4) + 1,
  }) ),

  users: [
    { email: 'nik@nik.nik', passwordHash: calculateHash('guest') },
    { email: 'avi@nik.nik', passwordHash: calculateHash('guest') },
    { email: 'dave@nik.nik', passwordHash: calculateHash('guest') },
    { email: 'raph@nik.nik', passwordHash: calculateHash('guest') },
  ],
};
