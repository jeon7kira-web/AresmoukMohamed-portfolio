/* Edit this file to update contact details, project dates and media.
   Add screenshots as: { src: 'images/project/home.png', alt: 'Homepage' }
   Use YYYY-MM for sortDate; projects are displayed newest first.
*/
window.PORTFOLIO = {
  contact: {
    email: '', // Add the confirmed email address here.
    linkedin: 'https://www.linkedin.com/in/mohamed-aresmouk-00057a311/'
  },
  projects: {
    portfolio: {
      title: 'Smox Portfolio',
      period: 'NOV 2026', sortDate: '2026-11', kind: 'PERSONAL PROJECT',
      description: 'My personal developer portfolio and online professional home. I designed and built it to present my projects, technical skills, education and ways to get in touch, while keeping the experience distinctive and responsive.',
      features: [
        'Custom SmoxArea visual identity and responsive layouts',
        'Interactive character animation with cursor-following eyes',
        'Dark and lavender themes with saved preference',
        'Project detail dialogs with screenshot galleries and optional demos',
        'Custom scrollbar, reading progress indicator and active navigation',
        'Dedicated sections for projects, skills, experience, education and contact'
      ],
      stack: ['HTML', 'CSS', 'JavaScript'],
      screenshots: [],
      live: '', repo: '', demo: '', demoUrl: '', poster: ''
    },
    vintage: {
      title: 'Vintage Clothing',
      period: 'NOV 2026', sortDate: '2026-11', kind: 'SMALL-BUSINESS PROJECT',
      description: 'An e-commerce website developed for a small clothing business taking its first steps online. It combines a browsable catalog with a simple WhatsApp ordering flow, helping customers move from discovering a piece to placing an order.',
      features: [
        'Product catalog with category management',
        'Wishlist and shopping cart',
        'WhatsApp-based ordering system',
        'Promotional discounts and special offers',
        'Django admin dashboard for managing products and content',
        'About Us section with an interactive map',
        'Responsive design and live deployment'
      ],
      stack: ['Python', 'Django', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript', 'SQLite'],
      screenshots: [
        { src: 'images/vintage/home.png', alt: 'Home page with the product catalog' },
        { src: 'images/vintage/store.png', alt: 'Category and product browsing' },
        { src: 'images/vintage/cart.png', alt: 'Cart with WhatsApp order button' },
        { src: 'images/vintage/form.png', alt: 'Order and customer details form' }
      ],
      live: 'https://smoxarea.pythonanywhere.com', repo: '', demo: '', demoUrl: '', poster: ''
    },
    dini: {
      title: 'Ana Wa Dîni',
      period: 'JUL 2026', sortDate: '2026-07', kind: 'ASSOCIATION PROJECT',
      description: 'A website for an association teaching Quran, Arabic and Islamic values, helping families discover programs and register their interest.',
      features: ['Programs, teachers and camp information.', 'Registration and contact forms.', 'Database-driven FAQ, gallery and testimonials.', 'Administration for content and site settings.'],
      stack: ['Python', 'Django', 'Tailwind CSS', 'SQLite'],
      screenshots: [
        { src: 'images/dini/home.png', alt: 'Ana Wa Dîni homepage' },
        { src: 'images/dini/contact.png', alt: 'Contact and registration section' },
        { src: 'images/dini/reviews.png', alt: 'Testimonials and reviews section' },
        { src: 'images/dini/tarifs.png', alt: 'Programs and pricing section' },
        { src: 'images/dini/footer.png', alt: 'Website footer' }
      ],
      live: '', repo: '', demo: '', demoUrl: '', poster: ''
    },
    books: {
      title: 'Walid Books',
      period: 'JUN – JUL 2026', sortDate: '2026-06', kind: 'CLIENT PROJECT',
      description: 'An online bookstore built for a client in Morocco, with a practical cash-on-delivery shopping flow.',
      features: ['Search by title, author or ISBN, with filters and sorting.', 'Book details with pricing, discounts and stock information.', 'Session-based shopping cart with quantity and stock limits.', 'Checkout with delivery details and order confirmation.'],
      stack: ['Python', 'Django', 'MySQL', 'Tailwind CSS'],
      screenshots: [
        { src: 'images/walid/home.png', alt: 'Walid Books homepage and catalog' },
        { src: 'images/walid/login.png', alt: 'Customer login screen' },
        { src: 'images/walid/store.png', alt: 'Bookstore browsing page' },
        { src: 'images/walid/cart.png', alt: 'Shopping cart' },
        { src: 'images/walid/browse.png', alt: 'Book browsing and filtering' }
      ],
      live: '', repo: '', demo: '', demoUrl: '', poster: ''
    },
    elite: {
      title: 'EliteWheels',
      period: 'MAR – JUL 2026', sortDate: '2026-03', kind: 'GRADUATION PROJECT',
      description: 'A luxury car rental platform for Morocco, developed as my graduation project. I worked across the customer experience, booking logic and administration.',
      features: ['Fleet browsing with brand, type, transmission and price filters.', 'Date-based availability and booking overlap checks.', 'Optional chauffeur, promo codes and booking status tracking.', 'Customer accounts, favorites and PDF receipts.', 'Customized Django administration for the fleet and bookings.'],
      stack: ['Python', 'Django', 'MySQL', 'Tailwind CSS'],
      live: '', repo: '', screenshots: [
        { src: 'images/elite/EW homepage.png' },
        { src: 'images/elite/EW fleet.png'},
        { src: 'images/elite/EW cardetails.png' },
        { src: 'images/elite/EW dashboard.png' }
      ], demo: '', demoUrl: '', poster: ''
    },
    gym: {
      title: 'OnlyGym',
      period: 'APR – JUL 2025', sortDate: '2025-04', kind: 'SCHOOL PROJECT',
      description: 'A desktop application developed as a school project using C# and Windows Forms.',
      features: ['Desktop application development with C#.', 'Interface built with Windows Forms.'],
      stack: ['C#', 'Windows Forms'],
      live: '', repo: '', screenshots: [], demo: '', demoUrl: '', poster: ''
    }
  }
};
