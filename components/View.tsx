import Ping from "@/components/Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";

const View = async ({ id }: { id: string }) => {
    const result = await client
        .withConfig({ useCdn: false })
        .fetch(STARTUP_VIEWS_QUERY, { id });

    if (!result || result.views === null) {
        // console.log("No views data available");
        return;
    }

    const totalViews = result.views;
    // console.log("Total Views before increment:", totalViews);

    // Use `after` properly to execute the view count update
    after(async () => {
        await writeClient
            .patch(id)
            .set({ views: totalViews + 1 })
            .commit();
        // console.log("View count updated");
    });

    return (
        <div className="view-container">
            <div className="absolute -top-2 -right-2">
                <Ping />
            </div>

            <p className="view-text">
                <span className="font-black">Views: {totalViews}</span>
            </p>
        </div>
    );
};

export default View;
