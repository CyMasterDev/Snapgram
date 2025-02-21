import { Models } from "appwrite";
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

interface PostFilterProps {
    selectedSort: string;
    setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
    setSortedPosts: React.Dispatch<React.SetStateAction<Models.Document[]>>;
    fetchedPosts: Models.Document[];
    searchedPosts: Models.Document[];
    isSearchActive: boolean;
}

export const getTimeframeLimit = (sortOption: string): number => {
    const now = new Date().getTime();
    const timeframeOptions = {
        "All": 0,
        "Top Liked All Time": 0,
        "Top Liked This Year": 0,
        "Trending Now": now - 60 * 60 * 1000, // 1 hour
        "Top Liked This Hour": now - 60 * 60 * 1000, // 1 hour
        "Trending Today": now - 24 * 60 * 60 * 1000, // 1 day
        "Top Liked Today": now - 24 * 60 * 60 * 1000, // 1 day
        "Trending This Week": now - 7 * 24 * 60 * 60 * 1000, // 7 days
        "Top Liked This Week": now - 7 * 24 * 60 * 60 * 1000, // 7 days
        "Trending This Month": now - 30 * 24 * 60 * 60 * 1000, // 30 days
        "Top Liked This Month": now - 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    return timeframeOptions[sortOption] || 0;
};

const PostFilter = ({
    selectedSort,
    setSelectedSort,
    setSortedPosts,
    fetchedPosts,
    searchedPosts,
    isSearchActive,
}: PostFilterProps) => {
    const handleSortChange = (sortOption: string) => {
        setSelectedSort(sortOption);
        const limit = getTimeframeLimit(sortOption);

        const postsToFilter = isSearchActive ? searchedPosts : fetchedPosts;

        const filtered = postsToFilter.filter((post) => {
            const postDate = new Date(post.$createdAt).getTime();
            return limit === 0 || postDate >= limit;
        });

        const sorted = filtered.sort((a, b) => {
            switch (sortOption) {
                case "All":
                    return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
                case "Top Liked All Time":
                case "Top Liked This Year":
                case "Top Liked This Month":
                case "Top Liked This Week":
                case "Top Liked Today":
                case "Top Liked This Hour":
                    return (b.likes?.length || 0) - (a.likes?.length || 0);
                case "Trending Now":
                case "Trending This Week":
                case "Trending Today":
                case "Trending This Month":
                    return (
                        (b.likes?.length || 0) + (b.save?.length || 0) - 
                        (a.likes?.length || 0) - (a.save?.length || 0)
                    );
                default:
                    return 0;
            }
        });

        setSortedPosts(sorted);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base-medium text-light-2">{selectedSort}</p>
                    <img src="/assets/icons/filter.svg" width={20} height={20} alt="filter" draggable="false" className="select-none" />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 bg-dark-3 rounded-2xl p-3 border-none select-none">
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-light-2 base-medium">Filter by</DropdownMenuLabel>

                <div className="p-2">
                    <DropdownMenuItem onClick={() => handleSortChange("All")} className="text-light-4 cursor-pointer">
                        All
                    </DropdownMenuItem>

                    <Accordion type="single" collapsible>
                        <AccordionItem value="trending">
                            <AccordionTrigger className="text-light-4 text-left no-underline small-regular cursor-pointer px-2 py-1.5">
                                Trending
                            </AccordionTrigger>
                            <AccordionContent className="border-none ml-3">
                                {["This Month", "This Week", "Today", "Now"].map(option => (
                                    <DropdownMenuItem key={option} onClick={() => handleSortChange(`Trending ${option}`)} className="text-light-4 cursor-pointer">
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="liked">
                            <AccordionTrigger className="text-light-4 text-left no-underline small-regular cursor-pointer px-2 py-1.5">
                                Top Liked
                            </AccordionTrigger>
                            <AccordionContent className="border-none ml-3">
                                {["All Time", "This Year", "This Month", "This Week", "Today", "This Hour"].map(option => (
                                    <DropdownMenuItem key={option} onClick={() => handleSortChange(`Top Liked ${option}`)} className="text-light-4 cursor-pointer">
                                        {option}
                                    </DropdownMenuItem>
                                ))}
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