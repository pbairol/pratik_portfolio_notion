import { notion,n2m } from '@/app/lib/notion';
import { NextResponse } from 'next/server';
import { calculateReadTime } from '@/app/lib/utils';

export async function GET() {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_BLOG_DATABASE_ID!,
            filter: {
                property: "Tags",
                multi_select: {
                    does_not_contain: "Daily"
                }
            }
        });
        const blogPosts = await Promise.all(response.results.map(async (page: any) => {
            const blocks = await notion.blocks.children.list({
                block_id: page.id
            });
            const contentBlocks = blocks.results
            const contentMarkdown = await n2m.blocksToMarkdown(contentBlocks)
            const content = await n2m.toMarkdownString(contentMarkdown)
            return {
                id: page.id,
                title: page.properties.Name.title[0].plain_text,
                date: page.created_time,
                readTime: calculateReadTime(content.toString()),
                preview: content,
                tag: page.properties.Tags.multi_select[0].name,
                slug: page.properties.slug.rich_text[0].plain_text
            };
        }));

        return NextResponse.json(blogPosts);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
