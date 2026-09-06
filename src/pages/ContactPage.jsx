import Contact from '../components/sections/Contact';
import { SectionTag, SectionTitle } from '../components/ui/SectionElements';

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 lg:pt-40 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTag>Contact</SectionTag>
          <SectionTitle className="mt-4">
            Get in
            <span className="text-accent"> Touch</span>
          </SectionTitle>
        </div>
      </section>
      <Contact />
    </>
  );
}
