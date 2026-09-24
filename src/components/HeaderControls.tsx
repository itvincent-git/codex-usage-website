import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

type Link = { label: string; href: string };
type Props = { languageLabel: string; menuLabel: string; currentLanguage: string; languages: Link[]; links: Link[]; download: Link };

export default function HeaderControls({ languageLabel, menuLabel, currentLanguage, languages, links, download }: Props) {
  const [open, setOpen] = useState(false);
  return <div className="header-controls">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="language-trigger" aria-label={languageLabel}>
        <span className="language-globe" aria-hidden="true">◎</span>{currentLanguage}<ChevronDown size={14} strokeWidth={2} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="language-menu" sideOffset={10} align="end">
          {languages.map((item) => <DropdownMenu.Item className="language-item" key={item.href} asChild><a href={item.href}>{item.label}</a></DropdownMenu.Item>)}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="mobile-trigger" aria-label={menuLabel}><Menu size={22} /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-overlay" />
        <Dialog.Content className="mobile-panel" aria-describedby={undefined}>
          <div className="mobile-panel-top"><Dialog.Title>Codex Usage Desktop</Dialog.Title><Dialog.Close aria-label="Close menu"><X size={22} /></Dialog.Close></div>
          <nav aria-label={menuLabel}>{links.map((item) => <a onClick={() => setOpen(false)} key={item.href} href={item.href}>{item.label}</a>)}</nav>
          <a className="button button-primary mobile-download" href={download.href}>{download.label}</a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
