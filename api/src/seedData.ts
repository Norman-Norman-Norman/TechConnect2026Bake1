import { Supplier } from './models/supplier';
import { Product } from './models/product';
import { Headquarters } from './models/headquarters';
import { Branch } from './models/branch';
import { Order } from './models/order';
import { OrderDetail } from './models/orderDetail';
import { Delivery } from './models/delivery';
import { OrderDetailDelivery } from './models/orderDetailDelivery';
import { Review } from './models/review';

// Suppliers
export const suppliers: Supplier[] = [
    {
        supplierId: 1,
        name: "PurrTech Innovations",
        description: "Leading supplier of premium smart cat technology",
        contactPerson: "Felix Whiskerton",
        email: "felix@purrtech.co",
        phone: "555-0101"
    },
    {
        supplierId: 2,
        name: "WhiskerWare Systems",
        description: "Advanced feline-focused smart product supplier",
        contactPerson: "Tabitha Pawson",
        email: "tabitha@whiskerware.com",
        phone: "555-0102"
    },
    {
        supplierId: 3,
        name: "CatNip Creations",
        description: "Supplier of eco-friendly cat toys and accessories",
        contactPerson: "Nina Nibbles",
        email: "nina@catnip.com",
        phone: "555-0103"
    }
];

// Products
export const products: Product[] = [
    {
        productId: 1,
        supplierId: 3,
        name: "SmartFeeder One",
        description: "This AI-powered feeder learns your cat's snack schedule based on nap cycles and mealtime habits. It detects overeating, undernapping, and auto-updates a Feline Health Repo.",
        price: 129.99,
        sku: "CAT-FEED-001",
        unit: "piece",
        imgName: "feeder.png",
        discount: 0.25
    },
    {
        productId: 2,
        supplierId: 3,
        name: "AutoClean Litter Dome",
        description: "A self-cleaning litter box that detects patterns in your cat's... commits. Sends you a health report and Slack alert if things look off.",
        price: 199.99,
        sku: "CAT-LITTER-001",
        unit: "piece",
        imgName: "litter-box.png",
        discount: 0.25
    },
    {
        productId: 3,
        supplierId: 2,
        name: "CatFlix Entertainment Portal",
        description: "On-demand laser shows, motion videos, and bird-watching streams - customized per cat using AI interest tracking. Think Netflix, but for felines.",
        price: 89.99,
        sku: "CAT-FLIX-001",
        unit: "piece",
        imgName: "catflix.png"
    },
    {
        productId: 4,
        supplierId: 2,
        name: "PawTrack Smart Collar",
        description: "GPS and activity tracker with AI-powered mood detection based on tail position, purring frequency, and movement patterns. Syncs with your phone for walk stats and zoomie alerts.",
        price: 79.99,
        sku: "CAT-COLLAR-001",
        unit: "piece",
        imgName: "smart-collar.png"
    },
    {
        productId: 5,
        supplierId: 1,
        name: "SleepNest ThermoPod",
        description: "A smart bed that adjusts its temperature, lighting, and white noise based on your cat's REM cycles. Auto-generates nap metrics in JSON.",
        price: 149.99,
        sku: "CAT-BED-001",
        unit: "piece",
        imgName: "sleep-nest.png"
    },
    {
        productId: 6,
        supplierId: 1,
        name: "ClawMate Auto Groomer",
        description: "Your cat brushes itself. This AI station detects which areas need grooming, dispenses treats for patience, and logs grooming history to your pet portal.",
        price: 119.99,
        sku: "CAT-GROOM-001",
        unit: "piece",
        imgName: "auto-groomer.png"
    },
    {
        productId: 7,
        supplierId: 3,
        name: "Smart Fountain Flow+",
        description: "This water fountain adjusts flow patterns based on time of day, cat hydration levels, and even playfulness. Uses facial recognition to distinguish multiple cats.",
        price: 69.99,
        sku: "CAT-FOUNTAIN-001",
        unit: "piece",
        imgName: "smart-fountain.png",
        discount: 0.25
    },
    {
        productId: 8,
        supplierId: 2,
        name: "ScratchPad Pro",
        description: "More than a scratcher - this one detects scratching habits, gamifies it with leaderboard stats for multi-cat homes, and awards digital badges.",
        price: 59.99,
        sku: "CAT-SCRATCH-001",
        unit: "piece",
        imgName: "scratch-pad.png"
    },
    {
        productId: 9,
        supplierId: 2,
        name: "ChirpCam Window Mount",
        description: "Motion-activated smart cam that records wildlife outside the window and sends curated 'Birdflix' highlights to your cat's personal feed.",
        price: 99.99,
        sku: "CAT-CAM-001",
        unit: "piece",
        imgName: "chirp-cam.png"
    },
    {
        productId: 10,
        supplierId: 3,
        name: "SnackVault Puzzle Dispenser",
        description: "Treat puzzle toy that evolves in difficulty with your cat's cleverness. AI engine auto-adjusts pathways and provides tips to the human if the cat cheats.",
        price: 49.99,
        sku: "CAT-SNACK-001",
        unit: "piece",
        imgName: "snack-vault.png",
        discount: 0.25
    },
    {
        productId: 11,
        supplierId: 1,
        name: "DoorDash Pet Portal",
        description: "Smart cat door with facial recognition and time-based access. Prevents midnight squirrel parties and tracks in/out commits to your dashboard.",
        price: 159.99,
        sku: "CAT-DOOR-001",
        unit: "piece",
        imgName: "door-dash.png"
    },
    {
        productId: 12,
        supplierId: 2,
        name: "ZoomieTracker AI Mat",
        description: "A motion-sensing mat that detects zoomies, spins up chase lights, and logs agility bursts to a weekly health report. Yes, it graphs zoomies per hour.",
        price: 79.99,
        sku: "CAT-TRACKER-001",
        unit: "piece",
        imgName: "tracker-mat.png"
    }
];

