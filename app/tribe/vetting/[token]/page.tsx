import { redirect } from 'next/navigation';

/**
 * Legacy vetting URLs redirect to the unified tribe chat route.
 */
export default async function LegacyTribeVettingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/tribe/chat/${token}`);
}
