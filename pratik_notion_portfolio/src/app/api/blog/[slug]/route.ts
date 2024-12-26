import {n2m, notion} from '@/app/lib/notion';
import { NextRequest, NextResponse } from 'next/server';
import { calculateReadTime } from '@/app/lib/utils';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_BLOG_DATABASE_ID!,
            filter: {
                property: "slug",
                rich_text: {
                    equals: params.slug
                }
            }
        });

        if (response.results.length === 0) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const page: any = response.results[0];
        const blocks = await notion.blocks.children.list({
            block_id: page.id
        });
        const contentBlocks = blocks.results
        const contentMarkdown = await n2m.blocksToMarkdown(contentBlocks)
        const content = await n2m.toMarkdownString(contentMarkdown)
        return NextResponse.json({
            id: page.id,
            title: page.properties.Name.title[0].plain_text,
            date: page.created_time,
            readTime: calculateReadTime(content.toString()),
            preview: page.properties.subtitle.rich_text[0].plain_text,
            tag: page.properties.Tags.multi_select[0].name,
            slug: page.properties.slug.rich_text[0].plain_text,
            content: content
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
