'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SpeachToText } from '@/components/dashboard/speach-to-text';
import Editor from '@/components/dashboard/editor/editor';
import { Card } from '@/components/ui/card';
import { JSONContent } from 'novel';
import { useUser } from '@/components/dashboard/provider';
import { changeProfile } from '@/app/actions';
import useSession from '@/lib/hooks/use-session';
import { useRouter } from 'next/navigation';

const profiles = [
  { value: 'founder', label: '💫 Founder' },
  { value: 'casual', label: '👋 Casual' },
  { value: 'features', label: '🧩 Features' },
];

export default function WritingInterface() {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const { user_details } = useUser();
  const { session } = useSession();
  const router = useRouter();

  return (
    <div className="flex h-screen w-full bg-background">
      <main className="flex-1 flex flex-col p-4">
        <Card className="flex-1 p-4 md:p-6">
          <Editor initialContent={initialContent} />
        </Card>
        <div className="my-4 flex flex-row justify-between items-center gap-2">
          <div className="flex items-center flex-row gap-2">
            <Select
              defaultValue={user_details?.profile ?? profiles[0].value}
              onValueChange={async (value) => {
                if (session?.access_token) {
                  changeProfile(session.access_token, value).then(() =>
                    router.refresh()
                  );
                }
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.value} value={profile.value}>
                    {profile.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <SpeachToText setContent={setInitialContent} />
          </div>
        </div>
      </main>
    </div>
  );
}
