import { useState } from 'react';
import { useSchools, useSchoolFilters } from '@/hooks/use-schools';
import { SchoolCard } from '@/components/SchoolCard';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, FilterX, Download, Lock } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function Data() {
    const [, setLocation] = useLocation();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { toast } = useToast();
    const searchParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        state: searchParams.get('state') || 'all',
        type: searchParams.get('type') || 'all',
        level: searchParams.get('level') || 'all',
        limit: 100,
    });

    const { data: schoolsData, isLoading: isSchoolsLoading } = useSchools({
        ...filters,
        state: filters.state === 'all' ? undefined : filters.state,
        type: filters.type === 'all' ? undefined : filters.type,
        level: filters.level === 'all' ? undefined : filters.level,
        search: filters.search || undefined,
    });

    const { data: filterOptions, isLoading: isFiltersLoading } =
        useSchoolFilters();

    const clearFilters = () => {
        setFilters({
            search: '',
            state: 'all',
            type: 'all',
            level: 'all',
            limit: 100,
        });
    };

    /**
     * Native CSV Download (Replaces XLSX library)
     */
    const downloadCSV = () => {
        if (!isAuthenticated) {
            setLocation('/auth');
            return;
        }

        if (!schoolsData?.data || schoolsData.data.length === 0) {
            toast({
                title: 'No data',
                description:
                    'There is no data to download with current filters.',
                variant: 'destructive',
            });
            return;
        }

        // Prepare CSV headers
        const headers = [
            'Name',
            'State',
            'Type',
            'Level',
            'Latitude',
            'Longitude',
        ];
        const rows = schoolsData.data.map(s => [
            `"${s.name}"`,
            `"${s.state}"`,
            `"${s.type}"`,
            `"${s.level}"`,
            s.latitude,
            s.longitude,
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.setAttribute('href', url);
        link.setAttribute('download', 'ubec_school_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hasActiveFilters =
        filters.search ||
        filters.state !== 'all' ||
        filters.type !== 'all' ||
        filters.level !== 'all';

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 font-sans">
            <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background relative">
                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 p-4 sticky top-0 z-30 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            School Database
                        </h1>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadCSV}
                            className="h-8 gap-1 text-xs"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search schools..."
                                className="pl-9 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                                value={filters.search}
                                onChange={e =>
                                    setFilters({
                                        ...filters,
                                        search: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                            <Select
                                value={filters.state}
                                onValueChange={val =>
                                    setFilters({ ...filters, state: val })
                                }
                            >
                                <SelectTrigger className="w-[120px] h-9 text-xs bg-white dark:bg-zinc-800 border-gray-200">
                                    <SelectValue placeholder="State" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All States
                                    </SelectItem>
                                    {filterOptions?.states.map(state => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.type}
                                onValueChange={val =>
                                    setFilters({ ...filters, type: val })
                                }
                            >
                                <SelectTrigger className="w-[110px] h-9 text-xs bg-white dark:bg-zinc-800 border-gray-200">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    {filterOptions?.types.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.level}
                                onValueChange={val =>
                                    setFilters({ ...filters, level: val })
                                }
                            >
                                <SelectTrigger className="w-[110px] h-9 text-xs bg-white dark:bg-zinc-800 border-gray-200">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Levels
                                    </SelectItem>
                                    {filterOptions?.levels.map(level => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <main className="flex-1 p-4 bg-gray-50/50 dark:bg-background">
                    {hasActiveFilters && (
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-500">
                                {schoolsData?.total
                                    ? `${schoolsData.total} results`
                                    : 'Searching...'}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={clearFilters}
                            >
                                <FilterX className="w-3 h-3 mr-1" />
                                Clear
                            </Button>
                        </div>
                    )}

                    <div className="space-y-3">
                        {isSchoolsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <p className="text-sm">
                                    Loading schools data...
                                </p>
                            </div>
                        ) : schoolsData?.data && schoolsData.data.length > 0 ? (
                            schoolsData.data.map(school => (
                                <Link
                                    key={school.id}
                                    href={`/data/${school.id}`}
                                >
                                    <div>
                                        <SchoolCard school={school} />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-20 px-4">
                                <div className="bg-gray-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                    No schools found
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Try adjusting your search or filters.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </main>

                <BottomNav />
            </div>
        </div>
    );
}
