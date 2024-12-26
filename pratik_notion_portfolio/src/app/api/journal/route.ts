import {n2m, notion} from '@/app/lib/notion';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, mood, tags } = body;

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_JOURNAL_DATABASE_ID!,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Content: {
          rich_text: [
            {
              text: {
                content: content,
              },
            },
          ],
        },
        Mood: {
          select: {
            name: mood,
          },
        },
        Tags: {
          multi_select: tags.map((tag: string) => ({ name: tag })),
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DATABASE_ID!,
      filter: {
        property: "Tags",
        multi_select: {
          contains: "Daily"
        }
      },
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    });
    const entries = await Promise.all(response.results.map(async (page: any) => {
      const blocks = await notion.blocks.children.list({
        block_id: page.id
      });
      const contentBlocks = blocks.results
      const contentMarkdown = await n2m.blocksToMarkdown(contentBlocks)
      const content = await n2m.toMarkdownString(contentMarkdown)
      response.results.map((page: any) => (console.log(page)));
      return {
        id: page.id,
        title: page.properties.Name.title[0].plain_text,
        subtitle: page.properties.subtitle.rich_text[0].plain_text,
        content: content,
        date: page.properties.Created.created_time,
        tags: page.properties.Tags.multi_select.map((tag: any) => tag.name),
      };
    }));

    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
