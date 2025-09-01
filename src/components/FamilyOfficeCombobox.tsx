import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';

interface FamilyOffice {
  id: string;
  name: string;
}

interface FamilyOfficeComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FamilyOfficeCombobox({ 
  value, 
  onChange, 
  placeholder = "Search or create family office..." 
}: FamilyOfficeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [familyOffices, setFamilyOffices] = useState<FamilyOffice[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchFamilyOffices = async (query: string) => {
    if (!query.trim()) {
      setFamilyOffices([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('family_offices')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(10);

      if (error) throw error;
      setFamilyOffices(data || []);
    } catch (error) {
      console.error('Error searching family offices:', error);
      setFamilyOffices([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchFamilyOffices(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
  };

  const handleCreateNew = () => {
    if (searchQuery.trim()) {
      onChange(searchQuery.trim());
      setOpen(false);
    }
  };

  const selectedOffice = familyOffices.find(office => office.name === value);
  const showCreateOption = searchQuery.trim() && 
    !familyOffices.some(office => office.name.toLowerCase() === searchQuery.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 text-base font-normal"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search family offices..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isSearching && (
              <div className="py-2 px-4 text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            
            {!isSearching && familyOffices.length === 0 && searchQuery && (
              <CommandEmpty>No family offices found.</CommandEmpty>
            )}

            {!isSearching && familyOffices.map((office) => (
              <CommandItem
                key={office.id}
                value={office.name}
                onSelect={() => handleSelect(office.name)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === office.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {office.name}
              </CommandItem>
            ))}

            {showCreateOption && (
              <CommandItem
                value={searchQuery}
                onSelect={handleCreateNew}
                className="text-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create "{searchQuery}"
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}