import { notion } from '@/app/lib/notion';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_PROJECTS_DATABASE_ID!,
        });

        const projects = response.results.map((page: any) => ({
            id: page.id,
            title: page.properties.Project.title[0].plain_text,
            description: page.properties.SubText.rich_text[0].plain_text,
            githubLink: page.properties.GitHub.url,
            technologies: page.properties.Skills.multi_select.map(
                (tech: any) => tech.name
            ),
        }));

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
