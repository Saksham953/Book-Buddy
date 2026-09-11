# BookBuddy

BookBuddy is a full-stack cloud-native bookstore platform built with **Next.js, React, TypeScript, Flask, and AWS**.

It provides book discovery, cart management, Stripe checkout, order tracking, Clerk authentication, an admin dashboard, and AWS SNS notifications for new orders.

## Features

* Book search and discovery by title, author, and category
* Book details, ratings, reviews, and PDF previews
* Shopping cart and Stripe Checkout
* Order history and tracking
* Clerk authentication and protected routes
* Admin dashboard for book management
* AWS SNS notifications for new orders

## Tech Stack

| Area           | Technologies                                   |
| -------------- | ---------------------------------------------- |
| Frontend       | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend        | Python, Flask, Boto3                           |
| Database       | Amazon DynamoDB                                |
| Cloud          | AWS EC2, AWS SNS                               |
| Authentication | Clerk                                          |
| Payments       | Stripe                                         |
| UI & Animation | Three.js, GSAP, Lucide                         |

## Architecture

```text
                         ┌──────────────┐
                         │    Browser   │
                         └──────┬───────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Next.js / React │
                       └───────┬─────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
              Clerk          Stripe       Flask API
           Authentication   Payments          │
                                             │
                                      ┌──────┴──────┐
                                      │             │
                                      ▼             ▼
                                  DynamoDB        AWS SNS
                               Books / Orders   Notifications
```

## Project Structure

```text
Book-Buddy/
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── book/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   │   ├── checkout/
│   │   │   └── webhooks/
│   │   ├── browse/
│   │   ├── orders/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   ├── proxy.ts
│   ├── next.config.ts
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

* Node.js 18+
* Python 3.10+
* AWS account
* Stripe account
* Clerk account
* DynamoDB tables
* AWS SNS topic

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

The Flask API runs on:

```text
http://localhost:5000
```

### Frontend

Open a new terminal:

```bash
cd book
npm install
npm run dev
```

The application runs on:

```text
http://localhost:3000
```

## Environment Variables

Create `backend/.env`:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
SNS_TOPIC_ARN=your_sns_topic_arn
```

Create `book/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_URL=http://localhost:3000
```

> **Security:** Never commit `.env` or `.env.local` files, AWS credentials, Stripe secrets, or Clerk secrets to the repository.

## AWS Configuration

BookBuddy uses Amazon DynamoDB for books and orders.

| Table    | Primary Key        |
| -------- | ------------------ |
| `Books`  | `id` (String)      |
| `Orders` | `orderId` (String) |

The `Orders` table also stores `userId` to associate orders with users.

Create an SNS topic named:

```text
BookStoreOrders
```

The backend publishes an SNS notification when a new order is created.

Required IAM permissions:

```text
dynamodb:Scan
dynamodb:PutItem
dynamodb:DeleteItem
sns:Publish
```

For production deployments, use the principle of least privilege and avoid broad IAM permissions.

## API

### Flask REST API

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/health`       | Check backend status |
| GET    | `/api/books`        | Retrieve books       |
| POST   | `/api/books`        | Add a book           |
| DELETE | `/api/books/<id>`   | Delete a book        |
| GET    | `/api/orders/<uid>` | Retrieve user orders |
| POST   | `/api/orders`       | Create an order      |

### Next.js API Routes

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | `/api/checkout`        | Create Stripe Checkout session |
| POST   | `/api/webhooks/stripe` | Process Stripe webhook events  |

## Order Flow

```text
User
  |
  v
Browse Books
  |
  v
Add to Cart
  |
  v
Stripe Checkout
  |
  v
Payment Completed
  |
  v
Create Order
  |
  +-------> DynamoDB
  |
  +-------> AWS SNS
                |
                v
        Admin Notification
```

## Security

* Clerk manages authentication and protected routes.
* Secrets are provided through environment variables.
* AWS resources are accessed using IAM permissions.
* Stripe webhook secrets remain server-side.
* Environment files are excluded from version control.

## Project Focus

BookBuddy demonstrates a practical full-stack architecture combining **Next.js, React, Flask REST APIs, authentication, payment processing, AWS cloud services, DynamoDB, and event-driven notifications**.
