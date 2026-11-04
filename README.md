# নবীন বরণ ২০২৬ — SGPI Sibir

সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউটের ২০২৫-২০২৬ শিক্ষাবর্ষের প্রথম সেমিস্টারের নবীন শিক্ষার্থীদের জন্য ইভেন্ট রেজিস্ট্রেশন প্রোটোটাইপ।

## ইভেন্ট তথ্য
- অনুষ্ঠান: নবীন বরণ ২০২৬
- তারিখ: ১২ নভেম্বর ২০২৬, রোজ বৃহস্পতিবার
- স্থান: সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট, সাতক্ষীরা শহর
- আয়োজক: বাংলাদেশ ইসলামী ছাত্রশিবির, সাতক্ষীরা সরকারি পলিটেকনিক ইনস্টিটিউট
- পোস্টারের সংশোধিত বাক্য: **থাকছে একগুচ্ছ উপহার।**

## QR কোড
হোমপেজের QR কোড runtime-এ বর্তমান origin থেকে `/#register` URL তৈরি করে। তাই deployed domain বদলালে QR code-ও স্বয়ংক্রিয়ভাবে নতুন domain ব্যবহার করবে। Registration pass-এর QR-এ শুধু Registration ID থাকে; শিক্ষার্থীর মোবাইল নম্বর QR payload-এ রাখা হয় না।

## বর্তমান বাস্তবায়নের সীমা — Production ব্যবহারের আগে পড়ুন
- রেজিস্ট্রেশন ডেটা browser localStorage-এ রাখা হবে—এই প্রকল্পে Supabase/remote database যোগ করা হবে না। এটি shared database নয়; একই browser ও device-এ তথ্য পাওয়া যাবে। Browser data clear করলে বা device বদলালে তথ্য হারাতে পারে।
- Supabase database, server-side validation, RLS এবং secure admin roles এখনো configure করা হয়নি।
- নিরাপত্তার কারণে client-side hardcoded admin password/login সরানো হয়েছে এবং backend authentication না হওয়া পর্যন্ত Admin Login বন্ধ রাখা হয়েছে।
- কোনো বাস্তব শিক্ষার্থীর ব্যক্তিগত তথ্য সংগ্রহের আগে Supabase Auth + database + RLS + secure admin authorization সম্পন্ন করতে হবে।
- GitHub-এ কোনো password, service-role key বা secret commit করা যাবে না।

## Local development
```bash
bun install
bun run dev
```

Build check:
```bash
bun run lint
bun run build
```

এটি একটি event-site frontend prototype; backend ও security setup যাচাই না হওয়া পর্যন্ত production-ready registration system হিসেবে ব্যবহার করা উচিত নয়।
