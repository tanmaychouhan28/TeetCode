import React, { useRef, useCallback } from 'react';

/* ─── VS Code Token Colors ─────────────────────────────────────────────── */
const C = {
  keyword:   '#569CD6',
  type:      '#4EC9B0',
  builtin:   '#C586C0',
  string:    '#CE9178',
  number:    '#B5CEA8',
  comment:   '#6A9955',
  operator:  '#D4D4D4',
  func:      '#DCDCAA',
  macro:     '#C8A0E4',
  plain:     '#D4D4D4',
  variable:  '#9CDCFE',
  className: '#4EC9B0',
};

type Token = { text: string; color: string };

/* ─── C++ Tokeniser ─────────────────────────────────────────────────────── */
function tokenizeCpp(code: string): Token[] {
  const KW = new Set(['alignas','alignof','and','and_eq','asm','auto','bitand','bitor','bool','break','case','catch','char','char8_t','char16_t','char32_t','class','compl','concept','const','consteval','constexpr','constinit','const_cast','continue','co_await','co_return','co_yield','decltype','default','delete','do','double','dynamic_cast','else','enum','explicit','export','extern','false','float','for','friend','goto','if','inline','int','long','mutable','namespace','new','noexcept','not','not_eq','nullptr','operator','or','or_eq','private','protected','public','register','reinterpret_cast','requires','return','short','signed','sizeof','static','static_assert','static_cast','struct','switch','template','this','thread_local','throw','true','try','typedef','typeid','typename','union','unsigned','using','virtual','void','volatile','wchar_t','while','xor','xor_eq']);
  const TY = new Set(['string','vector','map','set','unordered_map','unordered_set','queue','stack','deque','list','pair','tuple','array','optional','variant','any','function','shared_ptr','unique_ptr','weak_ptr','size_t','int8_t','int16_t','int32_t','int64_t','uint8_t','uint16_t','uint32_t','uint64_t','ptrdiff_t','ofstream','ifstream','fstream','stringstream']);
  const BI = new Set(['cout','cin','cerr','endl','flush','printf','scanf','abs','max','min','sort','reverse','find','begin','end','size','empty','push_back','pop_back','front','back','insert','erase','clear','count','lower_bound','upper_bound','make_pair','make_shared','make_unique','move','forward','swap','fill','copy','accumulate','transform']);
  const tokens: Token[] = [];
  let i = 0;
  while (i < code.length) {
    if (code[i] === '#') {
      let j = i; while (j < code.length && code[j] !== '\n') j++;
      tokens.push({ text: code.slice(i, j), color: C.macro }); i = j; continue;
    }
    if (code.slice(i,i+2) === '//') {
      let j = i; while (j < code.length && code[j] !== '\n') j++;
      tokens.push({ text: code.slice(i, j), color: C.comment }); i = j; continue;
    }
    if (code.slice(i,i+2) === '/*') {
      let j = i+2; while (j < code.length && code.slice(j,j+2) !== '*/') j++;
      j = Math.min(j+2, code.length);
      tokens.push({ text: code.slice(i, j), color: C.comment }); i = j; continue;
    }
    if (code[i] === '"') {
      let j = i+1; while (j < code.length && (code[j] !== '"' || code[j-1] === '\\') && code[j] !== '\n') j++;
      if (j < code.length && code[j] === '"') j++;
      tokens.push({ text: code.slice(i, j), color: C.string }); i = j; continue;
    }
    if (code[i] === "'") {
      let j = i+1; while (j < code.length && (code[j] !== "'" || code[j-1] === '\\') && code[j] !== '\n') j++;
      if (j < code.length && code[j] === "'") j++;
      tokens.push({ text: code.slice(i, j), color: C.string }); i = j; continue;
    }
    if (/[0-9]/.test(code[i]) || (code[i]==='.' && /[0-9]/.test(code[i+1]||''))) {
      let j = i; while (j < code.length && /[0-9a-fA-FxXeE._ulUL]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), color: C.number }); i = j; continue;
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i; while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      const after = code.slice(j).trimStart();
      let color = C.plain;
      if (KW.has(word)) color = C.keyword;
      else if (TY.has(word)) color = C.type;
      else if (BI.has(word)) color = C.builtin;
      else if (after.startsWith('(')) color = C.func;
      else if (/^[A-Z]/.test(word)) color = C.className;
      else color = C.variable;
      tokens.push({ text: word, color }); i = j; continue;
    }
    tokens.push({ text: code[i], color: C.operator }); i++;
  }
  return tokens;
}

