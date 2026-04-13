'use client';

import { Typoglycemia } from '@typoglycemia/components/Typoglycemia';
import 'github-markdown-css/github-markdown.css';
import { marked } from 'marked';
import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

// ── CodeMirror ──
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

const INITIAL = `# Typoglycemia

Typoglycemia is a made-up word that comes from typo and hypoglycemia. It describes a popular idea about how people read text. The idea says that readers can understand words even when the letters in the middle are mixed up, as long as the first and last letters stay the same. Many examples of this are shared online to show how “easy” it is to read scrambled text.

However, this idea is often exaggerated. Reading mixed-up words works best when the words are familiar and the sentence gives clear context. If too many letters are changed, or the text is complex, reading becomes much harder. Because of this, typoglycemia is considered an Internet myth rather than proven science.
`;

// ── CodeMirror Component ──
const CodeMirrorEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        keymap.of(defaultKeymap),
        markdown(),
        EditorView.lineWrapping,
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: ref.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div className="font-mono text-sm [&_.cm-content]:p-4 [&_.cm-editor]:bg-transparent [&_.cm-editor]:outline-none [&_.cm-gutters]:border-none [&_.cm-gutters]:bg-transparent">
      <div ref={ref} />
    </div>
  );
};

// ── PAGE ──
const AppPage: NextPage = () => {
  const [{ input, output }, setState] = useState({
    input: INITIAL,
    output: '',
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const setHTML = async () => {
      const html = await marked(input);
      setState((prev) => ({ ...prev, output: html }));
    };
    setHTML();
  }, [input]);

  return (
    <div
      className="bg-base-100 text-base-content min-h-screen font-sans"
      data-theme="luxury">
      {/* ── NAV ── */}
      <div className="navbar bg-base-100/85 border-base-300 sticky top-0 z-50 border-b px-6 backdrop-blur-xl md:px-12">
        <div className="navbar-start">
          <span className="text-primary font-serif text-2xl font-bold tracking-widest">
            Typoglycemia
          </span>
        </div>

        <div className="navbar-end gap-2">
          <button
            className="btn btn-ghost btn-sm hidden md:flex"
            onClick={() => setIsFullscreen((v) => !v)}>
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative mx-auto max-w-5xl px-6 py-20 text-center md:px-12">
        <div className="bg-primary/5 pointer-events-none absolute top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full blur-3xl" />

        <p className="text-primary mb-4 text-xs tracking-[0.2em] uppercase">
          Text experiment
        </p>

        <h1 className="mb-6 font-serif text-5xl leading-tight font-black md:text-6xl">
          Read text that
          <br />
          <span className="text-primary">shouldn't work</span>
        </h1>

        <p className="text-base-content/60 mx-auto max-w-xl text-base md:text-lg">
          Explore typoglycemia — where scrambled words remain surprisingly
          readable. Edit text in real-time and see how your brain adapts.
        </p>
      </section>

      <div className="border-base-300 mx-6 border-t md:mx-12" />

      {/* ── MAIN ── */}
      <section className="mx-auto h-screen max-w-6xl px-6 py-16 md:px-12">
        <div
          className={`grid h-full gap-6 ${
            isFullscreen ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
          }`}>
          {/* Editor */}
          {!isFullscreen && (
            <div className="bg-base-200 border-base-300 flex flex-col overflow-hidden rounded-2xl border">
              <div className="border-base-300 text-base-content/50 border-b px-5 py-3 text-sm">
                Editor
              </div>
              <div className="flex-1 overflow-auto">
                <CodeMirrorEditor
                  value={input}
                  onChange={(val) =>
                    setState((prev) => ({ ...prev, input: val }))
                  }
                />
              </div>
            </div>
          )}

          {/* Output */}
          <div className="bg-base-200 border-base-300 flex flex-col overflow-hidden rounded-2xl border">
            <div className="border-base-300 text-base-content/50 border-b px-5 py-3 text-sm">
              Output
            </div>
            <div className="overflow-auto p-6">
              <Typoglycemia html={output} />
            </div>
          </div>
        </div>
      </section>

      <div className="border-base-300 mx-6 border-t md:mx-12" />

      {/* ── FOOTER ── */}
      <footer className="py-12 text-center">
        <p className="text-primary mb-2 font-serif text-2xl">Typoglycemia</p>
        <p className="text-base-content/40 text-sm">
          Built for curious minds · Inspired by Forma
        </p>
      </footer>
    </div>
  );
};

export default AppPage;
