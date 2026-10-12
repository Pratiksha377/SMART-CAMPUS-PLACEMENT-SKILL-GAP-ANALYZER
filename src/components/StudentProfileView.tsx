import React from 'react';
import {
  StudentProfile,
  DocumentMetadata,
  DocumentType,
} from '@/types/profile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Tag } from './ui/Tag';
import { Button } from './ui/Button';
import { DocumentList } from './DocumentList';
import { FileUploader } from './FileUploader';
import {
  GraduationCap,
  Sparkles,
  Briefcase,
  FolderGit2,
  FileText,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  Award,
  Edit3,
} from 'lucide-react';

export interface StudentProfileViewProps {
  profile: StudentProfile;
  onEditToggle?: () => void;
  onDeleteDocument: (id: string) => Promise<boolean>;
  onReplaceDocument: (id: string, file: File, type?: DocumentType) => Promise<unknown>;
  onUploadDocument: (file: File, type: DocumentType) => Promise<unknown>;
  isUploadingDoc?: boolean;
  className?: string;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  profile,
  onEditToggle,
  onDeleteDocument,
  onReplaceDocument,
  onUploadDocument,
  isUploadingDoc = false,
  className = '',
}) => {
  return (
    <div className={`space-y-8 font-sans ${className}`} data-testid="student-profile-view">
      {/* 1. Header Hero Card */}
      <Card variant="glass" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white font-bold text-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25 shrink-0 border border-indigo-400/30">
              {profile.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                  {profile.fullName}
                </h2>
                <Badge variant="primary" dot size="sm">
                  Active Student
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {profile.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  CGPA: <strong>{profile.education.cgpa.toFixed(2)}</strong> / 10.0
                </span>
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-300 mt-3 max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {onEditToggle && (
            <Button
              variant="outline"
              size="md"
              onClick={onEditToggle}
              leftIcon={<Edit3 className="w-4 h-4" />}
              className="shrink-0"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Academics, Skills, Projects, Experience */}
        <div className="lg:col-span-2 space-y-6">
          {/* Education Card */}
          <Card variant="glass" padding="lg">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Academic Qualifications</CardTitle>
                  <CardDescription>Verified institutional degree credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {profile.education.degree} in {profile.education.fieldOfStudy}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {profile.education.institution}
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    Class of {profile.education.graduationYear}
                  </Badge>
                </div>

                <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 border-t border-slate-800/80">
                  <span>
                    Graduation Year: <strong>{profile.education.graduationYear}</strong>
                  </span>
                  <span>
                    Cumulative CGPA: <strong className="text-indigo-400">{profile.education.cgpa}</strong>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Skills Card */}
          <Card variant="glass" padding="lg">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Skills & Proficiencies</CardTitle>
                  <CardDescription>Industry competencies evaluated for placement matching</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2.5">
                {profile.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-200">{skill.name}</span>
                    <Badge
                      variant={
                        skill.proficiency === 'Expert' || skill.proficiency === 'Advanced'
                          ? 'primary'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {skill.proficiency}
                    </Badge>
                    {skill.endorsements !== undefined && skill.endorsements > 0 && (
                      <span className="text-[10px] text-slate-500">+{skill.endorsements}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects Card */}
          <Card variant="glass" padding="lg">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Portfolio & Projects</CardTitle>
                  <CardDescription>Technical implementations and software solutions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {profile.projects.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No projects recorded yet.</p>
              ) : (
                <div className="space-y-3.5">
                  {profile.projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-100">{proj.name}</h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
                          >
                            <span>Live Code / Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.technologies.map((t) => (
                            <Tag key={t} label={t} size="sm" variant="default" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience Card */}
          {profile.experience && profile.experience.length > 0 && (
            <Card variant="glass" padding="lg">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle>Experience & Internships</CardTitle>
                    <CardDescription>Professional roles and practical contributions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3.5">
                  {profile.experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-100">{exp.role}</h4>
                          <p className="text-xs text-indigo-400 font-medium">{exp.company}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exp.startDate} – {exp.endDate || 'Present'}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-slate-400 leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (1 Col): Documents & Uploads */}
        <div className="space-y-6">
          <Card variant="glass" padding="lg">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Resumes & transcripts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <DocumentList
                  documents={profile.documents || []}
                  onDelete={onDeleteDocument}
                  onReplace={onReplaceDocument}
                />

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 mb-3">
                    Upload New Document
                  </h4>
                  <FileUploader
                    onUpload={onUploadDocument}
                    isUploading={isUploadingDoc}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;
