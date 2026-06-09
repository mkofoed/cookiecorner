# CookieCorner implementation design

## 1. Current solution overview

CookieCorner is currently implemented as a **local-only, containerized storefront**
for a single-country Hyggefis launch. The live code is focused on a
**customizer-first purchase flow** rather than a traditional product catalog.

Customers do not browse stock or choose from a visible product list. Instead,
they are routed directly into a CookieCorner-themed configurator where they:

1. choose a size
2. choose a color
3. choose gift wrapping
4. choose quantity
5. add the configured Hyggefis to the cart
6. complete checkout

The storefront uses HyggeFrame products behind the scenes to resolve a valid
fulfilment item and to submit the final order.

## 2. Tech stack

- **Frontend:** Next.js 16, React, TypeScript, App Router
- **Backend:** ASP.NET Core Web API on .NET 10
- **Integration:** HyggeFrame API for products and orders
- **Runtime:** Docker Compose
- **State management:** client-side cart in `localStorage`
- **Database:** none yet

## 3. Runtime architecture

```text
Browser
 -> Next.js web app (port 3000)
    -> ASP.NET API (port 8080)
       -> HyggeFrame API
```

### Docker services

- `web`
 - Next.js frontend
 - receives `API_BASE_URL=http://api:8080`
- `api`
 - ASP.NET Web API
 - loads `appsettings.Local.json`

### Local-only configuration

Sensitive HyggeFrame configuration is stored in:

- `src/CookieCorner.Api/appsettings.Local.json`

That file is mounted into the API container and is intentionally not committed.

## 4. Actual user-facing flow

### Active routes

- `/` -> redirects to `/configurator`
- `/products` -> redirects to `/configurator`
- `/configurator` -> main customizer flow
- `/cart` -> shows configured items and quantity management
- `/checkout` -> collects customer details and places the order

### Navigation

The primary navigation is now:

- Cookie Lab
- Cart
- Checkout

There is no separate home experience and no visible stock/product overview.

## 5. Frontend design and behavior

### Customizer-first experience

The main storefront experience is implemented in:

- `src/cookiecorner-web/app/configurator/page.tsx`
- `src/cookiecorner-web/app/_components/configurator-wizard.tsx`

The configurator is styled as a large, reference-inspired product page with:

- a large visual hero stage
- an over-the-top CookieCorner visual theme
- size selectors
- color selectors
- gift-wrap selectors
- quantity selection
- a strong "Add to basket" CTA

### Product resolution logic

The user does not select a concrete product directly.

Instead, the configurator:

1. fetches HyggeFrame products from the backend
2. derives available size and color options from those products
3. picks a matching available fulfilment product based on the chosen size/color
4. stores the configuration summary alongside the cart item

If no exact size/color match exists, the code falls back to:

1. a size-only match
2. then the first available product

### Cart behavior

The cart is implemented entirely on the client in:

- `src/cookiecorner-web/app/_components/cart-storage.ts`

Each configured item stores:

- fulfilment product ID
- display name
- price
- quantity
- size
- color
- configuration summary lines

The cart persists in `localStorage` and updates the UI through a browser event.

## 6. Backend design

### API endpoints currently implemented

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/orders`

### Backend responsibilities

The ASP.NET API currently acts as a thin commerce backend that:

- loads local HyggeFrame configuration
- proxies product retrieval from HyggeFrame
- maps checkout requests into HyggeFrame order payloads
- returns clear `ProblemDetails` responses for configuration and upstream errors

### Service structure

Current service areas include:

- product catalog service
- order checkout service
- HyggeFrame integration client

The backend includes domain models for:

- products
- cart
- customers
- orders
- storefront configuration

## 7. HyggeFrame integration

The storefront currently depends on HyggeFrame for:

- product data
- order creation

### Integration details

- The backend uses an API key from local configuration
- The supplied HyggeFrame base URL can be a Swagger URL
- the client normalizes `/swagger` and `/swagger/` to the real API root

### Error handling

The API returns:

- `503` when HyggeFrame configuration is incomplete
- `502` when HyggeFrame cannot be reached or returns upstream HTTP errors
- `400` for invalid checkout payloads

## 8. Checkout design

Checkout is implemented as a client-side form backed by the Next.js route handler
and the ASP.NET API.

### Browser submission flow

```text
Checkout form
 -> POST /api/orders (Next.js route handler)
    -> POST /api/orders (ASP.NET API)
       -> POST HyggeFrame /api/orders
```

### Checkout data captured

- customer name
- customer email
- customer phone
- city
- shipping address
- optional notes

Configured item summaries are appended into the order notes so the selected
size/color/gift-wrap details remain visible in the final order request.

## 9. What is intentionally not implemented yet

The original design assumptions were broader than the code that exists today.
These areas are **not** currently implemented:

- database-backed persistence
- customer accounts
- admin/product management UI
- payment provider integration
- shipping provider integration
- email notifications
- analytics
- stock browsing in the storefront
- a separate product details page
- a backend cart API

## 10. Current design direction

The implemented solution should now be understood as:

> A CookieCorner-themed, local-only, customizer-first storefront for Hyggefis,
> built with Next.js and ASP.NET, integrated with HyggeFrame for product lookup
> and order submission, with cart state stored in the browser and run through
> Docker Compose.

That is the design the code currently follows.
