"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  BarChart3,
  Clapperboard,
  Database,
  FileUp,
  FolderKanban,
  PackagePlus,
  Send
} from "lucide-react";
import {
  publishEducationResource,
  publishGame,
  publishProject,
  publishSubject,
  publishStoreKit,
  type CommandState
} from "@/app/admin-katta/actions";
import { branchesByUniversity, categoryTypeLabels, schemesByUniversity, universities, yearsByUniversity } from "@/lib/platform-data";
import { cn } from "@/lib/utils";

const initialState: CommandState = { status: "idle", message: "" };

const tabs = [
  { id: "education", label: "Education", icon: FileUp },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "store", label: "Store", icon: PackagePlus },
  { id: "funnel", label: "Games", icon: Clapperboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 }
] as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:w-auto"
    >
      <Send className="h-4 w-4" aria-hidden="true" />
      {pending ? "Publishing..." : label}
    </button>
  );
}

function StatusLine({ state }: { state: CommandState }) {
  return (
    <p
      className={cn(
        "min-h-5 text-sm font-bold",
        state.status === "success" && "text-emerald-700",
        state.status === "error" && "text-red-600",
        state.status === "idle" && "text-zinc-500"
      )}
      aria-live="polite"
    >
      {state.message}
    </p>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
      />
    </label>
  );
}

function FileField({ label, name, accept, required = false }: { label: string; name: string; accept?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        name={name}
        type="file"
        accept={accept}
        required={required}
        className="mt-2 block w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-950 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
      />
    </label>
  );
}

function TextArea({ label, name, placeholder, rows = 4 }: { label: string; name: string; placeholder?: string; rows?: number }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm font-bold leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
      />
    </label>
  );
}