// Headquarters
export const headquarters: Headquarters[] = [
    {
        headquartersId: 1,
        name: "CatTech Global HQ",
        description: "Feline tech innovations headquarters",
        address: "123 Whisker Lane, Purrington District",
        contactPerson: "Catherine Purrston",
        email: "catherine@octocat.com",
        phone: "555-0001"
    }
];

// Branches
export const branches: Branch[] = [
    {
        branchId: 1,
        headquartersId: 1,
        name: "Meowtown Branch",
        description: "Main downtown cat tech showroom",
        address: "456 Purrfect Plaza",
        contactPerson: "Chloe Whiskers",
        email: "cwhiskers@octocat.com",
        phone: "555-0201"
    },
    {
        branchId: 2,
        headquartersId: 1,
        name: "Tabby Terrace Branch",
        description: "Western district cat tech hub",
        address: "789 Feline Avenue",
        contactPerson: "Tom Pouncer",
        email: "tpouncer@octocat.com",
        phone: "555-0202"
    }
];

// Orders
export const orders: Order[] = [
    {
        orderId: 1,
        branchId: 1,
        orderDate: new Date().toISOString(),
        name: "Q2 Feline Tech Refresh",
        description: "Quarterly smart cat tech product refresh",
        status: "pending"
    },
    {
        orderId: 2,
        branchId: 2,
        orderDate: new Date().toISOString(),
        name: "Cat Enrichment Bundle",
        description: "Monthly cat entertainment systems restock",
        status: "processing"
    }
];

// Order Details
export const orderDetails: OrderDetail[] = [
    {
        orderDetailId: 1,
        orderId: 1,
        productId: 2,
        quantity: 5,
        unitPrice: 199.99,
        notes: "AutoClean Litter Domes for new cat café locations"
    },
    {
        orderDetailId: 2,
        orderId: 1,
        productId: 3,
        quantity: 5,
        unitPrice: 89.99,
        notes: "CatFlix Entertainment Portals for waiting areas"
    },
    {
        orderDetailId: 3,
        orderId: 2,
        productId: 4,
        quantity: 20,
        unitPrice: 79.99,
        notes: "PawTrack Smart Collars for adoption events"
    }
];

// Deliveries
export const deliveries: Delivery[] = [
    {
        deliveryId: 1,
        supplierId: 1,
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        name: "PurrTech Smart Home Bundle",
        description: "Premium cat tech products delivery for smart cat homes",
        status: "pending"
    },
    {
        deliveryId: 2,
        supplierId: 2,
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        name: "WhiskerWare Entertainment Package",
        description: "Entertainment and tracking systems for feline companions",
        status: "in-transit"
    }
];

// Order Detail Deliveries
export const orderDetailDeliveries: OrderDetailDelivery[] = [
    {
        orderDetailDeliveryId: 1,
        orderDetailId: 1,
        deliveryId: 1,
        quantity: 5,
        notes: "Delivery batch"
    },
    {
        orderDetailDeliveryId: 2,
        orderDetailId: 2,
        deliveryId: 1,
        quantity: 5,
        notes: "Delivery batch"
    },
    {
        orderDetailDeliveryId: 3,
        orderDetailId: 3,
        deliveryId: 2,
        quantity: 20,
        notes: "Delivery"
    }
];

