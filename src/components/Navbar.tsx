import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='w-full bg-white shadow-md p-4 flex justify-between items-center'>
      <div className='text-xl font-bold text-blue-600'>Connexta</div>
      <div className='flex gap-6'>
        <Link href='/'>Home</Link>
        <Link href='/profile'>Profile</Link>
        <Link href='/messages'>Messages</Link>
        <Link href='/settings'>Settings</Link>
      </div>
    </nav>
  );
}