function EducationForm() {
  const [state, formAction] = useActionState(publishEducationResource, initialState);
  const [subjectState, subjectAction] = useActionState(publishSubject, initialState);

  return (
    <div className="grid gap-6">
      <form action={subjectAction} className="grid gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-lg font-black text-zinc-950">Create Subject Only</h3>
        <EducationMetaFields />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject Name" name="subject_name" placeholder="Basic Electronics Engineering" required />
          <Field label="Subject Code" name="subject_code" placeholder="BEE / AJP / DSU" />
        </div>
        <Field label="Regulation Year" name="regulation_year" placeholder="2024 / 2019 / K-Scheme" />
        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusLine state={subjectState} />
          <SubmitButton label="Save Subject" />
        </div>
      </form>

      <form action={formAction} className="grid gap-4">
        <h3 className="text-lg font-black text-zinc-950">Upload Notes / PYQ / Solved PDF</h3>
        <EducationMetaFields />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject Name" name="subject_name" placeholder="Basic Electronics Engineering" required />
          <Field label="Subject Code" name="subject_code" placeholder="BEE / AJP / DSU" />
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">File Type</span>
            <select name="category_type" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold">
              {Object.entries(categoryTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="File Title" name="file_title" placeholder="Unit 1 Notes / Winter 2024 PYQ" />
          <Field label="Exam Year" name="exam_year" placeholder="2024 / Winter 2023" />
        </div>
        <Field label="Regulation Year" name="regulation_year" placeholder="2024 / 2019 / K-Scheme" />
        <FileField label="Upload PDF" name="resource_file" accept="application/pdf" required />
        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
          <input name="is_trending" type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
          Mark as trending
        </label>
        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusLine state={state} />
          <SubmitButton label="Publish Education File" />
        </div>
      </form>
    </div>
  );
}

function EducationMetaFields() {
  const [university, setUniversity] = useState<(typeof universities)[number]>("SPPU");
  const [year, setYear] = useState<number>(1);
  const semesterOptions = [year * 2 - 1, year * 2].filter((item) => university === "SPPU" || item <= 6);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-xs font-black uppercase tracking-wide text-zinc-500">University</span>
        <select
          name="university"
          value={university}
          onChange={(event) => {
            setUniversity(event.target.value as (typeof universities)[number]);
            setYear(1);
          }}
          className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm font-bold"
        >
          {universities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Pattern / Scheme</span>
        <select name="pattern_scheme" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm font-bold">
          {schemesByUniversity[university].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Branch</span>
        <select name="branch" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm font-bold">
          {branchesByUniversity[university].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Year</span>
        <select
          name="year"
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
          className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm font-bold"
        >
          {yearsByUniversity[university].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Semester</span>
        <select name="semester" defaultValue={1} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm font-bold">
          {semesterOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function ProjectForm() {
  const [state, formAction] = useActionState(publishProject, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project Title" name="title" placeholder="ESP32 Home Automation" required />
        <Field label="Slug" name="project_slug" placeholder="esp32-home-automation" />
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Project Section</span>
          <select name="project_tier" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold">
            <option value="basic">Basic Projects</option>
            <option value="advanced">Advanced Projects</option>
            <option value="premium">Premium Projects</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Category</span>
          <select name="category_tag" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold">
            {["Basic", "Advanced", "IoT", "Robotics"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FileField label="Project Image" name="image_file" accept="image/*" />
        <Field label="Image URL fallback" name="image_url" placeholder="/images/hero-lab.png" />
      </div>
      <Field label="YouTube Project Video URL" name="youtube_url" placeholder="https://www.youtube.com/watch?v=..." required />
      <TextArea label="Theory Content" name="theory_content" placeholder="Core project theory in short paragraphs." rows={4} />
      <TextArea label="BOM List" name="bom_list" placeholder={"Arduino Uno\nL298N Motor Driver | https://..."} rows={4} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FileField label="Report PDF" name="report_file" accept="application/pdf" />
        <Field label="Report URL fallback" name="report_url" placeholder="https://...pdf" />
        <Field label="Related Kit Slug" name="related_kit_slug" placeholder="esp32-iot-relay-kit" />
      </div>
      <FileField label="Upload .ino / .txt code" name="code_file" accept=".ino,.txt,.c,.cpp,.h,.html,.css,.js,text/*" />
      <TextArea label="Source Code fallback" name="code_string" placeholder="Paste .ino code here if no file selected" rows={6} />
      <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <StatusLine state={state} />
        <SubmitButton label="Publish Project" />
      </div>
    </form>
  );
}

function StoreForm() {
  const [state, formAction] = useActionState(publishStoreKit, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kit Title" name="title" placeholder="PID Line Follower Kit" required />
        <Field label="Product Slug" name="product_slug" placeholder="pid-line-follower-kit" />
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Category</span>
          <select name="category" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold">
            {["Robotics Kits", "Embedded Systems", "Electronics DIY", "IoT Automation"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <Field label="MRP" name="mrp" type="number" placeholder="2499" />
        <Field label="Selling Price" name="selling_price" type="number" placeholder="1749" required />
      </div>
      <TextArea label="Summary" name="summary" placeholder="Short product summary." rows={3} />
      <FileField label="Primary Kit Image" name="image_file" accept="image/*" />
      <TextArea label="Image URLs" name="image_gallery" placeholder={"/images/hero-lab.png\nhttps://..."} rows={3} />
      <TextArea label="Technical Specs" name="technical_specs" placeholder={"Controller: Arduino Uno\nBattery: 7.4V\nDifficulty: Beginner"} rows={5} />
      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
        <input name="stock_status" type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300" />
        In stock
      </label>
      <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <StatusLine state={state} />
        <SubmitButton label="Publish Kit" />
      </div>
    </form>
  );
}

function GameForm() {
  const [state, formAction] = useActionState(publishGame, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Game Name" name="title" placeholder="LED Runner" required />
        <Field label="Game Slug" name="slug" placeholder="led-runner" />
      </div>
      <label className="block">
        <span className="text-xs font-black uppercase tracking-wide text-zinc-500">YouTube Channel</span>
        <select name="channel" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold">
          <option value="projectskatta">ProjectsKatta</option>
          <option value="projectskatta_gaming">ProjectsKatta Gaming</option>
        </select>
      </label>
      <Field label="YouTube Video URL" name="youtube_url" placeholder="https://www.youtube.com/watch?v=..." required />
      <TextArea label="Game Description" name="description" placeholder="What this game teaches or demonstrates." rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FileField label="Playable HTML File" name="html_file" accept=".html,text/html" required />
        <FileField label="Game Thumbnail" name="thumbnail_file" accept="image/*" />
      </div>
      <FileField label="Source Code File" name="source_code_file" accept=".html,.css,.js,.txt,text/*" />
      <TextArea label="Source Code fallback" name="source_code" placeholder="Paste HTML/CSS/JS here if no source file selected" rows={6} />
      <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <StatusLine state={state} />
        <SubmitButton label="Publish Game" />
      </div>
    </form>
  );
}

function AnalyticsPanel() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        ["Education Files", "Live table: resources"],
        ["Project Funnel", "YouTube + report clicks"],
        ["Store Leads", "WhatsApp custom kit queue"]
      ].map(([title, body]) => (
        <div key={title} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <Database className="h-5 w-5 text-zinc-950" aria-hidden="true" />
          <h3 className="mt-3 text-lg font-black text-zinc-950">{title}</h3>
          <p className="mt-2 text-sm font-semibold text-zinc-600">{body}</p>
        </div>
      ))}
    </div>
  );
}

export function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("education");

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
        <div className="grid gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-md px-3 text-left text-sm font-black transition",
                  activeTab === tab.id
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </aside>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
        {activeTab === "education" && <EducationForm />}
        {activeTab === "projects" && <ProjectForm />}
        {activeTab === "store" && <StoreForm />}
        {activeTab === "funnel" && <GameForm />}
        {activeTab === "analytics" && <AnalyticsPanel />}
      </section>
    </div>
  );
}
