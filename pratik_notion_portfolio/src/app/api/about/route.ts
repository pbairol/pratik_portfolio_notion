import {notion, n2m} from "@/app/lib/notion"
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        const response = await notion.pages.retrieve({
            page_id: process.env.NOTION_ABOUT_PAGE_ID!,
        });

        const content = await notion.blocks.children.list({
            block_id: process.env.NOTION_ABOUT_PAGE_ID!,
        });

        const paragraphBlocks = content.results.filter(
            (block: any) => block.type === "paragraph"
        );
        const aboutBlocks = await n2m.blocksToMarkdown(paragraphBlocks);
        const aboutContent = await n2m.toMarkdownString(aboutBlocks);

        return NextResponse.json({
            id: response.id,
            title: response?.properties.title.title[0].plain_text,
            content: aboutContent,
        });
    } catch (error) {
        return NextResponse.json(
            {error: (error as Error).message},
            {status: 500}
        );
    }
}
