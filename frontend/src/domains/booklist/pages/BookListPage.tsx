import React, { useEffect, useMemo, useState } from 'react'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    Stack,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

type BookNote = {
    id: string
    title: string
    category: string
    reflection: string
    createdAt: string
    updatedAt: string
}

const STORAGE_KEY = 'suzi_blog_book_notes'

const emptyForm = {
    title: '',
    category: '',
    reflection: '',
}

const nowString = () => new Date().toISOString()

const BookListPage: React.FC = () => {
    const [records, setRecords] = useState<BookNote[]>([])
    const [filterCategory, setFilterCategory] = useState('全部')
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState('')

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
                setRecords(parsed)
            }
        } catch (err) {
            console.error('读取书单数据失败:', err)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    }, [records])

    const categoryOptions = useMemo(() => {
        const set = new Set(records.map(item => item.category).filter(Boolean))
        return ['全部', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-CN'))]
    }, [records])

    useEffect(() => {
        if (filterCategory !== '全部' && !categoryOptions.includes(filterCategory)) {
            setFilterCategory('全部')
        }
    }, [categoryOptions, filterCategory])

    const visibleRecords = useMemo(() => {
        const list = filterCategory === '全部'
            ? records
            : records.filter(item => item.category === filterCategory)

        return [...list].sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
    }, [filterCategory, records])

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm)
        setError('')
        setOpen(true)
    }

    const openEdit = (record: BookNote) => {
        setEditingId(record.id)
        setForm({
            title: record.title,
            category: record.category,
            reflection: record.reflection,
        })
        setError('')
        setOpen(true)
    }

    const handleSave = () => {
        if (!form.title.trim() || !form.category.trim()) {
            setError('请填写书名和分类')
            return
        }

        const timestamp = nowString()
        if (editingId) {
            setRecords(prev => prev.map(item => (
                item.id === editingId
                    ? {
                        ...item,
                        title: form.title.trim(),
                        category: form.category.trim(),
                        reflection: form.reflection.trim(),
                        updatedAt: timestamp,
                    }
                    : item
            )))
        } else {
            const newRecord: BookNote = {
                ...form,
                title: form.title.trim(),
                category: form.category.trim(),
                reflection: form.reflection.trim(),
                id: typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                createdAt: timestamp,
                updatedAt: timestamp,
            }
            setRecords(prev => [newRecord, ...prev])
        }

        setOpen(false)
        setEditingId(null)
    }

    const handleDelete = (id: string) => {
        const target = records.find(item => item.id === id)
        if (!target) return

        const canDelete = window.confirm(`确认删除「${target.title}」吗？`)
        if (!canDelete) return

        setRecords(prev => prev.filter(item => item.id !== id))
        if (filterCategory !== '全部') {
            const remaining = records.filter(item => item.id !== id)
            if (!remaining.some(item => item.category === filterCategory)) {
                setFilterCategory('全部')
            }
        }
    }

    const closeDialog = () => {
        setOpen(false)
        setEditingId(null)
        setError('')
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                书单感想
            </Typography>

            <Paper sx={{ p: 2, mb: 3, borderRadius: '14px', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    select
                    label="分类筛选"
                    value={filterCategory}
                    size="small"
                    onChange={(e) => setFilterCategory(e.target.value)}
                    sx={{ minWidth: 160 }}
                >
                    {categoryOptions.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={openCreate}
                >
                    新增感想
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                    共 {records.length} 条
                </Typography>
            </Paper>

            <Stack spacing={2}>
                {visibleRecords.length === 0 ? (
                    <Alert severity="info">
                        还没有这类记录，点右上角「新增感想」先写第一篇。
                    </Alert>
                ) : (
                    visibleRecords.map((record) => (
                        <Card key={record.id} sx={{ borderRadius: '14px', border: '1px solid #e5e7eb' }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h6">{record.title}</Typography>
                                        <Chip label={record.category} size="small" color="primary" />
                                    </Stack>
                                    <Stack direction="row" spacing={0.5}>
                                        <IconButton size="small" onClick={() => openEdit(record)} aria-label={`编辑 ${record.title}`}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(record.id)} aria-label={`删除 ${record.title}`}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>感想</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                                    {record.reflection || '暂无感想'}
                                </Typography>

                                <Typography variant="caption" color="text.disabled">
                                    最近更新：{new Date(record.updatedAt).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Stack>

            <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
                <DialogTitle>{editingId ? '编辑书单记录' : '新增书单记录'}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        请记录每本书的分类、感想和你从中学到的知识。
                    </DialogContentText>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        fullWidth
                        label="书名"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="分类"
                        value={form.category}
                        onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="感想"
                        value={form.reflection}
                        onChange={(e) => setForm(prev => ({ ...prev, reflection: e.target.value }))}
                        multiline
                        minRows={3}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeDialog}>取消</Button>
                    <Button variant="contained" onClick={handleSave}>
                        保存
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default BookListPage
