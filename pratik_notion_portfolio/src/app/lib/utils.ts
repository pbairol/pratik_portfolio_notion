import { notion } from './notion';

export async function getFullPageContent(pageId: string): Promise<string> {
    const blocks = await notion.blocks.children.list({
        block_id: pageId
    });
    const content = await Promise.all(blocks.results.map(async (block: any) => {
        console.log(block.type)
        if (block.type === "child_page") {
            const subPageContent = await getFullPageContent(block.id);
            return `## ${block.child_page.title}\n\n${subPageContent}`;
        }

        if (block.type === "paragraph") {
            return block.paragraph.rich_text?.[0]?.plain_text || "";
        }

        if (block.type === "heading_1") {
            return `# ${block.heading_1.rich_text?.[0]?.plain_text || ""}\n`;
        }

        if (block.type === "heading_2") {
            return `## ${block.heading_2.rich_text?.[0]?.plain_text || ""}\n`;
        }

        if (block.type === "heading_3") {
            return `### ${block.heading_3.rich_text?.[0]?.plain_text || ""}\n`;
        }

        if (block.type === "bulleted_list_item") {
            return `- ${block.bulleted_list_item.rich_text?.[0]?.plain_text || ""}\n`;
        }

        if (block.type === "numbered_list_item") {
            return `1. ${block.numbered_list_item.rich_text?.[0]?.plain_text || ""}\n`;
        }

        return "";
    }));

    return content.join("\n");
}

export function calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}
