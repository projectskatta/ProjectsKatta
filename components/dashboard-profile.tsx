"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Pencil, Trash2, Upload, X } from "lucide-react";
import {
  deleteAvatar,
  updateAvatar,
  updateProfile,
  type DashboardState,
  type Profile,
  type ProfileType
} from "@/app/actions/dashboard";

const initialState: DashboardState = { status: "idle", message: "" };

const profileTypeLabels: Record<ProfileType, string> = {
  student: "Student",
  professional: "Professional",
  hobbyist: "Hobbyist / Maker",
  organization: "Organization",
  teacher: "Teacher"
};

function SaveButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function initials(name: string, email: string) {
  const source = name.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

function Avatar({ avatarUrl, name, email }: { avatarUrl: string; name: string; email: string }) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name || "Profile photo"}
        width={80}
        height={80}
        className="h-20 w-20 shrink-0 rounded-full border-4 border-white object-cover shadow-lg"
      />
    );
  }
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-black text-white shadow-lg">
      {initials(name, email)}
    </div>
  );
}

function AvatarEditor({ avatarUrl, name, email }: { avatarUrl: string; name: string; email: string }) {
  const [state, formAction] = useActionState(updateAvatar, initialState);

  return (
    <div className="flex items-center gap-5">
      <Avatar avatarUrl={avatarUrl} name={name} email={email} />
      <div className="flex flex-col gap-2">
        <form action={formAction} className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white">
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            {avatarUrl ? "Replace Photo" : "Add Photo"}
            <input
              type="file"
              name="avatar_file"
              accept="image/*"
              className="hidden"
              onChange={(event) => event.currentTarget.form?.requestSubmit()}
            />
          </label>
        </form>
        {avatarUrl && (
          <form action={deleteAvatar}>
            <button type="submit" className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700">
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Remove Photo
            </button>
          </form>
        )}
        {state.message && (
          <p className={`text-xs font-bold ${state.status === "error" ? "text-red-600" : "text-emerald-700"}`}>
            {state.message}
          </p>
        )}
      </div>
    </div>
  );
}

function TypeFields({ type, profile }: { type: ProfileType; profile: Profile }) {
  if (type === "student") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="University" name="university" defaultValue={profile.university} placeholder="e.g. Savitribai Phule Pune University" span />
        <Field label="Course" name="course" defaultValue={profile.course} placeholder="e.g. B.E. / Diploma" />
        <Field label="Branch" name="branch" defaultValue={profile.branch} placeholder="e.g. E&TC Engineering" />
        <Field label="Semester" name="semester" defaultValue={profile.semester} placeholder="e.g. Semester 5" />
        <Field label="Enrollment / Roll No." name="enrollment_id" defaultValue={profile.enrollmentId} placeholder="Optional" />
      </div>
    );
  }

  if (type === "professional") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" name="company" defaultValue={profile.company} placeholder="e.g. Motion Robotics" span />
        <Field label="Role" name="role" defaultValue={profile.role} placeholder="e.g. Embedded Systems Engineer" />
        <Field label="Experience" name="experience" defaultValue={profile.experience} placeholder="e.g. 3 years" />
        <Field label="Industry" name="industry" defaultValue={profile.industry} placeholder="e.g. Robotics, IoT" />
        <Field label="Portfolio / LinkedIn" name="portfolio_link" defaultValue={profile.portfolioLink} placeholder="https://..." />
      </div>
    );
  }

  if (type === "hobbyist") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Primary Interests"
          name="interests"
          defaultValue={profile.interests}
          placeholder="e.g. Robotics, IoT, AI, Embedded, 3D Printing"
          span
          textarea
        />
        <Field label="Experience Level" name="experience_level" defaultValue={profile.experienceLevel} placeholder="Beginner / Intermediate / Advanced" />
        <Field label="Tools You Use" name="tools_used" defaultValue={profile.toolsUsed} placeholder="e.g. Arduino, ESP32, Raspberry Pi" />
        <Field label="Portfolio / YouTube / Instagram" name="portfolio_link" defaultValue={profile.portfolioLink} placeholder="https://..." span />
      </div>
    );
  }

  if (type === "organization") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Organization Name" name="org_name" defaultValue={profile.orgName} placeholder="e.g. XYZ Polytechnic" span />
        <Field label="Organization Type" name="org_type" defaultValue={profile.orgType} placeholder="College / Company / Lab / Reseller" />
        <Field label="Website" name="website" defaultValue={profile.website} placeholder="https://..." />
        <Field label="GST Number" name="gst_number" defaultValue={profile.gstNumber} placeholder="Optional" />
        <Field label="Shipping Contact" name="shipping_contact" defaultValue={profile.shippingContact} placeholder="Name & phone for deliveries" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Institution" name="institution" defaultValue={profile.institution} placeholder="e.g. Government Polytechnic" span />
      <Field label="Subject Taught" name="subject_taught" defaultValue={profile.subjectTaught} placeholder="e.g. Digital Electronics" />
      <Field label="Designation" name="designation" defaultValue={profile.designation} placeholder="e.g. Lecturer, HOD" />
      <Field label="Department" name="department" defaultValue={profile.department} placeholder="e.g. E&TC Department" />
      <Field label="Years Teaching" name="years_teaching" defaultValue={profile.yearsTeaching} placeholder="e.g. 8 years" />
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  span,
  textarea
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  span?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={2}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm font-semibold"
        />
      )}
    </label>
  );
}

