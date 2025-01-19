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

export default function WritingInterface() {
  const [content, setContent] = useState('');

  return <div className="flex h-screen bg-background">Landing</div>;
}
