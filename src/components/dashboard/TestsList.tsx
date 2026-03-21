'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useTestStore, type Test } from '@/store/testStore'
import { 
  Search, 
  Plus, 
  MoreVertical,
  FileText,
  Clock,
  Users,
  Trash2,
  Edit,
  Eye,
  Play,
  Copy,
  Globe,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export function TestsList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { 
    tests, 
    deleteTest, 
    duplicateTest, 
    publishTest, 
    unpublishTest,
    getTestAttempts 
  } = useTestStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)

  // Filter tests
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'active') return matchesSearch && test.status === 'active'
    if (activeTab === 'draft') return matchesSearch && test.status === 'draft'
    return matchesSearch
  })

  // Handle delete
  const handleDelete = () => {
    if (testToDelete) {
      deleteTest(testToDelete)
      toast({
        title: 'Test o\'chirildi',
        description: 'Test muvaffaqiyatli o\'chirildi',
      })
      setTestToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  // Handle duplicate
  const handleDuplicate = (id: string) => {
    const newId = duplicateTest(id)
    if (newId) {
      toast({
        title: 'Test nusxalandi',
        description: 'Test muvaffaqiyatli nusxalandi',
      })
    }
  }

  // Handle toggle status
  const handleToggleStatus = (test: Test) => {
    if (test.status === 'active') {
      unpublishTest(test.id)
      toast({
        title: 'Test nashrdan olindi',
        description: 'Test endi faol emas',
      })
    } else {
      publishTest(test.id)
      toast({
        title: 'Test nashr etildi',
        description: 'Test endi faol',
      })
    }
  }

  // Handle preview
  const handlePreview = (test: Test) => {
    setSelectedTest(test)
    setShowPreviewDialog(true)
  }

  // Handle edit
  const handleEdit = (testId: string) => {
    router.push(`/testai?view=create&editId=${testId}`)
  }

  // Handle start test
  const handleStartTest = (testId: string) => {
    router.push(`/testai?view=solve&testId=${testId}`)
  }

  // Stats
  const stats = {
    total: tests.length,
    active: tests.filter(t => t.status === 'active').length,
    draft: tests.filter(t => t.status === 'draft').length,
    totalAttempts: tests.reduce((sum, t) => sum + t.attempts, 0),
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Testlarim
          </h1>
          <p className="text-muted-foreground mt-1">
            Barcha yaratilgan testlarni boshqaring
          </p>
        </div>
        <Button className="gap-2" onClick={() => router.push('/testai?view=create')}>
          <Plus className="h-4 w-4" />
          Yangi test
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Jami testlar</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Faol testlar</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
              <p className="text-xs text-muted-foreground">Qoralamalar</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalAttempts}</p>
              <p className="text-xs text-muted-foreground">Urinishlar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Testlarni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              Barchasi ({tests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Faol ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Qoralama ({stats.draft})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tests Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map((test) => (
            <Card key={test.id} className="bg-card border-border hover:border-primary/50 transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <Badge 
                      variant={test.status === 'active' ? 'default' : 'secondary'} 
                      className={`text-xs ${test.status === 'active' ? 'bg-secondary text-secondary-foreground' : ''}`}
                    >
                      {test.status === 'active' ? 'Faol' : 'Qoralama'}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handlePreview(test)} className="cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        Ko'rish
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(test.id)} className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(test.id)} className="cursor-pointer">
                        <Copy className="h-4 w-4 mr-2" />
                        Nusxalash
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(test)} className="cursor-pointer">
                        {test.status === 'active' ? (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-2" />
                            Nashrdan olish
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4 mr-2" />
                            Nashr etish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          setTestToDelete(test.id)
                          setShowDeleteDialog(true)
                        }}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        O'chirish
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-base font-semibold mt-3 line-clamp-2 cursor-pointer hover:text-primary" onClick={() => handlePreview(test)}>
                  {test.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {test.questions.length} savol
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {test.attempts} urinish
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3" />
                  {new Date(test.createdAt).toLocaleDateString('uz-UZ')}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={() => handlePreview(test)}
                  >
                    <Eye className="h-4 w-4" />
                    Ko'rish
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={() => handleStartTest(test.id)}
                    disabled={test.status !== 'active'}
                  >
                    <Play className="h-4 w-4" />
                    Boshlash
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'Test topilmadi' : 'Hali testlar yo\'q'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Qidiruv so\'rovi bo\'yicha test topilmadi' 
              : 'Birinchi testingizni yarating va boshlang'}
          </p>
          <Button onClick={() => router.push('/testai?view=create')}>
            <Plus className="h-4 w-4 mr-2" />
            Test yaratish
          </Button>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedTest?.name}</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div className="space-y-4 overflow-auto flex-1">
              {selectedTest.description && (
                <p className="text-muted-foreground text-sm">{selectedTest.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {selectedTest.questions.length} savol
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {selectedTest.timeLimit || selectedTest.questions.length * 2} daqiqa
                </div>
                <Badge variant={selectedTest.status === 'active' ? 'default' : 'secondary'}>
                  {selectedTest.status === 'active' ? 'Faol' : 'Qoralama'}
                </Badge>
              </div>

              <Separator />

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  {selectedTest.questions.map((q, index) => (
                    <div key={q.id} className="p-4 rounded-xl bg-muted/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <p className="font-medium">{q.text}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 ml-7">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-lg text-sm ${
                              i === q.correctAnswer
                                ? 'bg-secondary/20 text-secondary border border-secondary/30'
                                : 'bg-muted'
                            }`}
                          >
                            <span className="font-medium mr-1">{String.fromCharCode(65 + i)})</span>
                            {opt}
                            {i === q.correctAnswer && (
                              <CheckCircle className="h-4 w-4 inline ml-2 text-secondary" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          <DialogFooter className="gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Yopish
            </Button>
            <Button variant="outline" onClick={() => {
              setShowPreviewDialog(false)
              if (selectedTest) handleEdit(selectedTest.id)
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Tahrirlash
            </Button>
            <Button 
              onClick={() => {
                setShowPreviewDialog(false)
                if (selectedTest) handleStartTest(selectedTest.id)
              }}
              disabled={selectedTest?.status !== 'active'}
            >
              <Play className="h-4 w-4 mr-2" />
              Testni boshlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Testni o'chirish</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Haqiqatan ham bu testni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Bekor qilish
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
