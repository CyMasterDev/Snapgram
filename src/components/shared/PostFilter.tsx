import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

const PostFilter = ({ selectedSort, setSelectedSort }: { selectedSort: string, setSelectedSort: React.Dispatch<React.SetStateAction<string>> }) => {

    const handleSortChange = (sortOption: string) => {
            setSelectedSort(sortOption)
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base-medium text-light-2">{selectedSort}</p>
                    <img
                        src="/assets/icons/filter.svg"
                        width={20}
                        height={20}
                        alt="filter"
                        draggable="false"
                        className="select-none"
                    />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 bg-dark-3 rounded-2xl p-3 border-none select-none">
                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-light-2 base-medium">Filter by</DropdownMenuLabel>

                <div className="p-2">
                    <DropdownMenuItem onClick={() => handleSortChange("All")} className="text-light-4 cursor-pointer">
                        All
                    </DropdownMenuItem>

                    {/* Combined Accordion */}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="trending">
                            <AccordionTrigger className="text-light-4 text-left no-underline small-regular cursor-pointer px-2 py-1.5">
                                Trending
                            </AccordionTrigger>
                            <AccordionContent className="border-none ml-3">
                                <DropdownMenuItem onClick={() => handleSortChange("Trending This Month")} className="text-light-4 cursor-pointer">This Month</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Trending This Week")} className="text-light-4 cursor-pointer">This Week</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Trending Today")} className="text-light-4 cursor-pointer">Today</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Trending Now")} className="text-light-4 cursor-pointer">Now</DropdownMenuItem>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="liked">
                            <AccordionTrigger className="text-light-4 text-left no-underline small-regular cursor-pointer px-2 py-1.5">
                                Most Liked
                            </AccordionTrigger>
                            <AccordionContent className="border-none ml-3">
                                <DropdownMenuItem onClick={() => handleSortChange("Most Liked All Time")} className="text-light-4 cursor-pointer">All Time</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Liked This Year")} className="text-light-4 cursor-pointer">This Year</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Liked This Month")} className="text-light-4 cursor-pointer">This Month</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Liked This Week")} className="text-light-4 cursor-pointer">This Week</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Liked Today")} className="text-light-4 cursor-pointer">Today</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Liked This Hour")} className="text-light-4 cursor-pointer">This Hour</DropdownMenuItem>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="commented">
                            <AccordionTrigger className="text-light-4 text-left no-underline small-regular cursor-pointer px-2 py-1.5">
                                Most Commented
                            </AccordionTrigger>
                            <AccordionContent className="border-none ml-3">
                                <DropdownMenuItem onClick={() => handleSortChange("Most Commented All Time")} className="text-light-4 cursor-pointer">All Time</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Commented This Year")} className="text-light-4 cursor-pointer">This Year</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Commented This Month")} className="text-light-4 cursor-pointer">This Month</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Commented This Week")} className="text-light-4 cursor-pointer">This Week</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Commented Today")} className="text-light-4 cursor-pointer">Today</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange("Most Commented This Hour")} className="text-light-4 cursor-pointer">This Hour</DropdownMenuItem>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <DropdownMenuSeparator />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PostFilter;
