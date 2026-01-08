import { Typoglycemia } from '@typoglycemia/components/Typoglycemia';
import 'github-markdown-css/github-markdown.css';
import { marked } from 'marked';
import { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';

const INITIAL = `# Typoglycemia

Typoglycemia is a made-up word that comes from typo and hypoglycemia. It describes a popular idea about how people read text. The idea says that readers can understand words even when the letters in the middle are mixed up, as long as the first and last letters stay the same. Many examples of this are shared online to show how “easy” it is to read scrambled text.

However, this idea is often exaggerated. Reading mixed-up words works best when the words are familiar and the sentence gives clear context. If too many letters are changed, or the text is complex, reading becomes much harder. Because of this, typoglycemia is considered an Internet myth rather than proven science.`;

export const countWords = (text: string): number => {
  return (text.match(/\b[\p{L}\p{N}']+\b/gu) ?? []).length;
};

const HomePage: NextPage = () => {
  const [{ input = INITIAL, output = '' }, setState] = useState<{
    input: string;
    output: string;
  }>({
    input: INITIAL,
    output: '',
  });

  useEffect(() => {
    const setHTML = async () => {
      const output: string = await marked(input);
      setState((previous) => ({ ...previous, output: output }));
    };
    setHTML();
  }, [input]);

  return (
    <div className="divide-base-100 bg-base-300 flex h-screen w-screen flex-col divide-y">
      <nav>
        <div className="px-4 py-2 md:px-8 md:py-4">
          <span className="font-black">Typoglycemia</span>
        </div>
      </nav>
      <div className="grow">
        <div className="divide-base-100 grid h-full grid-cols-2 divide-x">
          <div className="col-span-1">
            <div className="divide-base-100 flex h-full flex-col divide-y">
              <textarea
                id="input"
                name="input"
                placeholder="Input"
                className="w-full grow p-4 md:p-8"
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setState((previous) => ({
                    ...previous,
                    input: event.target.value,
                  }));
                }}></textarea>
              <div className="px-4 py-2 md:px-8 md:py-4">
                {countWords(input)} words
              </div>
            </div>
          </div>
          <div className="col-span-1 overflow-hidden">
            <Typoglycemia html={output} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