/* ─── Python Tokeniser ──────────────────────────────────────────────────── */
function tokenizePython(code: string): Token[] {
  const KW = new Set(['False','None','True','and','as','assert','async','await','break','class','continue','def','del','elif','else','except','finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield']);
  const BI = new Set(['abs','all','any','bin','bool','bytes','callable','chr','dict','dir','divmod','enumerate','eval','exec','filter','float','format','frozenset','getattr','globals','hasattr','hash','help','hex','id','input','int','isinstance','issubclass','iter','len','list','locals','map','max','min','next','object','oct','open','ord','pow','print','property','range','repr','reversed','round','set','setattr','slice','sorted','staticmethod','str','sum','super','tuple','type','vars','zip']);
  const tokens: Token[] = [];
  let i = 0;
  while (i < code.length) {
    if (code[i] === '#') {
      let j = i; while (j < code.length && code[j] !== '\n') j++;
      tokens.push({ text: code.slice(i, j), color: C.comment }); i = j; continue;
    }
    if (code.slice(i,i+3) === '"""' || code.slice(i,i+3) === "'''") {
      const q = code.slice(i,i+3); let j = i+3;
      while (j < code.length && code.slice(j,j+3) !== q) j++;
      j = Math.min(j+3, code.length);
      tokens.push({ text: code.slice(i, j), color: C.string }); i = j; continue;
    }
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i+1;
      while (j < code.length && (code[j] !== q || code[j-1] === '\\') && code[j] !== '\n') j++;
      if (j < code.length && code[j] === q) j++;
      tokens.push({ text: code.slice(i, j), color: C.string }); i = j; continue;
    }
    if (/[0-9]/.test(code[i])) {
      let j = i; while (j < code.length && /[0-9a-fA-FxXeE._jJ]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), color: C.number }); i = j; continue;
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i; while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      const after = code.slice(j).trimStart();
      let color = C.plain;
      if (KW.has(word)) color = C.keyword;
      else if (BI.has(word)) color = C.builtin;
      else if (after.startsWith('(')) color = C.func;
      else if (/^[A-Z]/.test(word)) color = C.className;
      else color = C.variable;
      tokens.push({ text: word, color }); i = j; continue;
    }
    tokens.push({ text: code[i], color: C.operator }); i++;
  }
  return tokens;
}

/* ─── JavaScript Tokeniser ──────────────────────────────────────────────── */
function tokenizeJS(code: string): Token[] {
  const KW = new Set(['async','await','break','case','catch','class','const','continue','debugger','default','delete','do','else','export','extends','false','finally','for','from','function','if','import','in','instanceof','let','new','null','of','return','static','super','switch','this','throw','true','try','typeof','undefined','var','void','while','with','yield']);
  const BI = new Set(['Array','Boolean','console','Date','Error','Function','JSON','Map','Math','Number','Object','Promise','RegExp','Set','String','Symbol','WeakMap','WeakSet','Infinity','NaN','parseInt','parseFloat','fetch','document','window','process','require','module','exports']);
  const tokens: Token[] = [];
  let i = 0;
  while (i < code.length) {
    if (code.slice(i,i+2) === '//') {
      let j = i; while (j < code.length && code[j] !== '\n') j++;
      tokens.push({ text: code.slice(i, j), color: C.comment }); i = j; continue;
    }
    if (code.slice(i,i+2) === '/*') {
      let j = i+2; while (j < code.length && code.slice(j,j+2) !== '*/') j++;
      j = Math.min(j+2, code.length);
      tokens.push({ text: code.slice(i, j), color: C.comment }); i = j; continue;
    }
    if (code[i] === '`') {
      let j = i+1; while (j < code.length && code[j] !== '`') j++;
      if (j < code.length) j++;
      tokens.push({ text: code.slice(i, j), color: C.string }); i = j; continue;
    }
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i+1;
      while (j < code.length && (code[j] !== q || code[j-1] === '\\') && code[j] !== '\n') j++;
      if (j < code.length && code[j] === q) j++;
      tokens.push({ text: code.slice(i, j), color: C.string }); i = j; continue;
    }
    if (/[0-9]/.test(code[i])) {
      let j = i; while (j < code.length && /[0-9a-fA-FxXeE._n]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), color: C.number }); i = j; continue;
    }
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i; while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      const after = code.slice(j).trimStart();
      let color = C.plain;
      if (KW.has(word)) color = C.keyword;
      else if (BI.has(word)) color = C.builtin;
      else if (after.startsWith('(') || after.startsWith('=>')) color = C.func;
      else if (/^[A-Z]/.test(word)) color = C.className;
      else color = C.variable;
      tokens.push({ text: word, color }); i = j; continue;
    }
    tokens.push({ text: code[i], color: C.operator }); i++;
  }
  return tokens;
}

