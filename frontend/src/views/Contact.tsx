import clsx from "clsx";

const ContactUs = () => {
    return (
        <div className="pl-5 pr-5 lg:pl-0 lg:pr-0 font-sans scroll-smooth bg-gradient-to-r from-[#c6fadc] to-[#b1553b] min-h-screen w-[screen] overflow-x-hidden text-[var(--color-primary-dark)] pb-20">
            <h1 className="text-4xl font-bold text-center text-white py-10 transition duration-700 hover:text-yellow-100">
                Contact Us
            </h1>
            <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 text-[#333]">
                <h2 className="text-2xl font-bold mb-4 text-[#b1553b]">Why Contact Us?</h2>
                <p className="mb-6 text-sm md:text-md md:text-lg">
                    Whether you're looking to adopt, have questions about our platform, or want to collaborate or support our mission, we’d love to hear from you!
                    Feel free to reach out with suggestions, feedback, or any inquiries.
                </p>

                <h3 className="text-xl font-semibold mb-2 text-[#b1553b]">Project Email</h3>
                <p className="mb-6 text-lg">
                    📧 <a href="mailto:compawnion@gmail.com" className="text-blue-600 hover:underline">compawnion@gmail.com</a>
                </p>
                <h3 className="text-xl font-semibold mb-4 text-[#b1553b]">Team Emails</h3>
                <ul className="space-y-4">
                    {[
                        { name: 'Abdur Rehman', email: 'abdur.rehman@gmail.com' },
                        { name: 'Hadia Sarwar', email: 'hadia.sarwa@gmail.com' },
                        { name: 'Azwa Nawaz', email: 'azwa.nawaz@gmail.com' },
                        { name: 'Asad Ali', email: 'asad.ali@gmail.com' },
                    ].map(({ name, email }) => (
                        <li key={email} className={clsx("flex items-center justify-between border-b pb-2","text-sm sm:text-xl")}>
                            <span className="">{name}</span>
                            <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                                {email}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Optional Call to Action */}
            <section className="text-center bg-[#c6fadc] text-[#b1553b] py-10 px-6 mt-20 rounded-lg shadow-xl max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Let’s Connect</h2>
                <p className="text-lg mb-6">
                    Your feedback and support mean the world to us. Reach out and be part of something meaningful — for the pets, and the people who love them.
                </p>
                <a
                    href="mailto:compawnion@gmail.com"
                    className="bg-[#b1553b] text-white py-3 px-8 rounded-full font-bold hover:bg-[#9e472f] transition-transform transform hover:scale-105 shadow-md"
                >
                    Email Us Now
                </a>
            </section>
        </div>
    );
};

export default ContactUs;
