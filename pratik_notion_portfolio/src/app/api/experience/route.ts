// app/api/experience/route.route.ts
import { notion } from '@/app/lib/notion';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_EXPERIENCE_DATABASE_ID!,
        });

        const experience = response.results.map((page: any) => ({
            id: page.id,
            startDate: page.properties.Date.date.start,
            endDate: page.properties.Date.date.end,
            title: page.properties.title.rich_text[0].plain_text,
            location: page.properties.Location.rich_text[0].plain_text,
            company: page.properties.Name.title[0].plain_text,
            description: page.properties.description.rich_text[0].plain_text,
            technologies: page.properties.skills.multi_select.map(
                (tech: any) => tech.name
            ),
        }));

        return NextResponse.json(experience);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
