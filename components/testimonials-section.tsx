import { Star } from "lucide-react";
import { getTestimonials } from "@/lib/platform";

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return (
      <div className="pk-glass rounded-2xl p-10 text-center">
        <p className="text-sm font-bold text-zinc-500">
          No reviews yet — be one of the first students to try ProjectsKatta and tell us what you think.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="pk-glass rounded-2xl p-6">
          <div className="flex gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-700">&ldquo;{testimonial.quote}&rdquo;</p>
          <p className="mt-4 text-sm font-black text-zinc-900">{testimonial.studentName}</p>
          {testimonial.studentDetail && <p className="text-xs font-semibold text-zinc-500">{testimonial.studentDetail}</p>}
        </div>
      ))}
    </div>
  );
}
