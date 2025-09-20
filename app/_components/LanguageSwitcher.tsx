'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (!isMounted) {
    return <div className="w-[120px] h-10 bg-slate-800/50 rounded-md animate-pulse" />;
  }

  return (
    <Select onValueChange={handleLanguageChange} value={i18n.language}>
      <SelectTrigger className="w-[170px] bg-slate-800/50 border-slate-700">
        <SelectValue placeholder="Change language" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700 text-slate-50">
        <SelectGroup>
        <SelectLabel>Languages</SelectLabel>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">हिन्दी</SelectItem>
        <SelectItem value="mr">मराठी</SelectItem>
        <SelectItem value="gu">ગુજરાતી</SelectItem>
        {/* Add more languages here */}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}