import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

type Link = { label: string; href: string };
type Props = { languageLabel: string; menuLabel: string; currentLanguage: string; languages: Link[]; links: Link[]; download: Link };

export default function HeaderControls({ languageLabel, menuLabel, currentLanguage, languages, links, download }: Props) {
  const [open, setOpen] = useState(false);
  return <div className="header-controls flex items-center gap-4 max-[700px]:gap-[3px]">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="language-trigger flex items-center gap-[7px] border-0 bg-transparent p-2 text-[13px] font-semibold text-[#626979] max-[700px]:text-[0px] max-[700px]:[&_svg]:hidden dark:text-[#bec0ca]" aria-label={languageLabel}>
        <span className="language-globe text-[21px] leading-[10px] max-[700px]:text-2xl" aria-hidden="true">◎</span>{currentLanguage}<ChevronDown size={14} strokeWidth={2} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="language-menu z-50 min-w-[150px] rounded-[14px] border border-[#e9e5ec] bg-white p-[7px] shadow-[0_18px_40px_#2423381a] dark:border-[#39404e] dark:bg-[#242a35]" sideOffset={10} align="end">
          {languages.map((item) => <DropdownMenu.Item className="language-item block rounded-lg p-[10px_12px] text-sm outline-none hover:bg-[#f3edfc] focus:bg-[#f3edfc] dark:hover:bg-[#373049] dark:focus:bg-[#373049]" key={item.href} asChild><a href={item.href}>{item.label}</a></DropdownMenu.Item>)}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="mobile-trigger hidden items-center gap-[7px] border-0 bg-transparent p-2 text-[#626979] max-[700px]:flex" aria-label={menuLabel}><Menu size={22} /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-overlay fixed inset-0 z-[49] bg-[#1b19397a]" />
        <Dialog.Content className="mobile-panel fixed inset-y-0 right-0 z-50 h-screen w-[min(360px,90vw)] bg-[#faf9f7] p-6 shadow-[-20px_0_50px_#0002] dark:bg-[#202530]" aria-describedby={undefined}>
          <div className="mobile-panel-top flex items-center justify-between gap-3 font-bold [&_button]:border-0 [&_button]:bg-transparent"><Dialog.Title>Codex Usage Desktop</Dialog.Title><Dialog.Close aria-label="Close menu"><X size={22} /></Dialog.Close></div>
          <nav aria-label={menuLabel}>{links.map((item) => <a onClick={() => setOpen(false)} key={item.href} href={item.href}>{item.label}</a>)}</nav>
          <a className="button inline-flex min-h-13 items-center justify-center gap-4 rounded-2xl border border-surface-border bg-white px-6 text-[15px] font-bold transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_#463e6540] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#8e6ed8] dark:border-night-border dark:bg-night-surface dark:text-[#f2eff8] button-primary !border-brand !bg-brand text-white shadow-[0_8px_20px_#6553a62b] dark:!border-brand dark:!bg-brand dark:text-white mobile-download mt-7 w-full" href={download.href}>{download.label}</a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
