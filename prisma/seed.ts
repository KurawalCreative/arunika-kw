import prisma from "@/lib/prisma";

async function main() {
    await prisma.like.create({
        data: {
            userId: "csyp1ARixrGI6dN6awe8ifAUQ7cENVSn",
            postId: "69046685320cfe6360551d0b",
        },
    });
}
main();
