"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { apiFetchAuth, ApiError } from "@/lib/api";
import { SUBJECT_GROUPS, CLASS_CATEGORIES } from "@/lib/constants";
import { TutorDashboardNav } from "@/components/gia-su/TutorDashboardNav";

type TeachingMode = "ONLINE" | "OFFLINE" | "BOTH";

interface TutorProfileResponse {
  bio: string | null;
  subjects: string[];
  classGroups: string[];
  region: string | null;
  teachingMode: TeachingMode;
  hourlyRate: number | null;
  experienceYears: number | null;
  educationLevel: string | null;
  schoolStudiedAt: string | null;
  achievements: string | null;
  certificates: string[];
  studentsAccepted: number;
  ratingAvg: number;
  ratingCount: number;
}

const MODE_OPTIONS: Array<{ value: TeachingMode; label: string }> = [
  { value: "ONLINE", label: "Chỉ online" },
  { value: "OFFLINE", label: "Chỉ tại nhà" },
  { value: "BOTH", label: "Cả hai" },
];

export default function TutorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState<{ studentsAccepted: number; ratingAvg: number; ratingCount: number } | null>(
    null
  );

  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [classGroups, setClassGroups] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("BOTH");
  const [hourlyRate, setHourlyRate] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [schoolStudiedAt, setSchoolStudiedAt] = useState("");
  const [achievements, setAchievements] = useState("");
  const [certificatesText, setCertificatesText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const profile = await apiFetchAuth<TutorProfileResponse>("/api/tutors/me");
        setBio(profile.bio ?? "");
        setSubjects(profile.subjects ?? []);
        setClassGroups(profile.classGroups ?? []);
        setRegion(profile.region ?? "");
        setTeachingMode(profile.teachingMode ?? "BOTH");
        setHourlyRate(profile.hourlyRate != null ? String(profile.hourlyRate) : "");
        setExperienceYears(profile.experienceYears != null ? String(profile.experienceYears) : "");
        setEducationLevel(profile.educationLevel ?? "");
        setSchoolStudiedAt(profile.schoolStudiedAt ?? "");
        setAchievements(profile.achievements ?? "");
        setCertificatesText((profile.certificates ?? []).join("\n"));
        setStats({
          studentsAccepted: profile.studentsAccepted,
          ratingAvg: profile.ratingAvg,
          ratingCount: profile.ratingCount,
        });
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Không tải được hồ sơ.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function toggleSubject(subject: string) {
    setSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]));
  }

  function toggleClassGroup(group: string) {
    setClassGroups((prev) => (prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (subjects.length === 0) {
      setError("Chọn ít nhất 1 môn dạy");
      return;
    }
    if (!region.trim()) {
      setError("Vui lòng nhập khu vực dạy");
      return;
    }

    setSaving(true);
    try {
      await apiFetchAuth<TutorProfileResponse>("/api/tutors/me", {
        method: "PUT",
        body: JSON.stringify({
          bio: bio || undefined,
          subjects,
          classGroups,
          region,
          teachingMode,
          hourlyRate: Number(hourlyRate) || 0,
          experienceYears: experienceYears ? Number(experienceYears) : undefined,
          educationLevel: educationLevel || undefined,
          schoolStudiedAt: schoolStudiedAt || undefined,
          achievements: achievements || undefined,
          certificates: certificatesText
            .split("\n")
            .map((c) => c.trim())
            .filter(Boolean),
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Lưu hồ sơ thất bại, thử lại sau.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <TutorDashboardNav current="ho-so" />
        <p className="text-muted">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div>
      <TutorDashboardNav current="ho-so" />
      <h1 className="font-display text-3xl font-medium text-ink">Hồ sơ gia sư</h1>
      <p className="mt-1 text-muted">
        Điền đầy đủ để phụ huynh dễ tìm thấy và tin tưởng chọn bạn hơn.
      </p>

      {stats && (
        <div className="mt-4 flex gap-6 rounded-xl border border-line bg-paper-raised p-4 text-sm">
          <div>
            <div className="text-muted">Học sinh đã nhận</div>
            <div className="font-display text-lg font-medium text-ink">{stats.studentsAccepted}</div>
          </div>
          <div>
            <div className="text-muted">Đánh giá trung bình</div>
            <div className="font-display text-lg font-medium text-ink">
              {stats.ratingAvg.toFixed(1)} ({stats.ratingCount})
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex max-w-2xl flex-col gap-5">
        <Textarea
          label="Giới thiệu bản thân"
          name="bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Kinh nghiệm, phương pháp dạy, điểm mạnh của bạn..."
        />

        <div>
          <span className="text-sm font-medium text-ink">Môn dạy</span>
          <div className="mt-2 flex flex-col gap-3">
            {SUBJECT_GROUPS.map((group) => (
              <div key={group.category}>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  {group.category}
                </span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {group.subjects.map((s) => {
                    const active = subjects.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSubject(s)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          active
                            ? "border-brand bg-brand-tint text-brand-deep"
                            : "border-line text-ink hover:border-brand"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-ink">Có thể dạy lớp</span>
          <p className="text-xs text-muted">Chọn từng lớp cụ thể bạn nhận dạy</p>
          <div className="mt-2 flex flex-col gap-3">
            {CLASS_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">{cat.category}</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {cat.classes.map((c) => {
                    const active = classGroups.includes(c.value);
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => toggleClassGroup(c.value)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          active
                            ? "border-brand bg-brand-tint text-brand-deep"
                            : "border-line text-ink hover:border-brand"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Input
          label="Khu vực dạy"
          name="region"
          required
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="VD: Quận 1, TP.HCM"
        />

        <div>
          <span className="text-sm font-medium text-ink">Hình thức dạy</span>
          <div className="mt-1.5 grid grid-cols-3 gap-2 rounded-lg border border-line p-1">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTeachingMode(opt.value)}
                className={`rounded-md py-2 text-sm font-medium transition-colors ${
                  teachingMode === opt.value ? "bg-brand text-white" : "text-muted hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Học phí (đ/buổi)"
            name="hourlyRate"
            type="number"
            min={0}
            step={10000}
            required
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="150000"
          />
          <Input
            label="Số năm kinh nghiệm"
            name="experienceYears"
            type="number"
            min={0}
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
          />
        </div>

        <Input
          label="Trình độ học vấn"
          name="educationLevel"
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
          placeholder="VD: SV năm 3 - ĐH Bách Khoa"
        />
        <Input
          label="Từng học tại trường"
          name="schoolStudiedAt"
          value={schoolStudiedAt}
          onChange={(e) => setSchoolStudiedAt(e.target.value)}
          placeholder="VD: THPT Chuyên Lê Hồng Phong"
        />
        <Textarea
          label="Thành tích"
          name="achievements"
          rows={3}
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          placeholder="Giải thưởng, thành tích học tập/giảng dạy nổi bật..."
        />
        <Textarea
          label="Chứng chỉ (mỗi dòng 1 chứng chỉ)"
          name="certificates"
          rows={3}
          value={certificatesText}
          onChange={(e) => setCertificatesText(e.target.value)}
          placeholder={"IELTS 8.0\nChứng chỉ Sư phạm"}
        />

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-brand-tint px-3 py-2 text-sm text-brand-deep" role="status">
            Đã lưu hồ sơ thành công!
          </p>
        )}

        <Button type="submit" loading={saving} className="self-start">
          Lưu hồ sơ
        </Button>
      </form>
    </div>
  );
}
