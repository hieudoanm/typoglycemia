import createDOMPurify from 'dompurify';
import html2canvas from 'html2canvas-pro';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

const DOMPurify =
  typeof window !== 'undefined' ? createDOMPurify(window) : null;

/* ---------- Typoglycemia helpers ---------- */

const scrambleWord = (word: string): string => {
  if (word.length <= 3) return word;

  const first = word[0];
  const last = word[word.length - 1];
  const middle = word.slice(1, -1).split('');

  // Determine how scrambled it should be (longer words → more shuffling)
  const shuffleTimes = Math.min(
    middle.length,
    2 + Math.floor(Math.random() * 3),
  );

  for (let n = 0; n < shuffleTimes; n++) {
    // Pick two random positions in middle and swap
    const i = Math.floor(Math.random() * middle.length);
    let j = Math.floor(Math.random() * middle.length);

    // Ensure i != j
    if (i === j) j = (j + 1) % middle.length;

    [middle[i], middle[j]] = [middle[j], middle[i]];
  }

  // Prevent returning original middle if too short
  if (middle.join('') === word.slice(1, -1)) {
    if (middle.length > 1) {
      [middle[0], middle[middle.length - 1]] = [
        middle[middle.length - 1],
        middle[0],
      ];
    }
  }

  return first + middle.join('') + last;
};

const scrambleText = (text: string): string => {
  return text.replace(/\b[a-zA-Z]+\b/g, scrambleWord);
};

/* ---------- Component ---------- */

export const Typoglycemia: FC<{ html: string; intervalMs?: number }> = ({
  html = '',
  intervalMs = 1000,
}) => {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);

  const sanitizedHTML = useMemo(() => DOMPurify?.sanitize(html), [html]);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, running]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (!node.parentElement) continue;
      if (node.parentElement.closest('code, pre, textarea')) continue;
      node.textContent = scrambleText(node.textContent ?? '');
    }
  }, [tick, sanitizedHTML]);

  // ---------- Convert to Image ----------
  const handleSaveAsImage = async () => {
    if (!imageRef.current) return;

    const canvas = await html2canvas(imageRef.current, {
      backgroundColor: null, // preserves transparent background if any
      scale: 2, // higher resolution
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'typoglycemia.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="divide-base-300 flex h-full flex-col divide-y">
      <div
        ref={imageRef}
        className="scrollbar-none h-full w-full overflow-auto p-4 md:p-8">
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML ?? '' }}
          className="markdown-body !bg-base-100 !text-base-content h-full w-full"
        />
      </div>

      <div className="flex justify-end gap-2 px-4 py-2 md:px-8 md:py-4">
        <button
          onClick={() => setRunning((prev) => !prev)}
          className="btn btn-ghost btn-sm">
          {running ? '⏸️ Stop' : '▶️ Shuffle'}
        </button>

        <button onClick={handleSaveAsImage} className="btn btn-ghost btn-sm">
          🖼️ Save
        </button>
      </div>
    </div>
  );
};
