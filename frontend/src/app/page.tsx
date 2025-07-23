import { redirect } from 'next/navigation'

export default function RootPage() {
  // For now, redirect to landing page
  // Later this can be intelligent routing based on auth status
  redirect('/(landing)')
}
