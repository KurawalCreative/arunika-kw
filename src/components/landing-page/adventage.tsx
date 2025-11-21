const adventage = [
    {
        id: 1,
        point: "38+",
        color: "#5DD39E",
        describe: "Provinsi dengan Certia Unik",
    },
    {
        id: 2,
        point: "700+",
        color: "#3ABEFF",
        describe: "Pakaian Adat Nusantara",
    },
    {
        id: 3,
        point: "1.340+",
        color: "#FF8C42",
        describe: "Suku & Tradisi",
    },
    {
        id: 4,
        point: "1.000+",
        color: "#FF6B6B",
        describe: "Kisah & Dongeng Rakyat",
    },
];

const AdventagesSection = () => {
    return (
        <section className="mx-auto flex w-full max-w-7xl justify-between py-20">
            <div className="flex w-full flex-row justify-between">
                {adventage.map((v, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{v.point}</h1>
                        <hr className="my-2 h-0.5 w-20 rounded-full border-none" style={{ backgroundColor: v.color }} />
                        <p className="text-gray-700 dark:text-gray-300">{v.describe}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AdventagesSection;
