import { Link } from "react-router";

interface FeatureCardProps {
    title: string;
    img: string;
    desc: string;
}
const FeatureCard = ({ title, img, desc }: FeatureCardProps) => {
    return (
        <div
            key={title}
            className="p-6 bg-[#e9fdf1] rounded-lg shadow-md flex flex-col items-center border border-[var(--color-primary-dark)] transition-transform transform hover:scale-105 hover:shadow-xl duration-500 ease-in-out"
        >
            <img
                src={img}
                alt={title}
                className="w-32 h-32 object-cover rounded-full mb-4 transition duration-500 transform hover:scale-110"
            />
            <h3 className="text-2xl font-semibold mb-2 text-[var(--color-primary-dark)] transition duration-300 hover:text-orange-700">
                {title}
            </h3>
            <p className="text-center text-[var(--color-primary-dark)] transition duration-300 hover:text-opacity-80">
                {desc}
            </p>
        </div>
    )
}


const Home = () => {
    return (
        <div className="font-sans scroll-smooth bg-gradient-to-b from-[#b1553b] to-[#c6fadc] min-h-screen">
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col md:flex-row items-center justify-between p-8 bg-gradient-to-r from-[#b1553b] to-[#c6fadc]">
                <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 max-w-xl transition duration-700 ease-in-out">
                        Bringing pets, people, and care together — all in one click.
                    </h1>
                    <p className="text-base md:text-xl text-white max-w-md mb-8 transition duration-500 ease-in-out hover:text-yellow-100">
                        Discover adoptable pets, book vet appointments, join a pet care community, and get AI-powered recommendations — all in one place.
                    </p>
                    <a href="/signup">
                        <button className="bg-white text-[var(--color-primary-dark)] px-8 py-4 rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300">
                            Get Started
                        </button>
                    </a>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src="/pet1.jpg"
                        alt="Cute cat"
                        className="rounded-lg shadow-xl w-80 hover:scale-105 transform transition duration-500 ease-in-out"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="min-h-screen p-8 flex flex-col items-center bg-gradient-to-r from-[#b1553b] to-[#c6fadc]">
                <h2 className="text-4xl font-bold mb-6 text-[var(--color-primary-dark)] transition duration-700 ease-in-out hover:text-orange-800 hover:underline">
                    What We Offer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
                    {[
                        {
                            title: 'Adoptable Pets',
                            desc: 'Browse hundreds of pets from trusted shelters.',
                            img: '/pet2.jpg',
                        },
                        {
                            title: 'Vet Appointments',
                            desc: 'Book veterinary care easily and securely.',
                            img: '/pet3.jpg',
                        },
                        {
                            title: 'Community Forums',
                            desc: 'Connect with other pet lovers and experts.',
                            img: '/pet4.jpg',
                        },
                        {
                            title: 'AI Recommendations',
                            desc: 'Find the best pet breeds for your lifestyle.',
                            img: '/pet5.jpg',
                        },
                        {
                            title: 'Live Donations',
                            desc: 'Support animals through live donation streams.',
                            img: '/pet6.jpg',
                        },
                        {
                            title: '24/7 AI Chatbot',
                            desc: 'Get instant answers to your pet questions.',
                            img: '/pet7.jpg',
                        },
                    ].map(({ title, desc, img }, index) => (
                        <FeatureCard key={index} title={title} desc={desc} img={img} />
                    ))}
                </div>
            </section>

            {/* About Us Section */}
            <section className="min-h-screen p-8 flex flex-col md:flex-row items-center bg-gradient-to-r from-[#b1553b] to-[#c6fadc]">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8 text-center md:text-left">
                    <h2 className="text-4xl font-bold mb-4 text-[var(--color-primary-dark)] transition duration-500 hover:underline">
                        Our Mission
                    </h2>
                    <p className="text-lg mb-4 text-white transition duration-500 hover:text-yellow-100">
                        At Pet Connect, we believe every pet deserves a loving home, and every pet owner deserves trusted support.
                        We work with shelters, veterinarians, and service providers to create a seamless, joyful experience from
                        adoption to lifelong care.
                    </p>
                    <p className="text-lg text-white hover:text-opacity-90 transition duration-300">
                        Whether you’re a pet adopter, a veterinarian, or a shelter, Pet Connect gives you the tools to build
                        connections that change lives — one paw at a time.
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src="/pet8.jpg"
                        alt="Happy cat with owner"
                        className="rounded-lg shadow-xl w-96 hover:scale-105 transform transition duration-500"
                    />
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center text-white p-8 bg-gradient-to-r from-[#b1553b] to-[#c6fadc]">
                <h2 className="text-5xl font-bold mb-4 transition duration-700 hover:text-yellow-100">
                    Ready to find your perfect pet?
                </h2>
                <p className="text-lg mb-8 max-w-2xl transition duration-500 hover:text-opacity-90">
                    Sign in now to start browsing, booking, and bonding with your future furry friend.
                </p>
                <a href="/login">
                    <button className="bg-white text-[var(--color-primary-dark)] px-10 py-4 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300">
                        Sign In
                    </button>
                </a>
                <img
                    src="/pet.png"
                    alt="Playful kitten"
                    className="mt-8 rounded-lg shadow-xl w-[450px] md:w-[600px] transition duration-700 hover:scale-110"
                />
            </section>

            {/* Footer Section */}
            <footer className="bg-[#c6fadc] text-[#b1553b] py-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Compawnion</h3>
                        <p className="text-sm text-[#b1553b]">
                            Your one-stop destination for pet adoption, care, and community. We connect hearts through paws.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="text-xl font-semibold mb-2">Quick Links</h4>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <Link to="/" className="hover:underline">
                                    Home
                                </Link>
                                – Start your pet journey
                            </li>
                            <li>
                                <Link to="/about" className="hover:underline">
                                    About
                                </Link>
                                – Learn about our mission
                            </li>
                            <li>
                                <Link to="/contact" className="hover:underline">
                                    Contact
                                </Link>
                                – Get in touch with uss
                            </li>
                        </ul>
                    </div>
                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-semibold mb-2">Contact Us</h4>
                        <p className="text-sm">
                            📍 123 Paw Street, Petville<br />
                            📞 +92 (311) 123-4567<br />
                            ✉️ hello@compawnion.com
                        </p>
                    </div>
                </div>

                <div className="text-center text-xs mt-8 text-[#b1553b]">
                    © {new Date().getFullYear()} Compawnion. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;

