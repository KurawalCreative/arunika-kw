import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    // reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*",
                port: "",
            },
        ],
    },
    serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
