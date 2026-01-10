import { Editor } from '@typoglycemia/components/Editor';
import { Typoglycemia } from '@typoglycemia/components/Typoglycemia';
import { Theme, useTheme } from '@typoglycemia/hooks/use-theme';
import 'github-markdown-css/github-markdown.css';
import { marked } from 'marked';
import { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';

const INITIAL = `# Typoglycemia

Typoglycemia is a made-up word that comes from typo and hypoglycemia. It describes a popular idea about how people read text. The idea says that readers can understand words even when the letters in the middle are mixed up, as long as the first and last letters stay the same. Many examples of this are shared online to show how “easy” it is to read scrambled text.

However, this idea is often exaggerated. Reading mixed-up words works best when the words are familiar and the sentence gives clear context. If too many letters are changed, or the text is complex, reading becomes much harder. Because of this, typoglycemia is considered an Internet myth rather than proven science.
`;

const HomePage: NextPage = () => {
  const [{ input, output }, setState] = useState({
    input: INITIAL,
    output: '',
  });

  const { theme, toggleTheme } = useTheme(Theme.DARK);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const setHTML = async () => {
      const html = await marked(input);
      setState((prev) => ({ ...prev, output: html }));
    };
    setHTML();
  }, [input]);

  return (
    <div className="divide-base-300 bg-base-100 flex h-screen w-screen flex-col divide-y">
      {/* ---------- NAV ---------- */}
      <nav className="flex items-center justify-between px-4 py-2 md:px-8 md:py-4">
        <span className="font-night">Typoglycemia</span>

        <div className="flex gap-2">
          {/* Fullscreen toggle */}
          <button
            className="btn btn-ghost btn-sm hidden md:flex"
            onClick={() => setIsFullscreen((v) => !v)}>
            {isFullscreen ? '📘 Exit' : '📖 Fullscreen'}
          </button>

          {/* Theme toggle */}
          <button className="btn btn-ghost btn-sm" onClick={toggleTheme}>
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>

      {/* ---------- CONTENT ---------- */}
      <div className="grow">
        <div
          className={`grid h-full ${
            isFullscreen
              ? 'grid-cols-1'
              : 'grid-cols-1 md:grid-cols-2 md:divide-x'
          } divide-base-300`}>
          {/* Editor (hidden in fullscreen OR on mobile) */}
          {!isFullscreen && (
            <div className="col-span-1 hidden md:block">
              <Editor
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setState((prev) => ({
                    ...prev,
                    input: event.target.value,
                  }));
                }}
              />
            </div>
          )}

          {/* Typoglycemia */}
          <div className="col-span-1 overflow-hidden">
            <Typoglycemia html={output} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
