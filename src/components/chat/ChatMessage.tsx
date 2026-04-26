"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    marked: { parse: (s: string) => string };
    katex: { renderToString: (s: string, o: object) => string };
  }
}

function renderContent(text: string): string {
  if (typeof window === "undefined" || !window.marked || !window.katex) return text;
  const withKatex = text
    .replace(/\$\$([^$]+)\$\$/g, (_, expr) => {
      try { return window.katex.renderToString(expr, { displayMode: true }); }
      catch { return _; }
    })
    .replace(/\$([^$\n]+)\$/g, (_, expr) => {
      try { return window.katex.renderToString(expr, { displayMode: false }); }
      catch { return _; }
    });
  return window.marked.parse(withKatex);
}

type ChatMessageProps = {
  message: string;
  accentColor: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
};

export const ChatMessage = ({ name, message, accentColor, isSelf, hideName }: ChatMessageProps) => {
  const [html, setHtml] = useState(message);

  useEffect(() => {
    const tryRender = () => {
      if (window.marked && window.katex) setHtml(renderContent(message));
      else setTimeout(tryRender, 100);
    };
    tryRender();
  }, [message]);

  return (
    <div className={`flex flex-col gap-1 ${hideName ? "pt-0" : "pt-6"}`}>
      {!hideName && (
        <div className={`text-${isSelf ? "gray-700" : accentColor + "-800"} uppercase text-xs`}>
          {name}
        </div>
      )}
      <div
        className={`pr-4 text-${isSelf ? "gray-300" : accentColor + "-500"} text-sm ${isSelf ? "" : "drop-shadow-" + accentColor}
          [&_table]:border-collapse [&_table]:my-2 [&_table]:w-full
          [&_td]:border [&_td]:border-gray-600 [&_td]:px-2 [&_td]:py-1
          [&_th]:border [&_th]:border-gray-500 [&_th]:px-2 [&_th]:py-1 [&_th]:bg-gray-800
          [&_strong]:font-bold [&_code]:bg-gray-800 [&_code]:px-1 [&_code]:rounded
          [&_pre]:bg-gray-800 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
