'use client';

import {
  EditorBubble,
  EditorContent,
  EditorInstance,
  EditorRoot,
  JSONContent,
} from 'novel';
import { useState } from 'react';
import { defaultExtensions } from './extensions';
import { NodeSelector } from './selectors/node-selector';
import { LinkSelector } from './selectors/link-selector';
import { TextButtons } from './selectors/text-buttons';
import { ColorSelector } from './selectors/color-selector';
import GenerativeMenuSwitch from './generative/generative-menu-switch';
import { Separator } from '@/components/ui/separator';
import { useDebouncedCallback } from 'use-debounce';
import { handleCommandNavigation } from 'novel/extensions';

const Editor = ({ initialContent }: { initialContent: JSONContent | null }) => {
  const extensions = [...defaultExtensions];

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [charsCount, setCharsCount] = useState();
  const [saveStatus, setSaveStatus] = useState('Saved');

  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    doc.querySelectorAll('pre code').forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());
      window.localStorage.setItem(
        'html-content',
        highlightCodeblocks(editor.getHTML())
      );
      window.localStorage.setItem('novel-content', JSON.stringify(json));
      window.localStorage.setItem(
        'markdown',
        editor.storage.markdown.getMarkdown()
      );
      setSaveStatus('Saved');
    },
    500
  );

  return (
    <EditorRoot>
      <EditorContent
        immediatelyRender={false}
        key={JSON.stringify(initialContent)}
        // @ts-expect-error: not null
        initialContent={initialContent}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class:
              'prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full',
          },
        }}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);
          setSaveStatus('Unsaved');
        }}
      >
        <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </GenerativeMenuSwitch>
      </EditorContent>
    </EditorRoot>
  );
};

export default Editor;
