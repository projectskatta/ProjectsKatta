"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Eye, FileCheck2, FileText, Landmark, Layers3 } from "lucide-react";
import {
  branchesByUniversity,
  categoryTypeLabels,
  schemesByUniversity,
  universities,
  yearsByUniversity
} from "@/lib/platform-data";
import type { AcademicSubject, EducationResource } from "@/types/platform";

type EducationExplorerProps = {
  subjects: AcademicSubject[];
  resources: EducationResource[];
  initialQuery?: string;
};

export function EducationExplorer({ subjects, resources, initialQuery = "" }: EducationExplorerProps) {
  const normalizedInitialQuery = initialQuery.toLowerCase();
  const firstMatchingSubject =
    subjects.find(
      (subject) =>
        normalizedInitialQuery &&
        (subject.subjectName.toLowerCase().includes(normalizedInitialQuery) ||
          subject.subjectCode?.toLowerCase().includes(normalizedInitialQuery))
    ) ?? subjects[0];
  const [university, setUniversity] = useState<(typeof universities)[number]>(
    firstMatchingSubject?.university ?? "SPPU"
  );
  const [scheme, setScheme] = useState<string>(firstMatchingSubject?.patternScheme ?? "2024 Pattern");
  const [branch, setBranch] = useState<string>(firstMatchingSubject?.branch ?? branchesByUniversity.SPPU[0]);
  const [year, setYear] = useState<number>(firstMatchingSubject?.year ?? 1);
  const [semester, setSemester] = useState<number>(firstMatchingSubject?.semester ?? 1);
  const [query, setQuery] = useState(initialQuery);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const branchOptions = branchesByUniversity[university];
  const yearOptions = yearsByUniversity[university];
  const semesterOptions = [year * 2 - 1, year * 2].filter((item) => university === "SPPU" || item <= 6);

  const filteredSubjects = useMemo(() => {
    const normalized = query.toLowerCase();
    return subjects.filter((subject) => {
      const baseMatch =
        subject.university === university &&
        subject.patternScheme === scheme &&
        subject.branch === branch &&
        subject.year === year &&
        subject.semester === semester;
      const queryMatch =
        !normalized ||
        subject.subjectName.toLowerCase().includes(normalized) ||
        subject.subjectCode?.toLowerCase().includes(normalized);

      return baseMatch && queryMatch;
    });
  }, [branch, query, scheme, semester, subjects, university, year]);

  const selectedSubject =
    filteredSubjects.find((subject) => subject.id === selectedSubjectId) ?? filteredSubjects[0];

  const grouped = useMemo(() => {
    return resources
      .filter((resource) => {
        if (!selectedSubject) {
          return false;
        }

        return (
          resource.university === selectedSubject.university &&
          resource.patternScheme === selectedSubject.patternScheme &&
          resource.branch === selectedSubject.branch &&
          resource.year === selectedSubject.year &&
          resource.semester === selectedSubject.semester &&
          resource.subjectSlug === selectedSubject.subjectSlug
        );
      })
      .reduce<Record<string, EducationResource[]>>((acc, resource) => {
      acc[resource.categoryType] = [...(acc[resource.categoryType] ?? []), resource];
      return acc;
      }, {});
  }, [resources, selectedSubject]);

  function handleUniversity(nextUniversity: (typeof universities)[number]) {
    setUniversity(nextUniversity);
    setScheme(schemesByUniversity[nextUniversity][0]);
    setBranch(branchesByUniversity[nextUniversity][0]);
    setYear(1);
    setSemester(1);
    setSelectedSubjectId("");
  }

  function handleYear(nextYear: number) {
    setYear(nextYear);
    setSemester(nextYear * 2 - 1);
    setSelectedSubjectId("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">University</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {universities.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleUniversity(item)}
                  className={`h-10 rounded-md border text-sm font-black transition ${
                    university === item
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-950"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Pattern / Scheme</span>
            <select
              value={scheme}
              onChange={(event) => {
                setScheme(event.target.value);
                setSelectedSubjectId("");
              }}
              className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            >
              {schemesByUniversity[university].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Branch</span>
            <select
              value={branch}
              onChange={(event) => {
                setBranch(event.target.value);
                setSelectedSubjectId("");
              }}
              className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            >
              {branchOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Year</span>
            <select
              value={year}
              onChange={(event) => handleYear(Number(event.target.value))}
              className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            >
              {yearOptions.map((item) => (
                <option key={item} value={item}>
                  Year {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Semester</span>
            <select
              value={semester}
              onChange={(event) => {
                setSemester(Number(event.target.value));
                setSelectedSubjectId("");
              }}
              className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            >
              {semesterOptions.map((item) => (
                <option key={item} value={item}>
                  Semester {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Subject Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Basic Electronics"
              className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold outline-none focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            />
          </label>
        </div>
      </aside>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
              {university} / {scheme} / {branch} / Year {year} / Sem {semester}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950">
              {selectedSubject?.subjectName ?? "No subject found"}
            </h2>
          </div>
          <div className="hidden rounded-md border border-zinc-200 px-3 py-2 text-sm font-black text-zinc-700 sm:block">
            {filteredSubjects.length} subjects
          </div>
        </div>

        {selectedSubject ? (
          <div className="mt-5 grid gap-4">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Available Subjects</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {filteredSubjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className={`rounded-md border p-3 text-left transition ${
                      selectedSubject?.id === subject.id
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-white hover:border-zinc-950"
                    }`}
                  >
                    <p className={`text-sm font-black ${selectedSubject?.id === subject.id ? "text-white" : "text-zinc-950"}`}>
                      {subject.subjectName}
                    </p>
                    <p className={`mt-1 text-xs font-bold ${selectedSubject?.id === subject.id ? "text-zinc-300" : "text-zinc-500"}`}>
                      {subject.subjectCode ?? "No code"} / {subject.patternScheme}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {(["notes", "insem_pyq", "endsem_pyq", "solved"] as const).map((category) => {
              const items = grouped[category] ?? [];
              const Icon = category === "solved" ? FileCheck2 : category === "notes" ? FileText : Landmark;

              return (
                <div key={category} className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-zinc-950" aria-hidden="true" />
                    <h3 className="text-base font-black text-zinc-950">{categoryTypeLabels[category]}</h3>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <details
                          key={item.id}
                          className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm font-bold text-zinc-700 transition open:col-span-full open:bg-white"
                        >
                          <summary className="cursor-pointer list-none">
                            <span className="block">{item.fileTitle}</span>
                            <span className="mt-2 flex items-center gap-3 text-xs font-black text-zinc-500">
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                              Open Preview
                            </span>
                          </summary>
                          <iframe
                            title={item.fileTitle}
                            src={item.fileUrl}
                            className="mt-3 h-[520px] w-full rounded-md border border-zinc-200 bg-white"
                          />
                          <Link
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-black text-white"
                          >
                            <Download className="h-4 w-4" aria-hidden="true" />
                            Download PDF
                          </Link>
                        </details>
                      ))
                    ) : (
                      <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-3 text-sm font-semibold text-zinc-500">
                        Ready for upload from admin.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
            <Layers3 className="mx-auto h-8 w-8 text-zinc-400" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-zinc-600">Change filters or upload this subject from admin.</p>
          </div>
        )}
      </section>
    </div>
  );
}