function tokenize(code: string, lang: string): Token[] {
  try {
    if (lang === 'cpp') return tokenizeCpp(code);
    if (lang === 'python') return tokenizePython(code);
    if (lang === 'javascript') return tokenizeJS(code);
    return [{ text: code, color: C.plain }];
  } catch {
    return [{ text: code, color: C.plain }];
  }
}

function renderHtml(tokens: Token[]): string {
  return tokens.map(t => {
    const safe = t.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<span style="color:${t.color}">${safe}</span>`;
  }).join('');
}

/* ─── Main Component ────────────────────────────────────────────────────── */
interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language: string;
}

const TAB = '    ';

const SHARED: React.CSSProperties = {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  margin: 0,
  padding: '12px 16px',
  whiteSpace: 'pre',
  wordWrap: 'normal' as const,
  overflow: 'auto',
  fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace",
  fontSize: '13px',
  lineHeight: '1.65',
  tabSize: 4,
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  const taRef  = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const syncScroll = useCallback(() => {
    if (taRef.current && preRef.current) {
      preRef.current.scrollTop  = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const { selectionStart: s, selectionEnd: en, value: v } = ta;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const lineStart = v.lastIndexOf('\n', s - 1) + 1;
        const line = v.slice(lineStart);
        const strip = line.startsWith(TAB) ? TAB.length : line.startsWith(' ') ? 1 : 0;
        if (strip > 0) {
          onChange(v.slice(0, lineStart) + v.slice(lineStart + strip));
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = Math.max(s - strip, lineStart); });
        }
      } else {
        onChange(v.slice(0, s) + TAB + v.slice(en));
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + TAB.length; });
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = v.lastIndexOf('\n', s - 1) + 1;
      const indent = (v.slice(lineStart, s).match(/^(\s*)/) ?? ['',''])[1];
      const lastChar = v.slice(lineStart, s).trimEnd().slice(-1);
      const extra = ['{','(','['].includes(lastChar) ? TAB : '';
      const ins = '\n' + indent + extra;
      onChange(v.slice(0, s) + ins + v.slice(en));
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + ins.length; });
      return;
    }

    // Auto-close
    const pairs: Record<string, string> = {'{':'}','(':')','[':']','"':'"',"'":"'"};
    if (pairs[e.key] && s === en) {
      e.preventDefault();
      onChange(v.slice(0, s) + e.key + pairs[e.key] + v.slice(en));
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 1; });
    }
  }, [onChange]);

  const html = renderHtml(tokenize(value, language)) + '\n';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#1E1E1E', overflow: 'hidden' }}>
      <pre
        ref={preRef}
        aria-hidden
        style={{ ...SHARED, background: 'transparent', color: C.plain, pointerEvents: 'none', userSelect: 'none' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <textarea
        ref={taRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        style={{
          ...SHARED,
          background: 'transparent',
          color: 'transparent',
          caretColor: '#AEAFAD',
          border: 'none',
          outline: 'none',
          resize: 'none',
          WebkitTextFillColor: 'transparent',
        }}
      />
    </div>
  );
};

export default CodeEditor;
