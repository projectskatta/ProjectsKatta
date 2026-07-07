import { Instagram, Mail, Phone, Youtube } from "lucide-react";

const contactItems = [
  {
    label: "Email",
    value: "projectskattaofficial@gmail.com",
    href: "mailto:projectskattaofficial@gmail.com",
    icon: Mail
  },
  {
    label: "Phone",
    value: "+91 90969 19688",
    href: "tel:+919096919688",
    icon: Phone
  },
  {
    label: "YouTube",
    value: "@projectskatta",
    href: "https://www.youtube.com/@projectskatta",
    icon: Youtube
  },
  {
    label: "Instagram",
    value: "@projectskatta",
    href: "https://www.instagram.com/projectskatta",
    icon: Instagram
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Contact</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
          Reach ProjectsKatta.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
          For project kits, academic uploads, collaborations, and support, contact us through
          any official channel below.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-950"
              >
                <Icon className="h-5 w-5 text-zinc-950" aria-hidden="true" />
                <p className="mt-4 text-sm font-black uppercase tracking-wide text-zinc-500">{item.label}</p>
                <p className="mt-2 text-lg font-black text-zinc-950">{item.value}</p>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