// Reviews
export const reviews: Review[] = [
    // SmartFeeder One reviews (productId: 1)
    {
        reviewId: 1,
        productId: 1,
        rating: 5,
        title: "Life-changing for my picky eater!",
        body: "My cat Whiskers was always inconsistent with meals, but the SmartFeeder One has completely solved that. It learned his schedule within a week and now he's eating regularly. The health reports are incredibly detailed and helped me catch early signs of overeating. Worth every penny!",
        authorName: "Sarah Mitchell",
        createdAt: "2026-01-15T14:30:00.000Z",
        verifiedPurchase: true,
        helpful: 24
    },
    {
        reviewId: 2,
        productId: 1,
        rating: 4,
        title: "Great tech, minor app issues",
        body: "The feeder itself works perfectly and my cats love the scheduled feeding. The AI is impressive at tracking patterns. Only downside is the app occasionally loses connection, but support has been responsive. Easy to clean which is a huge plus.",
        authorName: "Alex Kim",
        createdAt: "2026-01-28T09:15:00.000Z",
        verifiedPurchase: true,
        helpful: 12
    },
    {
        reviewId: 3,
        productId: 1,
        rating: 5,
        title: "Best investment for multi-cat household",
        body: "Managing feeding schedules for 3 cats was chaos. This feeder recognized each cat and adjusted portions perfectly. The nap cycle correlation feature is genius - it actually helps me understand my cats better!",
        authorName: "Jennifer Torres",
        createdAt: "2026-02-03T16:45:00.000Z",
        verifiedPurchase: true,
        helpful: 18
    },
    // AutoClean Litter Dome reviews (productId: 2)
    {
        reviewId: 4,
        productId: 2,
        rating: 5,
        title: "No more daily scooping!",
        body: "This litter box has changed my life. The self-cleaning mechanism is whisper-quiet and works flawlessly. The health alerts caught a potential issue early - my vet was impressed with the data. Yes, it's expensive, but I'd buy it again in a heartbeat.",
        authorName: "Michael Chen",
        createdAt: "2026-01-20T11:20:00.000Z",
        verifiedPurchase: true,
        helpful: 31
    },
    {
        reviewId: 5,
        productId: 2,
        rating: 4,
        title: "Works great but requires space",
        body: "The AutoClean is fantastic and my cat adapted within 2 days. Health reports are super useful. Only caveat is it's quite large - make sure you have the space. Also, the Slack alerts are hilarious and actually informative.",
        authorName: "David Nakamura",
        createdAt: "2026-01-25T13:40:00.000Z",
        verifiedPurchase: false,
        helpful: 9
    },
    {
        reviewId: 6,
        productId: 2,
        rating: 5,
        title: "Worth every cent for a clean home",
        body: "I have 2 cats and was skeptical about the price, but this pays for itself in convenience. Zero odor, completely automated, and the tracking data has been genuinely useful for monitoring their health. Highly recommend!",
        authorName: "Emma Rodriguez",
        createdAt: "2026-02-01T08:30:00.000Z",
        verifiedPurchase: true,
        helpful: 15
    },
    // CatFlix Entertainment Portal reviews (productId: 3)
    {
        reviewId: 7,
        productId: 3,
        rating: 5,
        title: "My cat is glued to this!",
        body: "I work from home and my cat was always interrupting. CatFlix has been a game-changer - he's entertained for hours with the bird-watching streams and laser shows. The AI customization really works, it learned what he likes within days.",
        authorName: "Lisa Park",
        createdAt: "2026-01-18T10:15:00.000Z",
        verifiedPurchase: true,
        helpful: 21
    },
    {
        reviewId: 8,
        productId: 3,
        rating: 4,
        title: "Great entertainment system",
        body: "My senior cat loves the motion videos. It's gotten him more active and engaged. The interest tracking is spot-on. Lost one star because I wish there were more content options, but overall very satisfied.",
        authorName: "Robert Williams",
        createdAt: "2026-01-30T15:25:00.000Z",
        verifiedPurchase: true,
        helpful: 7
    },
    {
        reviewId: 9,
        productId: 3,
        rating: 5,
        title: "Netflix for cats is real!",
        body: "This is exactly what it promises - entertainment tailored for cats. My two kittens are obsessed with the bird streams. Setup was super easy and the AI recommendations are surprisingly accurate. Best purchase this year!",
        authorName: "Sophia Martinez",
        createdAt: "2026-02-05T12:00:00.000Z",
        verifiedPurchase: true,
        helpful: 13
    },
    // PawTrack Smart Collar reviews (productId: 4)
    {
        reviewId: 10,
        productId: 4,
        rating: 5,
        title: "Peace of mind for outdoor cat parents",
        body: "The GPS tracking is accurate and real-time. The mood detection feature helped me realize my cat was stressed when a new dog moved in next door. Battery lasts 5+ days. Absolutely essential for any outdoor cat.",
        authorName: "James Anderson",
        createdAt: "2026-01-22T14:50:00.000Z",
        verifiedPurchase: true,
        helpful: 19
    },
    {
        reviewId: 11,
        productId: 4,
        rating: 4,
        title: "Great tracker, collar is slightly heavy",
        body: "Love the activity tracking and zoomie alerts - they crack me up! The mood detection is surprisingly accurate. My only concern is the collar is a bit heavier than regular collars, but my cat adjusted in a few days.",
        authorName: "Patricia Lee",
        createdAt: "2026-01-27T09:30:00.000Z",
        verifiedPurchase: true,
        helpful: 8
    },
    {
        reviewId: 12,
        productId: 4,
        rating: 5,
        title: "Found my cat twice thanks to this",
        body: "My escape artist cat has been found twice using the GPS feature. The geofencing alerts are instant. The activity data is a nice bonus - I can see when she's having her crazy zoomie sessions even when I'm at work!",
        authorName: "Thomas Wright",
        createdAt: "2026-02-02T16:20:00.000Z",
        verifiedPurchase: false,
        helpful: 22
    },
    // SleepNest ThermoPod reviews (productId: 5)
    {
        reviewId: 13,
        productId: 5,
        rating: 5,
        title: "My cat won't sleep anywhere else",
        body: "The temperature adjustment is brilliant - it keeps my cat comfortable in all seasons. The REM tracking showed me she wasn't getting quality sleep before. Now she's noticeably calmer and happier. Premium product, premium results.",
        authorName: "Amanda Foster",
        createdAt: "2026-01-19T11:40:00.000Z",
        verifiedPurchase: true,
        helpful: 17
    },
    {
        reviewId: 14,
        productId: 5,
        rating: 4,
        title: "Impressive sleep tech for cats",
        body: "Never thought I'd be reading JSON nap metrics for my cat, but here we are! The automated adjustments work seamlessly. My cat seems more rested. Wish it had a washable cover option but still very happy with it.",
        authorName: "Daniel Kim",
        createdAt: "2026-01-29T13:10:00.000Z",
        verifiedPurchase: true,
        helpful: 11
    },
    {
        reviewId: 15,
        productId: 5,
        rating: 5,
        title: "Game changer for senior cats",
        body: "My 14-year-old cat has arthritis and this bed has improved her quality of life dramatically. The gentle warmth helps her joints, and she's sleeping better than she has in years. The white noise feature is perfect for anxious cats too.",
        authorName: "Margaret Sullivan",
        createdAt: "2026-02-04T10:25:00.000Z",
        verifiedPurchase: true,
        helpful: 26
    },
    // ClawMate Auto Groomer reviews (productId: 6)
    {
        reviewId: 16,
        productId: 6,
        rating: 5,
        title: "No more hairballs!",
        body: "This groomer has reduced hairballs by at least 80%. My long-haired cat uses it daily and his coat has never looked better. The treat dispensing keeps him interested and the grooming history helps me track his usage.",
        authorName: "Rachel Green",
        createdAt: "2026-01-21T15:30:00.000Z",
        verifiedPurchase: true,
        helpful: 20
    },
    {
        reviewId: 17,
        productId: 6,
        rating: 4,
        title: "Works well after initial training",
        body: "It took about a week to train my cat to use this, but now she loves it. The AI detection works great at identifying which areas need grooming. Slightly loud during operation but not too bad. Overall very pleased!",
        authorName: "Kevin Brown",
        createdAt: "2026-01-26T12:45:00.000Z",
        verifiedPurchase: true,
        helpful: 6
    },
    {
        reviewId: 18,
        productId: 6,
        rating: 5,
        title: "Essential for long-haired cats",
        body: "As a Persian cat owner, this is a lifesaver. Daily grooming is automatic and my cat actually enjoys it. The grooming portal data is detailed and helps me stay on top of his coat health. Highly recommend for any long-haired breed!",
        authorName: "Olivia Martinez",
        createdAt: "2026-02-06T14:00:00.000Z",
        verifiedPurchase: false,
        helpful: 14
    },
    // Smart Fountain Flow+ reviews (productId: 7)
    {
        reviewId: 19,
        productId: 7,
        rating: 5,
        title: "Finally, my cats drink enough water!",
        body: "The adjustable flow patterns are genius. My cats were always dehydrated, but this fountain has tripled their water intake. The facial recognition for multiple cats is spot-on. Easy to clean and super quiet.",
        authorName: "Christine Patel",
        createdAt: "2026-01-17T09:50:00.000Z",
        verifiedPurchase: true,
        helpful: 23
    },
    {
        reviewId: 20,
        productId: 7,
        rating: 4,
        title: "Great fountain, filters need replacing often",
        body: "The fountain itself is excellent and my cats love the flowing water. Hydration tracking is a nice feature. The only downside is the filters need replacing more frequently than expected, which adds to the cost.",
        authorName: "Brian Murphy",
        createdAt: "2026-01-31T11:15:00.000Z",
        verifiedPurchase: true,
        helpful: 10
    },
    {
        reviewId: 21,
        productId: 7,
        rating: 5,
        title: "Best water fountain on the market",
        body: "I've tried 4 different fountains and this is by far the best. The smart features actually work and aren't just gimmicks. My picky drinker cat now drinks regularly. The playfulness detection is adorable!",
        authorName: "Nicole Taylor",
        createdAt: "2026-02-07T16:40:00.000Z",
        verifiedPurchase: true,
        helpful: 16
    },
    // ScratchPad Pro reviews (productId: 8)
    {
        reviewId: 22,
        productId: 8,
        rating: 4,
        title: "My furniture thanks you",
        body: "The gamification actually works! My cats compete for the leaderboard and have completely stopped scratching the furniture. The digital badges are a fun touch. Lost a star because it's pricey for a scratcher, but it works.",
        authorName: "Andrew Davis",
        createdAt: "2026-01-23T13:25:00.000Z",
        verifiedPurchase: true,
        helpful: 18
    },
    {
        reviewId: 23,
        productId: 8,
        rating: 5,
        title: "Who knew cats would respond to gamification?",
        body: "This is brilliant. My two cats are now in a friendly competition and both use this religiously. The habit detection data shows they're scratching here instead of my couch. Innovation at its finest!",
        authorName: "Melissa Johnson",
        createdAt: "2026-02-01T10:30:00.000Z",
        verifiedPurchase: true,
        helpful: 12
    },
    {
        reviewId: 24,
        productId: 8,
        rating: 5,
        title: "Saved my leather sofa",
        body: "My cat was destroying my new leather sofa until I got this. The leaderboard feature motivated him to use this instead (yes, really!). The scratch detection is surprisingly accurate. Absolutely worth the investment.",
        authorName: "Gregory Wilson",
        createdAt: "2026-02-08T15:10:00.000Z",
        verifiedPurchase: true,
        helpful: 21
    },
    // ChirpCam Window Mount reviews (productId: 9)
    {
        reviewId: 25,
        productId: 9,
        rating: 5,
        title: "Cat TV at its finest!",
        body: "This is entertainment gold for my indoor cat. The motion detection catches every bird and squirrel, and the highlight reels are actually entertaining for me too! My cat watches his 'Birdflix' daily. Setup was a breeze.",
        authorName: "Sandra White",
        createdAt: "2026-01-24T14:20:00.000Z",
        verifiedPurchase: true,
        helpful: 25
    },
    {
        reviewId: 26,
        productId: 9,
        rating: 4,
        title: "Great concept, could use more storage",
        body: "Love the idea and execution. My cat is glued to the window now. The curated highlights are well done. Only issue is storage fills up quickly with all the recordings. Would be 5 stars with more cloud storage.",
        authorName: "Jeffrey Moore",
        createdAt: "2026-01-29T12:00:00.000Z",
        verifiedPurchase: true,
        helpful: 7
    },
    {
        reviewId: 27,
        productId: 9,
        rating: 5,
        title: "Window watching upgraded to premium",
        body: "My cat used to just stare out the window. Now he has a curated wildlife channel! The motion activation works perfectly and the video quality is excellent. This is a must-have for indoor cats.",
        authorName: "Kimberly Harris",
        createdAt: "2026-02-05T09:45:00.000Z",
        verifiedPurchase: false,
        helpful: 19
    },
    // SnackVault Puzzle Dispenser reviews (productId: 10)
    {
        reviewId: 28,
        productId: 10,
        rating: 5,
        title: "Keeps my genius cat busy",
        body: "My cat is too smart for regular toys, but this puzzle keeps evolving with him. The AI adjustment is real - it gets harder as he solves it faster. Plus the 'human tips when cat cheats' feature made me laugh out loud.",
        authorName: "Victoria Clark",
        createdAt: "2026-01-16T10:40:00.000Z",
        verifiedPurchase: true,
        helpful: 28
    },
    {
        reviewId: 29,
        productId: 10,
        rating: 4,
        title: "Great mental stimulation",
        body: "This has reduced my cat's boredom significantly. The difficulty progression is impressive. She's engaged for 20-30 minutes at a time. Wish it held more treats but overall excellent product for smart cats.",
        authorName: "Christopher Lewis",
        createdAt: "2026-01-28T16:30:00.000Z",
        verifiedPurchase: true,
        helpful: 9
    },
    {
        reviewId: 30,
        productId: 10,
        rating: 5,
        title: "Best puzzle toy we've ever had",
        body: "I've bought countless puzzle toys and this is the only one my cat hasn't gotten bored with. The evolving difficulty is key. The treat capacity is good for daily use. Highly recommend for curious cats!",
        authorName: "Ashley Robinson",
        createdAt: "2026-02-03T13:50:00.000Z",
        verifiedPurchase: true,
        helpful: 15
    },
    // DoorDash Pet Portal reviews (productId: 11)
    {
        reviewId: 31,
        productId: 11,
        rating: 5,
        title: "No more unwanted guests!",
        body: "The facial recognition is incredibly accurate - only my cat can enter. No more neighborhood cats sneaking in to steal food! The time-based access and tracking dashboard are excellent features. Installation was straightforward.",
        authorName: "Steven Martinez",
        createdAt: "2026-01-20T15:00:00.000Z",
        verifiedPurchase: true,
        helpful: 22
    },
    {
        reviewId: 32,
        productId: 11,
        rating: 4,
        title: "Works great but needs power backup",
        body: "Love the facial recognition and in/out tracking. My cat adjusted quickly. Only concern is it requires power, so we had to add a UPS backup for power outages. Otherwise fantastic product!",
        authorName: "Laura Anderson",
        createdAt: "2026-01-27T11:45:00.000Z",
        verifiedPurchase: true,
        helpful: 8
    },
    {
        reviewId: 33,
        productId: 11,
        rating: 5,
        title: "Essential for multi-cat neighborhoods",
        body: "This solved our neighborhood cat invasion problem completely. The dashboard shows exactly when my cat comes and goes. The 'prevents midnight squirrel parties' claim is 100% accurate. Worth every penny!",
        authorName: "Benjamin Scott",
        createdAt: "2026-02-04T14:30:00.000Z",
        verifiedPurchase: true,
        helpful: 17
    },
    // ZoomieTracker AI Mat reviews (productId: 12)
    {
        reviewId: 34,
        productId: 12,
        rating: 5,
        title: "Zoomie data I didn't know I needed",
        body: "The chase lights turn zoomie time into an event! My cat loves it and I love seeing the activity graphed. The weekly health reports correlate zoomies with overall wellness. It's science meets cat entertainment!",
        authorName: "Catherine Young",
        createdAt: "2026-01-25T10:20:00.000Z",
        verifiedPurchase: true,
        helpful: 20
    },
    {
        reviewId: 35,
        productId: 12,
        rating: 4,
        title: "Fun activity tracker",
        body: "My cats love the chase lights and the zoomie detection is surprisingly accurate. The graphs are entertaining and actually useful for monitoring activity levels. Would be 5 stars if the mat was a bit larger.",
        authorName: "Jessica Turner",
        createdAt: "2026-01-30T14:15:00.000Z",
        verifiedPurchase: true,
        helpful: 11
    },
    {
        reviewId: 36,
        productId: 12,
        rating: 5,
        title: "Best investment for active cats",
        body: "This turned random zoomies into structured play sessions. The motion sensing is instant and the lights keep my cat engaged. The health reports helped my vet understand his energy patterns. Absolutely love this!",
        authorName: "Matthew Hall",
        createdAt: "2026-02-06T12:40:00.000Z",
        verifiedPurchase: true,
        helpful: 16
    }
];