import createDOMPurify from 'dompurify';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

const DOMPurify =
  typeof window !== 'undefined' ? createDOMPurify(window) : null;

/* ---------- Typoglycemia helpers ---------- */

function scrambleWord(word: string): string {
  if (word.length <= 3) return word;

  const first = word[0];
  const last = word[word.length - 1];
  const middle = word.slice(1, -1).split('');

  for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [middle[i], middle[j]] = [middle[j], middle[i]];
  }

  return first + middle.join('') + last;
}

function scrambleText(text: string): string {
  return text.replace(/\b[a-zA-Z]+\b/g, scrambleWord);
}

/* ---------- Component ---------- */

export const Typoglycemia: FC<{ html: string; intervalMs?: number }> = ({
  html = '',
  intervalMs = 1000,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);

  // 1️⃣ Sanitize ONCE (derived state → no effect)
  const sanitizedHTML = useMemo(() => DOMPurify?.sanitize(html), [html]);

  // 2️⃣ Timer = external system → effect is correct
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, running]);

  // 3️⃣ Apply typoglycemia to text nodes
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (!node.parentElement) continue;

      // Skip code blocks / preformatted text
      if (node.parentElement.closest('code, pre, textarea')) {
        continue;
      }

      node.textContent = scrambleText(node.textContent ?? '');
    }
  }, [tick, sanitizedHTML]);

  return (
    <div className="divide-base-100 flex h-full flex-col divide-y">
      <div className="scrollbar-none h-full w-full overflow-auto p-4 md:p-8">
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML ?? '' }}
          className="markdown-body !bg-base-300 h-full w-full"
        />
      </div>
      <div className="flex justify-end px-4 py-2 md:px-8 md:py-4">
        <button
          onClick={() => setRunning((previous) => !previous)}
          className="btn btn-primary btn-xs">
          {running ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
};