export function DashboardProfile({ email, profile }: { email: string; profile: Profile }) {
  const [editing, setEditing] = useState(false);
  const [selectedType, setSelectedType] = useState<ProfileType>(profile.profileType);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<DashboardState>(initialState);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    const result = await updateProfile(initialState, formData);
    setSaving(false);
    setState(result);
    if (result.status === "success") {
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <section className="pk-glass relative rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Edit Profile</p>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5">
          <AvatarEditor avatarUrl={profile.avatarUrl} name={profile.fullName} email={email} />
        </div>

        <form action={handleSubmit} className="mt-6 grid gap-4">
          <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Basic Profile</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="full_name" defaultValue={profile.fullName} />
            <Field label="Phone" name="phone" defaultValue={profile.phone} />
            <Field label="Country" name="country" defaultValue={profile.country} placeholder="e.g. India" />
            <Field label="City" name="city" defaultValue={profile.city} placeholder="e.g. Pune" />
          </div>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">I am a...</span>
            <select
              name="profile_type"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value as ProfileType)}
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm font-bold"
            >
              {Object.entries(profileTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-zinc-200 bg-white/40 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-zinc-500">
              {profileTypeLabels[selectedType]} Details
            </p>
            <TypeFields type={selectedType} profile={profile} />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-4">
            <p className={`text-xs font-bold ${state.status === "error" ? "text-red-600" : "text-emerald-700"}`}>
              {state.message}
            </p>
            <SaveButton label="Save Changes" pending={saving} />
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="pk-glass relative rounded-3xl p-8">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-zinc-600 transition hover:bg-white"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Edit
      </button>

      <div className="flex items-center gap-5">
        <Avatar avatarUrl={profile.avatarUrl} name={profile.fullName} email={email} />
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950">{profile.fullName || "Add your name"}</h2>
          <span className="mt-1 inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black tracking-wide text-blue-600">
            {profileTypeLabels[profile.profileType]}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 border-t border-zinc-200/60 pt-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Email</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{email}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Phone</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.phone || "Not added yet"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Country</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.country || "Not added yet"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">City</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.city || "Not added yet"}</p>
        </div>

        {profile.profileType === "student" && (
          <>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">University</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.university || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Course</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.course || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Branch</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.branch || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Semester</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.semester || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Enrollment / Roll No.</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.enrollmentId || "Not added yet"}</p>
            </div>
          </>
        )}

        {profile.profileType === "professional" && (
          <>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Company</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.company || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Role</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.role || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Experience</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.experience || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Industry</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.industry || "Not added yet"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Portfolio / LinkedIn</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.portfolioLink || "Not added yet"}</p>
            </div>
          </>
        )}

        {profile.profileType === "hobbyist" && (
          <>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Primary Interests</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.interests || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Experience Level</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.experienceLevel || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Tools Used</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.toolsUsed || "Not added yet"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Portfolio</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.portfolioLink || "Not added yet"}</p>
            </div>
          </>
        )}

        {profile.profileType === "organization" && (
          <>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Organization</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.orgName || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Type</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.orgType || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Website</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.website || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">GST Number</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.gstNumber || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Shipping Contact</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.shippingContact || "Not added yet"}</p>
            </div>
          </>
        )}

        {profile.profileType === "teacher" && (
          <>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Institution</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.institution || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Subject Taught</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.subjectTaught || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Designation</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.designation || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Department</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.department || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Years Teaching</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.yearsTeaching || "Not added yet"}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
