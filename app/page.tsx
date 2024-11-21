import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { inter } from './ui/fonts';
import { redirect } from 'next/navigation';


export default function Page() {
  redirect('dashboard');
}
