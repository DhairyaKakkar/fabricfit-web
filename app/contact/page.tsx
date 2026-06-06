import type { Metadata } from 'next';
import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us — TrialRoomStudio',
  description: 'Get in touch with the TrialRoomStudio team — questions, custom plans, or a live demo with your own fabrics.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactClient />
      <Footer />
    </>
  );
}
