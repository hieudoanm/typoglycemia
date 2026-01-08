import { ChangeEventHandler, FC, useRef, useState } from 'react';

export const countWords = (text: string): number => {
  return (text.match(/\b[\p{L}\p{N}']+\b/gu) ?? []).length;
};

export const Editor: FC<{
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectedWordCount, setSelectedWordCount] = useState<number>(0);

  const handleSelect = () => {
    if (!textareaRef.current) return;

    const selection = textareaRef.current.value.substring(
      textareaRef.current.selectionStart,
      textareaRef.current.selectionEnd,
    );

    const words = selection.match(/\b[\p{L}\p{N}']+\b/gu) ?? [];
    setSelectedWordCount(words.length);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      alert('Copy to Clipboard');
    } catch {
      // Fallback (older browsers)
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Copy to Clipboard');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();

      // Manually trigger onChange-compatible event
      onChange({
        target: { value: text },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } catch (error) {
      console.error(error);
      alert('Paste permission denied');
    }
  };

  return (
    <div className="divide-base-300 flex h-full flex-col divide-y">
      <textarea
        ref={textareaRef}
        id="input"
        name="input"
        placeholder="Input"
        className="w-full grow p-4 focus:outline-none md:p-8"
        value={value}
        onChange={onChange}
        onSelect={handleSelect} // fires when user selects text
      />

      <div className="flex items-center justify-between px-4 py-2 md:px-8 md:py-4">
        <span className="text-sm">
          {countWords(value)} words
          {selectedWordCount > 0 && <> · {selectedWordCount} selected</>}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleCopy}>
            📄 Copy
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handlePaste}>
            📋 Paste
          </button>
        </div>
      </div>
    </div>
  );
};
