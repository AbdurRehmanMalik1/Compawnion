import React, { useState } from 'react';

const Section = ({
    title,
    summary,
    content,
}: {
    title: string;
    summary: string;
    content: React.ReactNode;
}) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <section className="max-w-6xl mx-auto px-6 mb-12 transition-all duration-500">
            {!expanded ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Left Side - Title & Summary */}
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-white hover:underline">
                            {title}
                        </h2>
                        <p className="text-lg text-white mb-4">{summary}</p>
                        <button
                            onClick={() => setExpanded(true)}
                            className="cursor-pointer text-[#c6fadc] font-semibold hover:underline transition"
                        >
                            Read More ▼
                        </button>
                    </div>

                    {/* Empty right side (layout balance) */}
                    <div></div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="bg-[#c6fadc] text-[#333] border-2 border-[#b1553b] rounded-lg shadow-lg p-6 w-full md:w-2/3 lg:w-1/2 text-center transition-all duration-500">
                        <h3 className="text-2xl font-bold mb-4 text-[#b1553b]">
                            {title}
                        </h3>
                        <div className="text-lg space-y-4 mb-6">{content}</div>
                        <button
                            onClick={() => setExpanded(false)}
                            className="cursor-pointer text-[#b1553b] font-semibold hover:underline"
                        >
                            Show Less ▲
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};



const AboutUs = () => {
    return (
        <div className="font-sans scroll-smooth bg-gradient-to-r from-[#b1553b] to-[#c6fadc] min-h-screen  overflow-x-hidden text-[var(--color-primary-dark)] pb-20">
            <h1 className="text-4xl font-bold text-center text-white py-10 transition duration-700 hover:text-yellow-100">
                About Us
            </h1>

            {/* Our Journey */}
            <Section
                title="Our Journey"
                summary="A shared dream that began in January 2025."
                content={
                    <>
                        <p>
                            We started this project in January 2025 as a team of passionate individuals who share a love for pets.
                            Our goal is to provide an intuitive platform for pet adoption, bringing together animal lovers and those looking to give pets a loving home.
                        </p>
                        <p>
                            The team includes four dedicated members: <strong>Abdur Rehman</strong>, <strong>Hadia Sarwar</strong>, <strong>Azwa Nawaz</strong>, and <strong>Asad Ali</strong>.
                            Together, we’re building something special with a focus on user experience and community engagement. We are proud to be part of the university, FAST-NUCES.
                        </p>
                    </>
                }
            />

            {/* Our Mission */}
            <Section
                title="Our Mission"
                summary="Connecting pets with loving families through tech."
                content={
                    <p>
                        At the core of our project is the mission to connect people with pets who need a forever home. We want to make the adoption process easy, seamless, and impactful.
                        By leveraging technology, we aim to make pet adoption accessible to everyone and foster a sense of responsibility and love towards animals.
                    </p>
                }
            />

            {/* Our Values */}
            <Section
                title="Our Values"
                summary="Guided by integrity, compassion, and innovation."
                content={
                    <ul className="list-disc list-inside space-y-2 text-left">
                        <li><strong>Integrity:</strong> We do the right thing, even when no one is watching.</li>
                        <li><strong>Compassion:</strong> We care deeply for the animals and those who are willing to give them a second chance.</li>
                        <li><strong>Community:</strong> We believe in creating a supportive and inclusive environment for everyone.</li>
                        <li><strong>Innovation:</strong> We are always looking for new ways to improve the adoption process and user experience.</li>
                    </ul>
                }
            />

            {/* Meet the Team */}
            <Section
                title="Meet Our Team"
                summary="The people behind the platform."
                content={
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { initials: "AR", name: "Abdur Rehman" },
                            { initials: "HS", name: "Hadia Sarwar" },
                            { initials: "AN", name: "Azwa Nawaz" },
                            { initials: "AA", name: "Asad Ali" },
                        ].map((member) => (
                            <li key={member.initials} className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-[#b1553b] rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-md">
                                    {member.initials}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{member.name}</h3>
                                    <p>FAST-NUCES BS-SE</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                }
            />

            {/* Call to Action */}
            <section className="px-4 lg:px-0">
                <div className="text-center bg-[#c6fadc] text-[#b1553b] py-10 px-6 mt-20 rounded-lg shadow-xl max-w-4xl mx-auto">
                    <img src="/pet13.jpg" alt="Join Us" className="w-28 h-28 mx-auto mb-6 rounded-full shadow-md object-cover" />
                    <h2 className="text-3xl font-bold mb-4">Join Us in Our Journey</h2>
                    <p className="text-lg mb-6 text-[#b1553b]">
                        We are on a mission to make a real difference in the lives of pets and pet owners. Join us, whether you're looking to adopt or just want to help.
                    </p>
                    <button className="bg-[#b1553b] text-white py-3 px-8 rounded-full font-bold hover:bg-[#9e472f] transition-transform transform hover:scale-105 shadow-md">
                        <a href="/contact" className="hover:underline">
                            Contact Us
                        </a>
                    </button>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;
