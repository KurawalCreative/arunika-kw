import FooterSection from "@/components/footer";
import { ReactNode } from "react";
import RaniChatCompanion from "@/components/rani-chat-companion";
import NavbarArunika from "@/components/navbar";

export default function Layout(props: { children: ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col">
            <NavbarArunika />
            <div className="flex flex-1 pt-16">
                <div className="flex flex-1 flex-col">
                    <>
                        {props.children}
                        {/* <RaniChatCompanion /> */}
                    </>
                </div>
            </div>
            <FooterSection />
        </main>
    );
}
