# SenTechTrade - iPhone Marketplace

La marketplace #1 pour acheter et échanger des iPhones au Sénégal.

## Features

### Public Features
- **Home Page** - Hero section, featured listings, recent listings, how it works
- **Boutique** - Full catalog with advanced filters (model, capacity, condition, price, city)
- **Product Detail** - Complete product information with WhatsApp integration
- **Exchange Wizard** - 4-step form to exchange your iPhone
- **Chatbot Assistant** - AI-powered assistant for FAQ, exchanges, purchases, and seller onboarding
- **FAQ & How It Works** - Help pages

### User Roles
- **Client** - Browse, buy, and exchange iPhones
- **Seller** - Manage listings, view leads, boost listings
- **Admin** - Approve sellers, moderate listings, view all leads

### Key Features
- **WhatsApp-First** - All communications via WhatsApp with pre-filled messages
- **Verified Sellers** - Badge system for trusted sellers
- **Boost System** - Featured listings for increased visibility
- **Exchange System** - Trade your current iPhone for a new one
- **Intelligent Chatbot** - Guides users through exchanges, purchases, and seller applications
- **Soft-Wall** - Exchange possible without account (with rate limiting)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)

## Project Structure

\`\`\`
app/
├── page.tsx                    # Home page
├── boutique/                   # Shop/catalog page
├── product/[id]/              # Product detail page
├── echanger/                   # Exchange wizard (4 steps)
├── auth/login/                # Authentication
├── seller/
│   ├── apply/                 # Seller application
│   └── dashboard/             # Seller dashboard
├── admin/                     # Admin panel
├── api/
│   ├── leads/                 # Lead management API
│   ├── listings/              # Listing management API
│   └── seller-applications/   # Seller application API
components/
├── header.tsx                 # Main navigation
├── footer.tsx                 # Footer with links
├── product-card.tsx           # Reusable product card
├── chat-widget.tsx            # Chatbot widget
└── chat-widget-provider.tsx   # Chatbot context provider
lib/
├── types.ts                   # TypeScript types
├── data.ts                    # Mock data
├── whatsapp.ts               # WhatsApp integration helpers
├── utils.ts                   # Utility functions
└── chatbot/
    ├── service.ts            # Chatbot core logic
    ├── intents.ts            # Intent detection
    ├── responses.ts          # Response templates
    ├── faq-data.ts           # FAQ database
    ├── api.ts                # API integration
    ├── analytics.ts          # Event tracking
    └── rate-limit.ts         # Rate limiting
\`\`\`

## Chatbot Features

The SenTechTrade chatbot provides intelligent assistance for:

### Capabilities
- **FAQ Responses** - Answers common questions about models, conditions, pricing, and processes
- **Exchange Guidance** - Step-by-step collection of exchange information
- **Purchase Assistance** - Helps users buy specific iPhones
- **Seller Onboarding** - Guides new sellers through the application process
- **Context Awareness** - Detects product pages and pre-fills information
- **Multi-language** - Supports French (default) and English

### Configuration

#### Activating/Deactivating the Chatbot
The chatbot is enabled by default on all pages via `<ChatWidgetProvider />` in the root layout. To disable it on specific pages, remove the component from that page's layout.

#### Modifying FAQ Content
Edit `lib/chatbot/faq-data.ts` to add, remove, or update FAQ entries. Each entry includes:
- Question and answer text
- Category (models, conditions, process, seller, general)
- Keywords for matching user queries

#### Rate Limiting
- Users are limited to 3 lead submissions per 24 hours per device
- Limit is stored in localStorage
- Prevents abuse while allowing legitimate use
- Can be adjusted in `lib/chatbot/rate-limit.ts`

#### Analytics & Tracking
The chatbot tracks the following events:
- `bot_open` - User opens the chat widget
- `bot_intent_detected` - System detects user intent (exchange/buy/seller)
- `bot_lead_created` - Lead successfully created
- `bot_wa_clicked` - User clicks WhatsApp redirect button
- `bot_message_sent` - User sends a message

Events are logged to console and can be exported as CSV via:
\`\`\`javascript
import { getChatbotAnalytics } from '@/lib/chatbot/analytics'
const csv = getChatbotAnalytics().exportCSV()
\`\`\`

#### Context Awareness
On product detail pages, the chatbot automatically knows:
- Listing ID
- Product model and capacity
- Price
- Seller ID and phone
- Product title

This allows for personalized conversations and pre-filled forms.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

The following environment variables are configured in the Vercel project:

\`\`\`env
# Database (Supabase)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_ANON_KEY=

# Site Configuration
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=

# Admin
ADMIN_EMAIL=
\`\`\`

## MVP Features Implemented

✅ Public pages (Home, Boutique, Product Detail)
✅ Exchange wizard (4 steps)
✅ WhatsApp integration with pre-filled messages
✅ Intelligent chatbot assistant
✅ FAQ system with keyword matching
✅ Lead creation and tracking
✅ Seller application flow
✅ Seller dashboard (listings, leads, boost)
✅ Admin panel (applications, listings, leads)
✅ Product filtering and search
✅ Boost/featured listings system
✅ Rate limiting and abuse prevention
✅ Analytics and event tracking
✅ Context-aware conversations
✅ Responsive design
✅ French language interface

## Next Steps (v1.1)

- [ ] Real-time chat with sellers
- [ ] Payment integration for Boost
- [ ] Email notifications
- [ ] WhatsApp Business API integration
- [ ] Advanced analytics dashboard
- [ ] Favorites system
- [ ] User profiles with history
- [ ] Rating and review system
- [ ] Image optimization and CDN
- [ ] SEO optimization

## Design System

**Colors:**
- Primary: Blue (#2563EB)
- Secondary: Orange (#F97316)
- Accent: Green (#22C55E)
- Neutrals: Gray scale

**Typography:**
- Font: Geist (sans-serif)
- Headings: Bold, large sizes
- Body: Regular, readable line-height

## License

© 2025 SenTechTrade. All rights reserved.
