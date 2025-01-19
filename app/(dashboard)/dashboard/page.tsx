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

export default function WritingInterface() {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );

  return (
    <div className="flex h-screen w-full bg-background">
      <main className="flex-1 flex flex-col p-4">
        <Card className="flex-1 p-4">
          <Editor initialContent={initialContent} />
        </Card>
        <div className="my-4 flex flex-row justify-between items-center gap-2">
          <div className="flex items-center flex-row gap-2">
            <Select defaultValue="persuasive">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="persuasive">💫 Founder</SelectItem>
                <SelectItem value="casual">👋 Casual</SelectItem>
                <SelectItem value="formal">👔 Formal</SelectItem>
              </SelectContent>
            </Select>
            <SpeachToText setContent={setInitialContent} />
          </div>
        </div>
      </main>
    </div>
  );
}
