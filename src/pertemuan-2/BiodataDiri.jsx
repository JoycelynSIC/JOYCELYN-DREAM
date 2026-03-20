import profileImg from "../assets/profile.jpg";

// 1. CHILD 1 - Foto Profil
function FotoProfil() {
    return (
        <div className="foto-profil">
            <img src={profileImg} alt="Profil" />
        </div>
    )
}

// 2. CHILD 2 - Info NIM
function InfoNIM({ value }) {
    return (
        <div className="detail-card">
            <i className="fa-solid fa-address-card"></i>
            <div className="info-text">
                <p><b>NIM:</b></p>
                <p>{value}</p>
            </div>
        </div>
    )
}

// 3. CHILD 3 - Info Jurusan
function InfoJurusan({ value }) {
    return (
        <div className="detail-card">
            <i className="fa-solid fa-graduation-cap"></i>
            <div className="info-text">
                <p><b>Jurusan:</b></p>
                <p>{value}</p>
            </div>
        </div>
    )
}

// 4. CHILD 4 - Info Hobi
function InfoHobi({ value }) {
    return (
        <div className="detail-card">
            <i className="fa-solid fa-book"></i>
            <div className="info-text">
                <p><b>Hobi:</b></p>
                <p>{value}</p>
            </div>
        </div>
    )
}

// 5. CHILD 5 - Info Email
function InfoEmail({ value }) {
    return (
        <div className="detail-card">
            <i className="fa-solid fa-envelope"></i>
            <div className="info-text">
                <p><b>Email:</b></p>
                <p className="email-val">{value}</p>
            </div>
        </div>
    )
}

// 6. CHILD 6 - Quote
function Quote() {
    return <p className="quote"><i>"Less perfection, more magic."</i></p>
}

// PARENT
export default function BiodataDiri() {
    const data = {
        nama: "Joycelyn Dhealiva",
        nim: "2457301073",
        jurusan: "Sistem Informasi",
        hobi: "Membaca buku",
        email: "joycelyn24si@mahasiswa.pcr.ac.id"
    }

    return (
        <div className="container">
            <div className="card">
                <h1 className="title">BIODATA DIRI</h1>
                <hr/>
                <div className="profile-row">
                    <FotoProfil />
                    <div className="info-column">
                        <h2 className="nama-display">{data.nama}</h2>
                        <div className="info-grid">
                            <InfoNIM value={data.nim} />
                            <InfoJurusan value={data.jurusan} />
                            <InfoHobi value={data.hobi} />
                            <InfoEmail value={data.email} />
                        </div>
                    </div>
                </div>
                <hr />
                <Quote />
            </div>
        </div>
    )
}