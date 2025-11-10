
const adventage = [
    {
        id: 1,
        point: '38+',
        color: '#5DD39E',
        describe: 'Provinsi dengan Certia Unik'
    },
    {
        id: 2,
        point: '700+',
        color: '#3ABEFF',
        describe: 'Pakaian Adat Nusantara'
    },
    {
        id: 3,
        point: '1.340+',
        color: '#FF8C42',
        describe: 'Suku & Tradisi'
    },
    {
        id: 4,
        point: '1.000+',
        color: '#FF6B6B',
        describe: 'Kisah & Dongeng Rakyat'
    }
]

const AdventagesSection = () => {
    return (
        <section className="flex justify-between mx-auto py-20 max-w-7xl w-full">
            <div className="flex flex-row justify-between w-full">
                {adventage.map((v, i) => (
                    <div key={i} className="flex flex-col items-center text-center" >
                        <h1 className="text-3xl font-semibold">{v.point}</h1>
                        <hr className="w-20 h-0.5 my-2 rounded-full border-none"
                            style={{ backgroundColor: v.color }} />
                        <p>{v.describe}</p>
                    </div>
                ))}
            </div>
        </section >
    )
}

export default AdventagesSection;