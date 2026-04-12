/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Lock, 
  LogIn, 
  Info, 
  HelpCircle, 
  Monitor, 
  ShieldCheck,
  ExternalLink,
  Settings,
  ArrowLeft,
  Link as LinkIcon,
  Save,
  CheckCircle2,
  GraduationCap,
  Key,
  AlertCircle,
  FileText,
  Clock,
  Plus,
  Trash2,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Exam {
  id: string;
  subject: string;
  link: string;
  token: string;
  duration: string;
  enrolledMajorIds: string[];
}

interface Major {
  id: string;
  name: string;
}

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoginData, setAdminLoginData] = useState({ username: "", password: "" });
  const [adminLoginError, setAdminLoginError] = useState(false);
  const [adminTab, setAdminTab] = useState<"majors" | "exams" | "settings">("majors");
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [inputToken, setInputToken] = useState("");
  const [tokenError, setTokenError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddMajorDialogOpen, setIsAddMajorDialogOpen] = useState(false);
  const [newMajorName, setNewMajorName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{ id: string; type: "major" | "exam"; name: string } | null>(null);

  // Initial Majors Data
  const [majors, setMajors] = useState<Major[]>([
    { id: "tkj", name: "Teknik Komputer & Jaringan" },
    { id: "rpl", name: "Rekayasa Perangkat Lunak" },
    { id: "akl", name: "Akuntansi" },
    { id: "otkp", name: "Perkantoran" },
  ]);

  // Initial Exams Data with Enrollment Model
  const [exams, setExams] = useState<Exam[]>([
    { 
      id: "tkj-1", 
      subject: "Dasar Desain Grafis", 
      link: "https://forms.google.com", 
      token: "DDG2026", 
      duration: "90",
      enrolledMajorIds: ["tkj"]
    },
    { 
      id: "tkj-2", 
      subject: "Administrasi Sistem Jaringan", 
      link: "https://forms.google.com", 
      token: "ASJ2026", 
      duration: "120",
      enrolledMajorIds: ["tkj"]
    },
    { 
      id: "rpl-1", 
      subject: "Pemrograman Berorientasi Objek", 
      link: "https://forms.google.com", 
      token: "PBO2026", 
      duration: "120",
      enrolledMajorIds: ["rpl"]
    },
    { 
      id: "rpl-2", 
      subject: "Basis Data", 
      link: "https://forms.google.com", 
      token: "BD2026", 
      duration: "90",
      enrolledMajorIds: ["rpl"]
    }
  ]);

  // Global Exam Settings
  const [examSettings, setExamSettings] = useState({
    title: "Ujian Sekolah Utama 2026",
    status: "Aktif",
    schoolName: "SMK Negeri Digital"
  });

  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const handleStartExam = () => {
    if (!selectedExam) return;
    
    if (inputToken.toUpperCase() === selectedExam.token.toUpperCase()) {
      setIsLoading(true);
      setTokenError(false);
      setTimeout(() => {
        window.location.href = selectedExam.link;
      }, 1000);
    } else {
      setTokenError(true);
    }
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;

    setIsLoading(true);
    setTimeout(() => {
      setExams(prev => prev.map(ex => ex.id === editingExam.id ? editingExam : ex));
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 800);
  };

  const handleAddMajor = () => {
    setNewMajorName("");
    setIsAddMajorDialogOpen(true);
  };

  const confirmAddMajor = () => {
    if (!newMajorName.trim()) return;
    const newId = `new-${Date.now()}`;
    const newMajor: Major = {
      id: newId,
      name: newMajorName
    };
    setMajors([...majors, newMajor]);
    setEditingMajor(newMajor);
    setIsAddMajorDialogOpen(false);
  };

  const handleDeleteMajor = (id: string) => {
    const major = majors.find(m => m.id === id);
    if (!major) return;
    setDeleteConfig({ id, type: "major", name: major.name });
    setIsDeleteDialogOpen(true);
  };

  const handleAddExam = () => {
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      subject: "Mata Pelajaran Baru",
      link: "https://forms.google.com",
      token: "TOKEN123",
      duration: "90",
      enrolledMajorIds: editingMajor ? [editingMajor.id] : []
    };
    setExams([...exams, newExam]);
    setEditingExam(newExam);
  };

  const handleDeleteExam = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;
    setDeleteConfig({ id: examId, type: "exam", name: exam.subject });
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = () => {
    if (!deleteConfig) return;

    if (deleteConfig.type === "major") {
      setMajors(majors.filter(m => m.id !== deleteConfig.id));
      setExams(exams.map(ex => ({
        ...ex,
        enrolledMajorIds: ex.enrolledMajorIds.filter(mId => mId !== deleteConfig.id)
      })));
      if (editingMajor?.id === deleteConfig.id) setEditingMajor(null);
    } else {
      setExams(exams.filter(e => e.id !== deleteConfig.id));
      if (editingExam?.id === deleteConfig.id) setEditingExam(null);
    }

    setIsDeleteDialogOpen(false);
    setDeleteConfig(null);
  };

  const toggleMajorEnrollment = (majorId: string) => {
    if (!editingExam) return;
    
    const isEnrolled = editingExam.enrolledMajorIds.includes(majorId);
    const newEnrolledIds = isEnrolled
      ? editingExam.enrolledMajorIds.filter(id => id !== majorId)
      : [...editingExam.enrolledMajorIds, majorId];
      
    setEditingExam({ ...editingExam, enrolledMajorIds: newEnrolledIds });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLoginData.username === "admin" && adminLoginData.password === "admin") {
      setIsAdminAuthenticated(true);
      setAdminLoginError(false);
    } else {
      setAdminLoginError(true);
    }
  };

  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="border-t-4 border-t-blue-600 shadow-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>Masukkan kredensial untuk akses panel</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-user">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        id="admin-user"
                        placeholder="Username"
                        className="pl-10"
                        value={adminLoginData.username}
                        onChange={e => setAdminLoginData({...adminLoginData, username: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-pass">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        id="admin-pass"
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        value={adminLoginData.password}
                        onChange={e => setAdminLoginData({...adminLoginData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  {adminLoginError && (
                    <p className="text-xs text-red-600 flex items-center gap-1 font-medium bg-red-50 p-2 rounded">
                      <AlertCircle className="w-3 h-3" /> Username atau Password salah!
                    </p>
                  )}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold">
                    MASUK PANEL
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-500"
                  onClick={() => setIsAdminView(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <header className="bg-slate-900 text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">ADMIN PANEL US 2026</h1>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setIsAdminView(false);
                setIsAdminAuthenticated(false);
                setAdminLoginData({ username: "", password: "" });
                setEditingMajor(null);
                setEditingExam(null);
              }}
              className="text-white hover:bg-slate-800 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Keluar Panel
            </Button>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <Dialog open={isAddMajorDialogOpen} onOpenChange={setIsAddMajorDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Jurusan Baru</DialogTitle>
                <DialogDescription>
                  Masukkan nama jurusan baru yang ingin Anda tambahkan ke sistem.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="new-major-name">Nama Jurusan</Label>
                <Input
                  id="new-major-name"
                  placeholder="Contoh: Teknik Mesin"
                  value={newMajorName}
                  onChange={(e) => setNewMajorName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmAddMajor();
                  }}
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMajorDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={confirmAddMajor} disabled={!newMajorName.trim()}>
                  Tambah Jurusan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Konfirmasi Hapus
                </DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus {deleteConfig?.type === "major" ? "jurusan" : "mata ujian"} <strong>{deleteConfig?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={executeDelete}>
                  Hapus Sekarang
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase px-4 mb-2 tracking-widest">Menu Utama</p>
              <Button 
                variant={adminTab === "majors" ? "secondary" : "ghost"} 
                onClick={() => setAdminTab("majors")}
                className={`w-full justify-start gap-3 h-11 ${adminTab === "majors" ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600"}`}
              >
                <GraduationCap className="w-4 h-4" /> Manajemen Jurusan
              </Button>
              <Button 
                variant={adminTab === "exams" ? "secondary" : "ghost"} 
                onClick={() => setAdminTab("exams")}
                className={`w-full justify-start gap-3 h-11 ${adminTab === "exams" ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600"}`}
              >
                <FileText className="w-4 h-4" /> Manajemen Soal
              </Button>
              <Button 
                variant={adminTab === "settings" ? "secondary" : "ghost"} 
                onClick={() => setAdminTab("settings")}
                className={`w-full justify-start gap-3 h-11 ${adminTab === "settings" ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600"}`}
              >
                <Clock className="w-4 h-4" /> Manajemen Ujian
              </Button>
            </aside>

            {/* Content Area */}
            <div className="flex-grow">
              {adminTab === "majors" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Manajemen Jurusan</h2>
                    <Button onClick={handleAddMajor} className="bg-blue-600 hover:bg-blue-700 gap-2">
                      <Plus className="w-4 h-4" /> Tambah Jurusan
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {majors.map(major => (
                      <Card key={major.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <GraduationCap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{major.name}</h3>
                              <p className="text-xs text-gray-500 uppercase font-mono">{major.id} &bull; {exams.filter(ex => ex.enrolledMajorIds.includes(major.id)).length} Mata Ujian</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditingMajor(major);
                              setAdminTab("exams");
                            }}>
                              Kelola Soal
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteMajor(major.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === "exams" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Manajemen Soal</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                      <div>
                        <div className="flex items-center justify-between px-2 mb-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Daftar Soal</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600" onClick={handleAddExam}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {exams.map(e => (
                            <div key={e.id} className="flex items-center gap-1 group">
                              <Button 
                                variant={editingExam?.id === e.id ? "secondary" : "ghost"}
                                onClick={() => setEditingExam(e)}
                                className={`flex-grow justify-start text-xs h-9 ${editingExam?.id === e.id ? "bg-blue-100 text-blue-800" : ""}`}
                              >
                                {e.subject}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteExam(e.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          {exams.length === 0 && (
                            <p className="text-[10px] text-gray-400 text-center py-4 italic">Belum ada soal</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      {editingExam ? (
                        <Card>
                          <CardHeader>
                            <CardTitle>Konfigurasi Mata Ujian</CardTitle>
                            <CardDescription>ID: {editingExam.id}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <form onSubmit={handleSaveExam} className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Nama Mata Pelajaran</Label>
                                  <Input 
                                    value={editingExam.subject}
                                    onChange={(e) => setEditingExam({ ...editingExam, subject: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Link Google Form / Drive</Label>
                                  <Input 
                                    value={editingExam.link}
                                    onChange={(e) => setEditingExam({ ...editingExam, link: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Token Akses</Label>
                                    <Input 
                                      className="font-mono uppercase"
                                      value={editingExam.token}
                                      onChange={(e) => setEditingExam({ ...editingExam, token: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Durasi (Menit)</Label>
                                    <Input 
                                      type="number"
                                      value={editingExam.duration}
                                      onChange={(e) => setEditingExam({ ...editingExam, duration: e.target.value })}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3 pt-4 border-t">
                                <Label className="text-blue-700 font-bold flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4" /> Enrolment Jurusan
                                </Label>
                                <p className="text-[10px] text-gray-500 mb-2">Pilih jurusan yang dapat mengakses mata ujian ini</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border">
                                  {majors.map(major => (
                                    <div key={major.id} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`enroll-${major.id}`} 
                                        checked={editingExam.enrolledMajorIds.includes(major.id)}
                                        onCheckedChange={() => toggleMajorEnrollment(major.id)}
                                      />
                                      <label
                                        htmlFor={`enroll-${major.id}`}
                                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                      >
                                        {major.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Button type="submit" className="w-full bg-blue-600" disabled={isLoading}>
                                {isLoading ? "Menyimpan..." : isSaved ? "Berhasil Disimpan!" : "Simpan Perubahan"}
                              </Button>
                            </form>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-gray-400 bg-white">
                          <FileText className="w-12 h-12 mb-2 opacity-10" />
                          <p>Pilih atau tambah mata ujian untuk mengedit</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {adminTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Manajemen Ujian</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Pengaturan Global</CardTitle>
                      <CardDescription>Konfigurasi yang muncul di halaman depan siswa</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Sekolah</Label>
                          <Input value={examSettings.schoolName} onChange={e => setExamSettings({...examSettings, schoolName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Judul Ujian</Label>
                          <Input value={examSettings.title} onChange={e => setExamSettings({...examSettings, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Status Sistem</Label>
                          <select 
                            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm"
                            value={examSettings.status}
                            onChange={e => setExamSettings({...examSettings, status: e.target.value})}
                          >
                            <option>Aktif</option>
                            <option>Maintenance</option>
                            <option>Selesai</option>
                          </select>
                        </div>
                      </div>
                      <Button className="w-full bg-slate-800 hover:bg-slate-900 gap-2" onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                          setIsSaved(true);
                          setTimeout(() => setIsSaved(false), 2000);
                        }, 500);
                      }}>
                        {isSaved ? "Pengaturan Disimpan!" : "Update Pengaturan Global"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-[#0056b3] text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-full text-[#0056b3]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight uppercase tracking-tight">{examSettings.schoolName}</h1>
              <p className="text-xs opacity-90 uppercase tracking-widest font-medium">{examSettings.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAdminView(true)}
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#0056b3] transition-all"
            >
              <Settings className="w-4 h-4 mr-2" /> Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl z-10"
        >
          {examSettings.status === "Maintenance" ? (
            <Card className="text-center p-12 space-y-4">
              <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <CardTitle className="text-2xl">Sistem Maintenance</CardTitle>
              <CardDescription>Mohon maaf, sistem sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.</CardDescription>
            </Card>
          ) : !selectedMajor ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">Pilih Jurusan Anda</h2>
                <p className="text-gray-500">Silakan pilih kompetensi keahlian untuk memulai ujian</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {majors.map((major) => (
                  <motion.button
                    key={major.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMajor(major)}
                    className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-100 hover:border-[#0056b3] transition-all flex items-center gap-4 text-left group"
                  >
                    <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-[#0056b3] transition-colors">
                      <GraduationCap className="w-6 h-6 text-[#0056b3] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0056b3] uppercase tracking-wider">{major.id.includes('new') ? 'NEW' : major.id}</p>
                      <h3 className="font-bold text-gray-800 leading-tight">{major.name}</h3>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : !selectedExam ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedMajor(null)}
                  className="text-gray-500"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Pilih Mata Ujian</h2>
                  <p className="text-sm text-gray-500">{selectedMajor.name}</p>
                </div>
              </div>
              
              {exams.filter(ex => ex.enrolledMajorIds.includes(selectedMajor.id)).length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {exams
                    .filter(ex => ex.enrolledMajorIds.includes(selectedMajor.id))
                    .map((exam) => (
                      <motion.button
                        key={exam.id}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedExam(exam)}
                        className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-[#0056b3] flex items-center justify-between group hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-[#0056b3]" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-gray-800">{exam.subject}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exam.duration} Menit</span>
                              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Token Required</span>
                            </div>
                          </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-gray-300 rotate-180 group-hover:text-[#0056b3] transition-colors" />
                      </motion.button>
                    ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada jadwal ujian untuk jurusan ini.</p>
                </div>
              )}
            </div>
          ) : (
            <Card className="border-t-4 border-t-[#0056b3] shadow-xl max-w-md mx-auto">
              <CardHeader className="space-y-1 text-center pb-2 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-2 text-gray-400"
                  onClick={() => {
                    setSelectedExam(null);
                    setInputToken("");
                    setTokenError(false);
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="mx-auto bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-[#0056b3]" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Konfirmasi Tes</CardTitle>
                <CardDescription>
                  Mata Ujian: <span className="font-bold text-[#0056b3]">{selectedExam.subject}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Jurusan:</span>
                    <span className="font-bold text-gray-800">{selectedMajor.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Waktu:</span>
                    <span className="font-bold text-gray-800">{selectedExam.duration} Menit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-bold text-green-600">Siap Dikerjakan</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token" className="text-sm font-bold text-gray-700">Masukkan Token Ujian</Label>
                  <div className="relative">
                    <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tokenError ? "text-red-400" : "text-gray-400"}`} />
                    <Input 
                      id="token"
                      placeholder="TOKEN"
                      value={inputToken}
                      onChange={(e) => {
                        setInputToken(e.target.value);
                        setTokenError(false);
                      }}
                      className={`pl-10 h-12 font-mono text-center text-lg tracking-[0.5em] uppercase border-2 ${tokenError ? "border-red-500 bg-red-50 focus:ring-red-500" : "border-gray-200 focus:ring-[#0056b3]"}`}
                    />
                  </div>
                  {tokenError && (
                    <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> Token yang Anda masukkan salah!
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleStartExam}
                  className="w-full h-14 bg-[#0056b3] hover:bg-blue-700 text-white font-bold text-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Menyiapkan..." : "MULAI UJIAN"}
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
                <div className="w-full border-t border-gray-100 my-2" />
                <p className="text-xs text-center text-gray-500 italic">
                  *Token diberikan oleh pengawas ruangan.
                </p>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/1200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png" 
              alt="Kemendikbudristek" 
              className="h-12 w-auto grayscale opacity-70"
              referrerPolicy="no-referrer"
            />
            <div className="text-left hidden md:block border-l border-gray-300 pl-4">
              <p className="text-xs font-bold text-gray-600 uppercase">Portal Ujian Sekolah Digital</p>
              <p className="text-[10px] text-gray-500 uppercase">Dinas Pendidikan dan Kebudayaan</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            &copy; 2026 Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Seluruh Hak Cipta Dilindungi.
          </p>
          <p className="text-[10px] text-gray-300 mt-1">Version 2.4.0-release</p>
        </div>
      </footer>
    </div>
  );
}
