import {useEffect, useRef, useState, type ReactNode} from 'react';
import {MoreHorizontal} from 'lucide-react';

export function MessageActions({label, children}: {label: string; children: ReactNode}) {
  const root = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const [below, setBelow] = useState(false);

  const close = (restoreFocus = false) => {
    if (!root.current) return;
    root.current.open = false;
    setOpen(false);
    if (restoreFocus) root.current.querySelector('summary')?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return <details
    ref={root}
    className={'message-actions' + (below ? ' opens-below' : '')}
    onToggle={event => {
      const expanded = event.currentTarget.open;
      setOpen(expanded);
      if (expanded) {
        const trigger = event.currentTarget.querySelector('summary')!;
        const panel = event.currentTarget.querySelector('.message-menu')!;
        setBelow(trigger.getBoundingClientRect().top < panel.getBoundingClientRect().height + 12);
      }
    }}
    onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
    }}
  >
    <summary aria-label={label}><MoreHorizontal size={20}/></summary>
    <div className="message-menu" role="group" aria-label={label}
      onClick={event => {
        if ((event.target as Element).closest('button')) close(true);
      }}>
      {children}
    </div>
  </details>;
}
