# 🚀 Züri Barber Website Setup Guide

## 📋 Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## 🔧 Environment Setup

### 1. Create Environment File
Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with initial data
npm run db:seed
```

## 👥 Employee Accounts Created

The seed script creates the following employee accounts:

| Name | Email | Password |
|------|-------|----------|
| Make Barber | make@zuribarber.com | password123 |
| Moo | moo@zuribarber.com | password123 |
| Ihab Barber | ihab@zuribarber.com | password123 |
| Rayan Barber | rayan@zuribarber.com | password123 |
| Enmanuel Barber | enmanuel@zuribarber.com | password123 |
| Ely Barber | ely@zuribarber.com | password123 |

## 🎯 Available Services

The system includes these services:
- **Haircut** (30-45min) - CHF 45
- **Beard Trim** (15-20min) - CHF 25
- **Haircut + Beard** (45-60min) - CHF 60
- **Kids Haircut** (20-30min) - CHF 30
- **Hair Wash** (15-20min) - CHF 20
- **Hair Styling** (20-30min) - CHF 35
- **Beard Shave** (25-35min) - CHF 40
- **Full Service** (60-75min) - CHF 80

## 🕒 Default Availability

All employees have the following availability:
- **Monday - Friday**: 9:00 AM - 6:00 PM
- **Saturday**: 9:00 AM - 4:00 PM
- **Sunday**: Closed

## 🚀 Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 🔗 Important URLs

- **Homepage**: http://localhost:3000
- **Employee Login**: http://localhost:3000/admin
- **Employee Signup**: http://localhost:3000/admin/signup
- **Employee Dashboard**: http://localhost:3000/admin/dashboard (after login)

## 🛠️ Database Management

```bash
# View database in Prisma Studio
npm run db:studio

# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

## 🔐 Security Notes

- Change the `JWT_SECRET` in production
- Use strong passwords for employee accounts
- Consider using environment-specific database URLs
- Implement rate limiting for production

## 📝 Next Steps

1. **Test employee login** with the provided accounts
2. **Create additional employee accounts** via the signup page
3. **Customize availability** for each employee
4. **Add appointment booking functionality**
5. **Implement client management features**

## 🆘 Troubleshooting

### Database Issues
- Ensure SQLite is available on your system
- Check file permissions for the database file
- Verify the `.env` file exists and has correct values

### Authentication Issues
- Verify JWT_SECRET is set
- Check that employee accounts exist in the database
- Ensure bcrypt is properly installed

### Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma client: `npm run db:generate` 